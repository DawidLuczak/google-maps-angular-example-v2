import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomGoogleMapsModule } from './custom-google-maps/custom-google-maps.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CustomGoogleMapsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
