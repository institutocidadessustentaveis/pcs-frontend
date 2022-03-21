import { GeradorUrlIndicadorPipe } from './gerador-url-indicador.pipe';

describe('GeradorUrlIndicadorPipe', () => {
  it('create an instance', () => {
    const pipe = new GeradorUrlIndicadorPipe(null);
    expect(pipe).toBeTruthy();
  });
});
