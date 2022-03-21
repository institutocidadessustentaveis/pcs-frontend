import { TestBed } from '@angular/core/testing';

import { HistoricoOperacaoService } from './historico-operacao.service';

describe('HistoricoOperacaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoricoOperacaoService = TestBed.get(HistoricoOperacaoService);
    expect(service).toBeTruthy();
  });
});
