import { TestBed } from '@angular/core/testing';

import { RelatorioVisualizacaoCartograficaService } from './relatorio-visualizacao-cartografica.service';

describe('RelatorioVisualizacaoCartograficaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelatorioVisualizacaoCartograficaService = TestBed.get(RelatorioVisualizacaoCartograficaService);
    expect(service).toBeTruthy();
  });
});
