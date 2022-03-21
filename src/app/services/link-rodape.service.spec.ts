import { TestBed } from '@angular/core/testing';

import { LinkRodapeService } from './link-rodape.service';

describe('LinkRodapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinkRodapeService = TestBed.get(LinkRodapeService);
    expect(service).toBeTruthy();
  });
});
