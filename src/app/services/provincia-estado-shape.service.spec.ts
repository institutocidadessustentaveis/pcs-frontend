import { TestBed } from '@angular/core/testing';

import { ProvinciaEstadoShapeService } from './provincia-estado-shape.service';

describe('ProvinciaEstadoShapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvinciaEstadoShapeService = TestBed.get(ProvinciaEstadoShapeService);
    expect(service).toBeTruthy();
  });
});
