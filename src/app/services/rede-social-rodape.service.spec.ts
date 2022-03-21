import { TestBed } from '@angular/core/testing';

import { RedeSocialRodapeService } from './rede-social-rodape.service';

describe('RedeSocialRodapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedeSocialRodapeService = TestBed.get(RedeSocialRodapeService);
    expect(service).toBeTruthy();
  });
});
