import { TestBed } from '@angular/core/testing';

import { WebSocketEchoService } from './web-socket-echo.service';

describe('WebSocketEchoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketEchoService = TestBed.get(WebSocketEchoService);
    expect(service).toBeTruthy();
  });
});
