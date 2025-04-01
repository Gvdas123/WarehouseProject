import { TestBed } from '@angular/core/testing';

import { ScanProductService } from './scan-product.service';

describe('ScanProductService', () => {
  let service: ScanProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
