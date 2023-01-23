import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomGoogleMapsService {
  private readonly _API_KEY = 'AIzaSyBNzlmMA5EiTGjXI3t3QUICkuM57Me9iCc';

  constructor(private _httpClient: HttpClient) {}

  snapToRoads(parameters: string) {
    const ROADS_API_ENDPOINT = 'https://roads.googleapis.com/v1/snapToRoads';
    return this._httpClient.get(
      `${ROADS_API_ENDPOINT}?interpolate=true&path=${parameters}&key=${this._API_KEY}`
    );
  }

  getDirections(
    origin: string,
    destination: string,
    waypoints?: string[]
  ): Observable<google.maps.DirectionsResult> {
    const DIRECTIONS_API_ENDPOINT =
      'https://maps.googleapis.com/maps/api/directions/json';
    const waypointsStringParam: string =
      waypoints && waypoints.length
        ? waypoints.reduce((a, b) => a + b + '%7C', '&waypoints=')
        : '';
    return this._httpClient.get<google.maps.DirectionsResult>(
      `${DIRECTIONS_API_ENDPOINT}?destination=${destination}&origin=${origin}${waypointsStringParam}&key=${this._API_KEY}`
    );
  }
}
