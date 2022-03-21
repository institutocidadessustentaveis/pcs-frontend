import { TestBed } from '@angular/core/testing';

import { HistoricoCompartilhamentoService } from './historico-compartilhamento.service';

describe('HistoricoCompartilhamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoricoCompartilhamentoService = TestBed.get(HistoricoCompartilhamentoService);
    expect(service).toBeTruthy();
  });
});
