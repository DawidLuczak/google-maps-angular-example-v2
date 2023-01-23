import { TestBed } from '@angular/core/testing';

import { CustomGoogleMapsService } from './custom-google-maps.service';

describe('CustomGoogleMapsService', () => {
  let service: CustomGoogleMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomGoogleMapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
