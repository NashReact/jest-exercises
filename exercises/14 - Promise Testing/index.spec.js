import 'isomorphic-fetch';
import callApi, { defaultFetchHeaders, camelCase } from './index';
var mockFetch;

jest.mock('node-fetch', () => {
  mockFetch = require('jest-fetch-mock');
  // set default response
  mockFetch.mockResponse(JSON.stringify({}));
  return mockFetch;
});

describe('callApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should call fetch with defaultOptions and default url', () => {
    callApi();
    expect(mockFetch).toBeCalled();
    expect(mockFetch).lastCalledWith('http://localhost', defaultFetchHeaders);
  });

  it('should make accept relative urls', () => {
    callApi('/api/entity');
    expect(mockFetch).toBeCalled();
    expect(mockFetch).lastCalledWith('http://localhost/api/entity', defaultFetchHeaders);
  });

  it('should return a promise', () => {
    const results = callApi('/api/entity');
    expect(results).toBeDefined();
    expect(typeof results).toBe('object');
    expect(typeof results.then).toBe('function');
  });

  it('should resolve to an object, containing the resp and parse json', () => {
    const responseJson = { id: 1 };
    mockFetch.mockResponseOnce(JSON.stringify(responseJson), { status: 200 });
    return callApi('/api/entity').then(results => {
      expect(results).toBeDefined();
      expect(typeof results).toBe('object');
      const { resp, json } = results;
      expect(json).toBeDefined();
      expect(json).toEqual(responseJson);
      expect(resp).toBeDefined();
      expect(resp.ok).toBe(true);
    });
  });

  it('should return json as null for 204 response', () => {
    mockFetch.mockResponseOnce('', { status: 204 });
    return callApi('/api/entity').then(({ json }) => {
      expect(json).toBe(null);
    });
  });

  // This may feel odd, but the return json can be used
  // for messaging to the user. Also sometimes failure is ok!
  it('should resolve with parse json even on `!response.ok`', () => {
    const responseJson = { message: 'Invalid or missing token' };
    mockFetch.mockResponseOnce(JSON.stringify(responseJson), { status: 403 });
    return callApi('/api/entity').then(({ json, resp }) => {
      expect(json).toEqual(responseJson);
      expect(resp.ok).toBe(false);
      expect(resp.status).toBe(403);
    });
  });

  it('should throw if unable to parse json', () => {
    mockFetch.mockResponseOnce('Bad Request', { status: 400 });

    return callApi('/api/entity').then(
      () => {
        expect.fail('It should not have resolved on invalid JSON');
      },
      err => {
        expect(err).toBeDefined();
        expect(typeof err).toBe('object');
        expect(err.toString()).toContain('SyntaxError:');
      },
    );
  });

  it('should normalize json as camelCase values deeply', () => {
    const sampleObject = {
      Id: 1,
      FirstName: 'Kyle',
      Addresses: [{ city: 'Nashville' }, { State: 'TN' }],
    };
    const sampleArray = [
      {
        Id: 1,
        FirstName: 'Kyle',
        Addresses: [{ City: 'Nashville' }, { State: 'TN' }],
        1: { Name: 'Bill' },
        '2': { Name: 'Jane' },
      },
      'Joe',
      {
        Foo: {
          BAR: {
            Fizz: [{ Buzz: 1 }],
          },
        },
      },
    ];
    mockFetch.mockResponses([JSON.stringify(sampleObject)], [JSON.stringify(sampleArray)]);
    return Promise.all([
      callApi().then(({ json }) => expect(json).toMatchSnapshot()),
      callApi().then(({ json }) => expect(json).toMatchSnapshot()),
    ]);
  });

  it('should handle null/empty array/undefined within results', () => {
    const sampleObject = {
      Id: 1,
      FirstName: 'Kyle',
      Organization: null,
      Addresses: [],
      Phones: undefined,
      LastName: 'Welch',
    };
    mockFetch.mockResponseOnce(JSON.stringify(sampleObject));
    return callApi().then(({ json }) => expect(json).toMatchSnapshot());
  });
});

describe('#camelCase', () => {
  const obj = { SuperLongCSharpVariableNameThatIsInMyJSON: 1 };
  const formattedObj = { superLongCSharpVariableNameThatIsInMyJSON: 1 };

  it('returns the input if it is an array with no objects', () => {
    expect(camelCase([1, 2, 3])).toEqual([1,2,3]);
  });

  it('returns the input if it is a nested array with no objects', () => {
    expect(camelCase([1, [2], 3])).toEqual([1, [2] ,3]);
  });
  
  it('camel-cases object keys when a single object is nested inside an array', () => {
    expect(camelCase([obj])).toEqual([formattedObj]);
  });
  
  it('camel-cases object keys when an object and a primitive are nested in an array', () => {
    expect(camelCase([obj, 1])).toEqual([formattedObj, 1]);
  });
  
  it('camel-cases object keys if the object contains an array', () => {
    const nestedArray = Object.assign({}, obj, { Arr: [1, 2, 3] });
    const expected = Object.assign({}, formattedObj, { arr: [1, 2, 3] });
    expect(camelCase(nestedArray)).toEqual(expected);
  });
  
  it('camel-cases object keys if the object contains an array containing an object', () => {
    const nestedArray = Object.assign({}, obj, { Arr: [1, { B: 2 }, 3] });
    const expected = Object.assign({}, formattedObj, { arr: [1, { b: 2 }, 3] });
    expect(camelCase(nestedArray)).toEqual(expected);
  }); 
});
