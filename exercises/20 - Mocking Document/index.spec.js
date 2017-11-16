const getFirstElementByName = (name) => {
  const elements = document.getElementsByName(name);
  return elements && elements.length ? elements[0] : null;
}

describe('getFirstElementByName', () => {
  let mockGetElementsByName = jest.fn();
  beforeEach(() => {
    document.getElementsByName = mockGetElementsByName;
  })

  afterEach(() => {
    mockGetElementsByName.mockClear();
  })

  it('should return an element', () => {
    mockGetElementsByName.mockImplementation((name) => {
      return [document.createElement(name)];
    });

    const element = getFirstElementByName('div');

    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('DIV');
  })

  it('should return a null on second call', () => {
    mockGetElementsByName.mockImplementation((name) => {
      return null;
    }).mockImplementationOnce(() => [document.createElement('span')]);


    let element = getFirstElementByName('span');
    
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('SPAN');
    
    element = getFirstElementByName('span');
    
    expect(element).toBeNull();
  })

  it('should call document.getElementsByName', () => {
    getFirstElementByName('span');

    expect(mockGetElementsByName).toHaveBeenCalled();
    expect(mockGetElementsByName).lastCalledWith('span');
    
    getFirstElementByName('div');
    
    expect(mockGetElementsByName).lastCalledWith('div');
    
    // specific version of above
    expect(mockGetElementsByName.mock.calls[0][0]).toBe('span');
    expect(mockGetElementsByName.mock.calls[1][0]).toBe('div');
  })
  
})

