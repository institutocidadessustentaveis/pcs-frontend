import { TestBed } from '@angular/core/testing';

import { ContatoPcsService } from './contato-pcs.service';

describe('ContatoPcsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContatoPcsService = TestBed.get(ContatoPcsService);
    expect(service).toBeTruthy();
  });
});
