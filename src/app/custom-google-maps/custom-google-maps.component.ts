import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Observable, combineLatest, of, take } from 'rxjs';
import { GoogleMap, MapDirectionsResponse, MapDirectionsService } from '@angular/google-maps';
import data from 'src/assets/data.json';

@Component({
  selector: 'app-custom-google-maps',
  templateUrl: './custom-google-maps.component.html',
  styleUrls: ['./custom-google-maps.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomGoogleMapsComponent implements AfterViewInit {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  readonly mapOptions: google.maps.MapOptions;

  constructor(private _mapDirectionsService: MapDirectionsService) {
    this.mapOptions = {
      center: { lat: data[0].lat, lng: data[0].lon },
      zoom: 12,
    };
  }

  ngAfterViewInit(): void {
    const mapRenderer = new google.maps.DirectionsRenderer({
      map: this.googleMap.googleMap
    });

    const locationsParameters = data.map((object) => ({ lat: object.lat, lng: object.lon }));

    this._getRoutes$(locationsParameters)
      .pipe(take(1))
      .subscribe((response: MapDirectionsResponse[]) => {
        mapRenderer.setDirections(response[0].result!);
      }
    );
  }

  private _getRoutes$(parameters: google.maps.LatLngLiteral[]) {
    if (parameters.length < 2) {
      return of();
    }

    const requests: Observable<MapDirectionsResponse>[] = [];
    let i = 0;

    for (i = 0; i < parameters.length - 10; i += 10) {
      const requestParameters: google.maps.DirectionsRequest = {
        origin: parameters[i],
        destination: parameters[i + 11],
        waypoints: parameters.slice(i + 1, i + 11).map((value) => ({location: value})),
        travelMode: google.maps.TravelMode.DRIVING
      };
      requests.push(this._mapDirectionsService.route(requestParameters));
    }

    if (i < parameters.length - 2) {
      const requestParameters: google.maps.DirectionsRequest = {
        origin: parameters[i],
        destination: parameters[parameters.length - 1],
        waypoints: parameters.slice(i, parameters.length - 1).map((value) => ({location: value})),
        travelMode: google.maps.TravelMode.DRIVING
      };
      requests.push(this._mapDirectionsService.route(requestParameters));
    }

    return combineLatest(requests);
  }
}
