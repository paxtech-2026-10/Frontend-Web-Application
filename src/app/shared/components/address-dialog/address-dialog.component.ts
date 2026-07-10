import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import * as L from 'leaflet';
import { AddressSuggestion, GeocodingService } from '../../services/geocoding.service';

export interface AddressDialogResult {
  address: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './address-dialog.component.html',
  styleUrl: './address-dialog.component.css'
})
export class AddressDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  searchControl = new FormControl('');
  suggestions: AddressSuggestion[] = [];
  selected: AddressSuggestion | null = null;
  loadingSuggestions = false;
  locating = false;

  private map?: L.Map;
  private marker?: L.Marker;
  private readonly sub = new Subscription();

  // Centro por defecto (Lima, Perú) hasta que se elija una dirección.
  private readonly defaultCenter: L.LatLngExpression = [-12.0464, -77.0428];

  private readonly dialogRef = inject(MatDialogRef<AddressDialogComponent>);
  private readonly geocoding = inject(GeocodingService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    // Autocompletado con debounce: busca al dejar de escribir (>= 3 caracteres).
    this.sub.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(value => {
            const query = (value ?? '').trim();
            if (query.length < 3) {
              this.suggestions = [];
              this.loadingSuggestions = false;
              return of<AddressSuggestion[]>([]);
            }
            this.loadingSuggestions = true;
            return this.geocoding.searchAddresses(query).pipe(catchError(() => of<AddressSuggestion[]>([])));
          })
        )
        .subscribe(list => {
          this.suggestions = list;
          this.loadingSuggestions = false;
        })
    );
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      center: this.defaultCenter,
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Al hacer clic en el mapa, se resuelve la dirección de ese punto.
    this.map.on('click', (e: L.LeafletMouseEvent) => this.pickFromMap(e.latlng.lat, e.latlng.lng));

    // El diálogo se anima al abrir; recalcula el tamaño para que el mapa se pinte bien.
    setTimeout(() => this.map?.invalidateSize(), 250);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.map?.remove();
  }

  /** Elige una sugerencia del autocompletado. */
  selectSuggestion(suggestion: AddressSuggestion): void {
    this.applySelection(suggestion, true);
  }

  /** Usa la ubicación actual del navegador (GPS) y la convierte en dirección. */
  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.snackBar.open('Geolocation is not supported by this browser', 'Close', { duration: 3000, panelClass: 'u-snack-error' });
      return;
    }
    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        this.sub.add(
          this.geocoding.reverseGeocode(latitude, longitude).pipe(catchError(() => of(null))).subscribe(result => {
            this.locating = false;
            if (!result) {
              this.snackBar.open('Could not resolve your current address', 'Close', { duration: 3000, panelClass: 'u-snack-error' });
              return;
            }
            this.applySelection(result, true);
          })
        );
      },
      () => {
        this.locating = false;
        this.snackBar.open('Location permission denied or unavailable', 'Close', { duration: 3000, panelClass: 'u-snack-error' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  save(): void {
    if (!this.selected) return;
    const result: AddressDialogResult = {
      address: this.selected.displayName,
      lat: this.selected.lat,
      lon: this.selected.lon
    };
    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }

  /** Resuelve la dirección de un punto del mapa (clic). */
  private pickFromMap(lat: number, lon: number): void {
    this.locating = true;
    this.sub.add(
      this.geocoding.reverseGeocode(lat, lon).pipe(catchError(() => of(null))).subscribe(result => {
        this.locating = false;
        if (result) this.applySelection(result, false);
      })
    );
  }

  /** Fija la selección, actualiza el input y centra el mapa con el marcador. */
  private applySelection(suggestion: AddressSuggestion, recenter: boolean): void {
    this.selected = suggestion;
    this.suggestions = [];
    this.searchControl.setValue(suggestion.displayName, { emitEvent: false });

    const latLng: L.LatLngExpression = [suggestion.lat, suggestion.lon];
    if (!this.map) return;

    if (recenter) this.map.setView(latLng, 16, { animate: true });

    const pin = L.divIcon({
      className: 'u-map-pin',
      html: '<span class="material-icons">location_on</span>',
      iconSize: [40, 40],
      iconAnchor: [20, 38]
    });

    if (this.marker) {
      this.marker.setLatLng(latLng);
    } else {
      this.marker = L.marker(latLng, { icon: pin }).addTo(this.map);
    }
  }
}
