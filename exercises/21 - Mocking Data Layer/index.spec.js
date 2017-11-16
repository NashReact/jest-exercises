import {getEvent} from './index';
let mockApiGet = jest.fn(() => ({
  id: 1,
  title: 'Some fake title',
  description: 'Longer description',
  isPaid: true,
}));

jest.mock('./eventApi',  () => {
  return {
    get: () => mockApiGet(),
  }
});

describe('getEvent', () => {

  // removed since I was unable to get it to unmock
  xit('should call real api method', () => {
    jest.dontMock('./eventApi');
    const event = getEvent(123);
    expect(event).toEqual({
      id: 123,
      title: 'Real Event',
      description: 'This is the description of the real event that I made up in the eventApi',
    });
  });

  it('should return an object', () => {
    const event = getEvent(123);
    expect(event).toEqual(expect.objectContaining({
      id: 1,
      title: expect.any(String),
    }));
  });

  it('should return from cache on second request', () => {
    let firstEvent = getEvent(123);
    expect(firstEvent).toEqual(expect.objectContaining({
      id: 1,
      title: expect.any(String),
    }));

    let secondEvent = getEvent(123);
    expect(secondEvent).toBe(firstEvent);

    expect(mockApiGet).toHaveBeenCalledTimes(1);
  });
  
});
