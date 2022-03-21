import { TestBed } from '@angular/core/testing';

import { PainelIndicadorCidadeService } from './painel-indicador-cidade.service';

describe('PainelIndicadorCidadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PainelIndicadorCidadeService = TestBed.get(PainelIndicadorCidadeService);
    expect(service).toBeTruthy();
  });
});
