// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {Profile} from '../models/profile.entity';

@Injectable({
  providedIn: 'root'
})
export class ProfileClientService {
  // For demo purposes, using a simulated mock API
  private apiUrl = 'api/profile'; // Replace with your actual API endpoint

  // Mock data to simulate API responses
  private mockProfile: Profile = {
    accountId: 'acc8',
    name: 'Emilia Perez',
    email: 'emiliaperez@gmail.com',
    phoneNumber: '966584256',
    identityDocument: '78994552',
    notifications: false,
    location: false
  };

  constructor(private http: HttpClient) { }

  /**
   * Get user profile information
   */
  getProfile(): Observable<Profile> {
    // For real API implementation:
    // return this.http.get<Profile>(this.apiUrl);

    // Mock implementation:
    return of(this.mockProfile).pipe(delay(800)); // Simulating network delay
  }

  /**
   * Update user profile information
   */
  updateProfile(profile: Profile): Observable<Profile> {
    // For real API implementation:
    // return this.http.put<Profile>(this.apiUrl, profile);

    // Mock implementation:
    this.mockProfile = { ...profile };
    return of(this.mockProfile).pipe(delay(800));
  }

  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // For real API implementation:
    // return this.http.post<boolean>(`${this.apiUrl}/change-password`, { currentPassword, newPassword });

    // Mock implementation:
    return of(true).pipe(delay(800));
  }

  /**
   * Log out user
   */
  logout(): Observable<boolean> {
    // For real API implementation:
    // return this.http.post<boolean>(`${this.apiUrl}/logout`, {});

    // Mock implementation:
    return of(true).pipe(delay(300));
  }

  /**
   * Delete user account
   */
  deleteAccount(): Observable<boolean> {
    // For real API implementation:
    // return this.http.delete<boolean>(this.apiUrl);

    // Mock implementation:
    return of(true).pipe(delay(800));
  }
}
