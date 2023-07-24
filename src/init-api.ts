import type { ApiDispatch, FetchInit, FetchedApi } from '@/types/api';

import { DESCRIPTOR_MAP, HTTP_METHODS } from '@/constants';
import { parseConfig, parseHeaders, parseInput } from '@/parse-api';
import { clear, clone, isPrimitive } from '@/utils';
import { fetchedMethod } from '@/handler';

/**
 * Create and initialize a new api instance with the provided defaults.
 */
export const initapi = (defaults?: FetchInit): FetchedApi => {
  const api = getInstanceMethods() as FetchedApi;
  defaults && Object.assign(api, clone(defaults));
  for (const method of HTTP_METHODS) {
    if (method === 'post' || method === 'put' || method === 'patch') {
      api[method] = (input, body, opts) => {
        ((opts ||= {}) as FetchInit).body = body;
        const headers = parseHeaders(api, api[method], opts);
        const { baseURL, query, ...rest } = parseConfig(method, api, api[method], opts, headers);
        const url = parseInput(input, baseURL, query);
        return fetchedMethod(method, url, rest);
      };
    } else {
      api[method] = (input, opts) => {
        const headers = parseHeaders(api, api[method], opts || {});
        const { baseURL, query, ...rest } = parseConfig(method, api, api[method], opts!, headers);
        const url = parseInput(input, baseURL, query);
        return fetchedMethod(method, url, rest);
      };
    }

    defaults?.[method] && Object.assign(api[method], clone(defaults[method]));
  }

  return Object.defineProperties(api, DESCRIPTOR_MAP);
};

const getInstanceMethods = (): ApiDispatch => ({
  create: initapi,
  with(this: FetchedApi, config) {
    const instance = initapi(this);
    if (!config) return instance;
    return instance.use(config);
  },
  set(this: FetchedApi, config) {
    clear(this);
    for (const method of HTTP_METHODS) clear(this[method]);
    return this.use(config);
  },
  use(this: FetchedApi, config) {
    for (const key of Object.keys(config || {}) as []) {
      let value = config[key] as never;
      isPrimitive(value) || (value = clone(value));
      const isMethod = typeof this[key] === 'function';
      isMethod ? Object.assign(this[key], value) : (this[key] = value);
    }

    return this;
  },
});
