const add = require('../index');

describe('add', () => {
  it('should return 3 when passed 1 and 2', () => {
    const result = add(1, 2);
    expect(result).toEqual(3);
  });

  it('should return 5 when passed 10 and -5', () => {
    const result = add(10, -5);
    expect(result).toEqual(5);
  });

  it('should return 1 when passed 1 and 0', () => {
    const result = add(1, 0);
    expect(result).toEqual(1);
  });
});