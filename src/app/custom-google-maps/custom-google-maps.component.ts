import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomGoogleMapsService } from './custom-google-maps.service';
import { Observable, catchError, combineLatest, map, mergeMap, of } from 'rxjs';
import data from 'src/assets/data.json';


@Component({
  selector: 'app-custom-google-maps',
  templateUrl: './custom-google-maps.component.html',
  styleUrls: ['./custom-google-maps.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomGoogleMapsComponent {
  private _locationsParameters: string[];

  readonly roadLocations$: Observable<any>;

  readonly mapOptions: google.maps.MapOptions;

  readonly polylineOptions: google.maps.PolylineOptions;

  isLoading = true;

  error: any;

  constructor(private _customGoogleMapsService: CustomGoogleMapsService) {
    this.mapOptions = {
      center: { lat: data[0].lat, lng: data[0].lon },
      zoom: 12,
    };

    this.polylineOptions = {
      strokeWeight: 1,
      strokeColor: 'red',
      strokeOpacity: 1,
    };

    this._locationsParameters = data.map((v: any) => `${v.lat}%2C${v.lon}`);

    this.roadLocations$ = this._getSnappedPointsAsStrings(this._locationsParameters)
      .pipe(
        mergeMap(
          (data) => this._getRoutes$(data)
        ),
        catchError((err) => {
          this.error = err;
          console.error(err);
          return of(err);
        }),
      );
  }
  
  private _getRoutes$(parameters: string[]) {
    const observables = [];

    let index = 0;
    
    while(index < parameters.length - 11) {
       observables.push(
         this._customGoogleMapsService
          .getDirections(
            parameters[index],
            parameters[index + 11],
            parameters.slice(index + 1, index + 11)
          )
       )
       index += 10;
    }
    if (index < parameters.length - 1) {
      observables.push(
        this._customGoogleMapsService
          .getDirections(
            parameters[index],
            parameters[parameters.length - 1],
            parameters.slice(index, parameters.length - 2)
          )
      );
    }

    return combineLatest(
      observables
    ).pipe(
      map((data: google.maps.DirectionsResult[]) => {
        return data.map((d) => d.routes[0].legs).reduce((legs, current) => {
          legs.push(...current);
          return legs;
        }, []).map((leg) => leg.steps).reduce((steps, current) => {
          steps.push(...current);
          return steps
        }, []).map((step) => {
          this.isLoading = false;
          return step.start_location
        });
      }),
      catchError((err) => of(err))
    );
  }

  private _getSnappedPointsAsStrings(parameters: string[]) {
    this.isLoading = true;
    this.error = undefined;

    const locationsParameters = [];
    let index = 0;

    while (index < parameters.length) {
      locationsParameters.push(
        parameters.slice(index, index + 10).join('%7C')
      );
      index += 10;
    }

    const observables = parameters.map((params) =>
      this._customGoogleMapsService.snapToRoads(params).pipe(
        map((data: any) => {
          return data.snappedPoints.map((v: any) => `${v.location.latitude}%2C${v.location.longitude}`);
        })
      )
    );

    return combineLatest(observables).pipe(
      map((data) => data.reduce((acc, current) => {
        acc.push(...current);
        return acc;
      }, []))
    );
  }
}
