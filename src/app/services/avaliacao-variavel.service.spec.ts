import { TestBed } from '@angular/core/testing';

import { AvaliacaoVariavelService } from './avaliacao-variavel.service';

describe('AvaliacaoVariavelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvaliacaoVariavelService = TestBed.get(AvaliacaoVariavelService);
    expect(service).toBeTruthy();
  });
});
