import { TestBed } from '@angular/core/testing';

import { FormularioAtendimentoService } from './formulario-atendimento.service';

describe('FormularioAtendimentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormularioAtendimentoService = TestBed.get(FormularioAtendimentoService);
    expect(service).toBeTruthy();
  });
});
