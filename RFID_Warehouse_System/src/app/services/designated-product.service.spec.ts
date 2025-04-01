import { TestBed } from '@angular/core/testing';

import { DesignatedProductService } from './designated-product.service';

describe('DesignatedProductService', () => {
  let service: DesignatedProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignatedProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
