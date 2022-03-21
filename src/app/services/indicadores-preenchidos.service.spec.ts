import { TestBed } from '@angular/core/testing';

import { IndicadoresPreenchidosService } from './indicadores-preenchidos.service';

describe('IndicadoresPreenchidosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndicadoresPreenchidosService = TestBed.get(IndicadoresPreenchidosService);
    expect(service).toBeTruthy();
  });
});
