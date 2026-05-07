import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface NominatimSearchResult {
  lat: string;
  lon: string;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly searchUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

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
}
