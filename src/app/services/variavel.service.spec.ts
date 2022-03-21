import { TestBed } from '@angular/core/testing';

import { VariavelService } from './variavel.service';

describe('VariavelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VariavelService = TestBed.get(VariavelService);
    expect(service).toBeTruthy();
  });
});
