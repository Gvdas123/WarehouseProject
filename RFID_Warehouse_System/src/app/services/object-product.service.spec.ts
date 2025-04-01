import { TestBed } from '@angular/core/testing';

import { ObjectProductService } from './object-product.service';

describe('ObjectProductService', () => {
  let service: ObjectProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
