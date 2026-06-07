import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile } from '../models/profile.entity';

interface ClientResource {
  id: number;
  firstName: string;
  lastName: string;
  userId: number;
  profileImageUrl?: string;
}

interface UserResource {
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileClientService {
  private readonly serverBaseUrl = environment.serverBaseUrl;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getProfile(): Observable<Profile> {
    return this.getCurrentClient().pipe(
      switchMap(client => this.getUser(client.userId).pipe(
        map(user => this.toProfile(client, user))
      ))
    );
  }

  updateProfile(profile: Profile): Observable<Profile> {
    const nameParts = this.splitFullName(profile.name);
    if (!nameParts) {
      return throwError(() => new Error('Enter first and last name.'));
    }

    return this.getCurrentClient().pipe(
      switchMap(client => this.http.put<ClientResource>(
        `${this.serverBaseUrl}/clients/${client.id}`,
        {
          firstName: nameParts.firstName,
          lastName: nameParts.lastName,
          profileImageUrl: client.profileImageUrl ?? ''
        },
        this.httpOptions
      ).pipe(
        switchMap(updatedClient => this.getUser(updatedClient.userId).pipe(
          map(user => this.toProfile(updatedClient, user))
        ))
      ))
    );
  }

  changePassword(): Observable<boolean> {
    return throwError(() => new Error('Password changes are not available in this version.'));
  }

  logout(): Observable<boolean> {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('clientId');
    localStorage.removeItem('providerId');
    return of(true);
  }

  deleteAccount(): Observable<boolean> {
    return throwError(() => new Error('Account deletion is not available in this version.'));
  }

  private getCurrentClient(): Observable<ClientResource> {
    const clientId = Number(localStorage.getItem('clientId'));
    if (!clientId) {
      return throwError(() => new Error('No active client session found.'));
    }
    return this.http.get<ClientResource>(`${this.serverBaseUrl}/clients/${clientId}`, this.httpOptions);
  }

  private getUser(userId: number): Observable<UserResource> {
    return this.http.get<UserResource>(`${this.serverBaseUrl}/users/${userId}`, this.httpOptions);
  }

  private toProfile(client: ClientResource, user: UserResource): Profile {
    return {
      accountId: String(client.id),
      name: `${client.firstName} ${client.lastName}`.trim(),
      email: user.email,
      phoneNumber: '',
      identityDocument: '',
      notifications: false,
      location: false,
      profileImageUrl: client.profileImageUrl ?? ''
    };
  }

  private splitFullName(fullName: string): { firstName: string; lastName: string } | null {
    const normalized = fullName.trim().replace(/\s+/g, ' ');
    const [firstName, ...lastNameParts] = normalized.split(' ');
    const lastName = lastNameParts.join(' ');

    if (!firstName || !lastName) return null;
    return { firstName, lastName };
  }
}
