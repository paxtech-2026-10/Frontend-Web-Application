import { Component, OnInit } from '@angular/core';
import { SalonApiService } from '../../services/salon-api.service';
import {ProviderProfile} from '../../models/Salon.entity';
import {SalonItemComponent} from '../salon-item/Salon-item.component';
import {ProviderProfileAssembler} from '../../services/ProviderProfileAssembler';


@Component({
  selector: 'app-salon-list',
  imports: [
    SalonItemComponent
  ],
  templateUrl: './salon-list.component.html',
  styleUrl: './salon-list.component.css'
})
export class SalonListComponent implements OnInit {
  salons: ProviderProfile[] = [];

  // Fotos reales de salón (licencia libre, Pexels) que se aplican a los
  // primeros salones sin imagen. El resto usa la imagen aleatoria de picsum.
  private readonly curatedImages = [
    'salons/salon-1.jpg',
    'salons/salon-2.jpg',
    'salons/salon-3.jpg',
    'salons/salon-4.jpg',
    'salons/salon-5.jpg'
  ];
  private curatedBySalonId = new Map<number, string>();

  constructor(private salonApiService: SalonApiService) {}

  ngOnInit(): void {
    this.salonApiService.getAll().subscribe(salons => {
      this.salons = ProviderProfileAssembler.toEntitiesfromResponse(salons);
      this.assignCuratedImages();
      this.sortByDistanceFromUser();
    });
  }

  /**
   * Devuelve la foto de salón curada asignada a este salón, o undefined si le
   * toca la imagen aleatoria de respaldo.
   */
  curatedImageFor(salon: ProviderProfile): string | undefined {
    return this.curatedBySalonId.get(salon.id);
  }

  /**
   * Asigna las fotos curadas a los primeros salones sin imagen, de forma
   * estable por id (no depende del orden por distancia, que es asíncrono).
   */
  private assignCuratedImages(): void {
    const salonsWithoutImage = this.salons
      .filter(salon => !salon.profileImageURL)
      .sort((a, b) => a.id - b.id)
      .slice(0, this.curatedImages.length);

    this.curatedBySalonId = new Map(
      salonsWithoutImage.map((salon, index) => [salon.id, this.curatedImages[index]])
    );
  }

  private sortByDistanceFromUser(): void {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(position => {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;

      this.salons = this.salons
        .map(salon => ({
          ...salon,
          distanceKm: this.calculateDistanceToSalon(salon, userLatitude, userLongitude)
        }))
        .sort((a, b) => (a.distanceKm ?? Number.MAX_VALUE) - (b.distanceKm ?? Number.MAX_VALUE));
    });
  }

  private calculateDistanceToSalon(salon: ProviderProfile, userLatitude: number, userLongitude: number): number {
    const coordinates = this.parseCoordinates(salon.location);
    if (!coordinates) {
      return Number.MAX_VALUE;
    }

    return this.calculateDistanceInKilometers(
      userLatitude,
      userLongitude,
      coordinates.latitude,
      coordinates.longitude
    );
  }

  private parseCoordinates(location: string): { latitude: number; longitude: number } | null {
    const match = /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/.exec(location ?? '');
    if (!match) {
      return null;
    }

    return {
      latitude: Number(match[1]),
      longitude: Number(match[2])
    };
  }

  private calculateDistanceInKilometers(
    latitudeA: number,
    longitudeA: number,
    latitudeB: number,
    longitudeB: number
  ): number {
    const earthRadiusKm = 6371;
    const deltaLatitude = this.toRadians(latitudeB - latitudeA);
    const deltaLongitude = this.toRadians(longitudeB - longitudeA);
    const haversine =
      Math.sin(deltaLatitude / 2) ** 2 +
      Math.cos(this.toRadians(latitudeA)) *
      Math.cos(this.toRadians(latitudeB)) *
      Math.sin(deltaLongitude / 2) ** 2;

    return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  private toRadians(value: number): number {
    return value * Math.PI / 180;
  }
}
