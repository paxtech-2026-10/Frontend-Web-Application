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

  constructor(private salonApiService: SalonApiService) {}

  ngOnInit(): void {
    this.salonApiService.getAll().subscribe(salons => {
      this.salons = ProviderProfileAssembler.toEntitiesfromResponse(salons);
      this.sortByDistanceFromUser();
    });
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
