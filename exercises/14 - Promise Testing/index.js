import fetch from 'node-fetch';

export const LOCATION_ORIGIN = (() => {
  if (typeof window !== 'undefined' && window.location !== 'undefined') {
    const url = window.location.origin ||
      window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    if (url.toString() !== 'null') {
      return url;
    }
  }
  return 'http://localhost';
})();

export const defaultFetchHeaders = {
  compress: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const camelCase = input => {
  return (typeof input === 'string') ? input.charAt(0).toLowerCase() + input.slice(1) : input;
};

export const normalizeCasing = value => {
  if (value === null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeCasing);
  }
  if (typeof value === 'object') {
    return Object.keys(value).reduce((acc, curr) => {
      return {
        ...acc,
        [camelCase(curr)]: normalizeCasing(value[curr]),
      };
    }, {});
  }
  return value;
};

const callApi = (url = '', options = {}) => {
  const apiUrl = (/https?:\/\//.test(url)) ? url : `${LOCATION_ORIGIN}${url}`;
  const fetchOptions = Object.assign({}, defaultFetchHeaders, options);
  return fetch(apiUrl, fetchOptions)
    .then((resp) => {
      if (resp.status !== 204) {
        return resp.json()
          .then((json) => {
            const results = { json: normalizeCasing(json), resp };
            return (resp.status >= 500 && resp.status < 600) ? Promise.reject(results) : results;
          });
      }
      return { json: null, resp };
    });
};

export default callApi;
