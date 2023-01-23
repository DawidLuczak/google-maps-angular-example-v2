import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGoogleMapsComponent } from './custom-google-maps.component';

describe('CustomGoogleMapsComponent', () => {
  let component: CustomGoogleMapsComponent;
  let fixture: ComponentFixture<CustomGoogleMapsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomGoogleMapsComponent]
    });
    fixture = TestBed.createComponent(CustomGoogleMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
