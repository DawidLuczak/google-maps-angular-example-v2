import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomGoogleMapsComponent } from './custom-google-maps.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { GoogleMap, GoogleMapsModule, MapDirectionsRenderer } from '@angular/google-maps';

@NgModule({
  declarations: [CustomGoogleMapsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    GoogleMapsModule,
    HttpClientJsonpModule
  ],
  providers: [MapDirectionsRenderer, GoogleMap],
  exports: [CustomGoogleMapsComponent],
})
export class CustomGoogleMapsModule {}
