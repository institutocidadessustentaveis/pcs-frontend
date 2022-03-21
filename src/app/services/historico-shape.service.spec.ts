import { TestBed } from '@angular/core/testing';

import { HistoricoShapeService } from './historico-shape.service';

describe('HistoricoShapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoricoShapeService = TestBed.get(HistoricoShapeService);
    expect(service).toBeTruthy();
  });
});
