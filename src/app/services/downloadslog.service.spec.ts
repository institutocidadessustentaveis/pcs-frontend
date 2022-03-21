import { TestBed } from '@angular/core/testing';

import { DownloadslogService } from './downloadslog.service';

describe('DownloadslogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadslogService = TestBed.get(DownloadslogService);
    expect(service).toBeTruthy();
  });
});
