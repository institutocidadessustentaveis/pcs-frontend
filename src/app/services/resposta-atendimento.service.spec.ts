import { TestBed } from '@angular/core/testing';

import { RespostaAtendimentoService } from './resposta-atendimento.service';

describe('RespostaAtendimentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RespostaAtendimentoService = TestBed.get(RespostaAtendimentoService);
    expect(service).toBeTruthy();
  });
});
