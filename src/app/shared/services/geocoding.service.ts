import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name?: string;
}

/** Sugerencia de dirección normalizada para la UI. */
export interface AddressSuggestion {
  displayName: string;
  lat: number;
  lon: number;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly searchUrl = 'https://nominatim.openstreetmap.org/search';
  private readonly reverseUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  /** Devuelve una única coincidencia como "direccion|lat,lon" (compatibilidad previa). */
  geocodeAddress(address: string): Observable<string> {
    const params = new HttpParams()
      .set('q', address)
      .set('format', 'json')
      .set('limit', '1')
      .set('addressdetails', '1');

    return this.http.get<NominatimSearchResult[]>(this.searchUrl, { params }).pipe(
      map(results => {
        const firstMatch = results[0];

        if (!firstMatch) {
          throw new Error('Address could not be geocoded');
        }

        return `${address}|${firstMatch.lat},${firstMatch.lon}`;
      })
    );
  }

  /** Autocompletado: lista de direcciones que coinciden con el texto escrito. */
  searchAddresses(query: string): Observable<AddressSuggestion[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('limit', '6')
      .set('addressdetails', '1');

    return this.http.get<NominatimSearchResult[]>(this.searchUrl, { params }).pipe(
      map(results =>
        results.map(r => ({
          displayName: r.display_name ?? '',
          lat: Number(r.lat),
          lon: Number(r.lon)
        }))
      )
    );
  }

  /** Reverse geocoding: convierte coordenadas (p. ej. GPS del navegador) en una dirección. */
  reverseGeocode(lat: number, lon: number): Observable<AddressSuggestion> {
    const params = new HttpParams()
      .set('lat', String(lat))
      .set('lon', String(lon))
      .set('format', 'json')
      .set('addressdetails', '1');

    return this.http.get<NominatimSearchResult>(this.reverseUrl, { params }).pipe(
      map(r => ({
        displayName: r.display_name ?? '',
        lat: Number(r.lat),
        lon: Number(r.lon)
      }))
    );
  }
}
