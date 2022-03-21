import { TestBed } from '@angular/core/testing';

import { HistoricoUsoShapesService } from './historico-uso-shapes.service';

describe('HistoricoUsoShapesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoricoUsoShapesService = TestBed.get(HistoricoUsoShapesService);
    expect(service).toBeTruthy();
  });
});
