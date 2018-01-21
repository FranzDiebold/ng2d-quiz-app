import { TestBed, inject } from '@angular/core/testing';

import { ColorService } from './color.service';

describe('ColorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ColorService ]
    });
  });

  it('should be created', inject([ColorService], (service: ColorService) => {
    expect(service).toBeTruthy();
  }));

  it('should calculate correct color luminance for black and white', inject([ColorService], (colorService: ColorService) => {
    expect(ColorService._getColorLuminance('#000000')).toEqual(0);
    expect(ColorService._getColorLuminance('#ffffff')).toEqual(1);
  }));

  it('should calculate color luminance in correct interval for (random) colors', inject([ColorService], (colorService: ColorService) => {
    expect(ColorService._getColorLuminance('#01ab3c')).toBeGreaterThanOrEqual(0);
    expect(ColorService._getColorLuminance('#01ab3c')).toBeLessThanOrEqual(1);

    expect(ColorService._getColorLuminance('#98fa47')).toBeGreaterThanOrEqual(0);
    expect(ColorService._getColorLuminance('#98fa47')).toBeLessThanOrEqual(1);
  }));
});
