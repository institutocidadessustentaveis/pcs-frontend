import { TestBed } from '@angular/core/testing';

import { ComentarioDiscussaoFilhoService } from './comentario-discussao-filho.service';

describe('ComentarioDiscussaoFilhoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComentarioDiscussaoFilhoService = TestBed.get(ComentarioDiscussaoFilhoService);
    expect(service).toBeTruthy();
  });
});
