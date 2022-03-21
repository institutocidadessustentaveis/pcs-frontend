import { StripTagsPipe } from './strip-tags.pipe';

describe('StripTagsPipe', () => {
  it('create an instance', () => {
    const pipe = new StripTagsPipe();
    expect(pipe).toBeTruthy();
  });
});
