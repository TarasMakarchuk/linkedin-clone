import { IsCreatorGuard } from './is-creator.guard';

describe('IsCreatorGuard', () => {
  it('should be defined', () => {
    expect(new IsCreatorGuard()).toBeDefined();
  });
});
