import type { JsObject } from '@/types';
import type { ApiDispatch, FetchInit, FetchedApi } from '@/types/api';

import { clear, clone, isPrimitive } from '@/utils';
import { fetchedMethod, mergeHeaders, parseConfig, parseInput } from '@/transform';

export const initapi = (defaults?: FetchInit): FetchedApi => {
  const api = getInstanceMethods() as FetchedApi;
  for (const method of HTTP_METHODS) {
    if (method === 'post' || method === 'put' || method === 'patch') {
      api[method] = (input, body, config) => {
        config ||= {};
        (config as JsObject).body = body;
        const headers = mergeHeaders(api, api[method], config);
        const { baseURL, query, ...rest } = parseConfig(api, api[method], config, headers);
        const url = parseInput(input, baseURL?.trim(), query);
        return fetchedMethod(method, url, rest);
      };
    } else {
      api[method] = (input, config) => {
        config ||= {};
        const headers = mergeHeaders(api, api[method], config);
        const { baseURL, query, ...rest } = parseConfig(api, api[method], config, headers);
        const url = parseInput(input, baseURL?.trim(), query);
        return fetchedMethod(method, url, rest);
      };
    }

    defaults?.[method] && Object.assign(api[method], clone(defaults[method]));
  }

  Object.defineProperties(api, DESCRIPTOR_MAP);
  return defaults ? Object.assign(api, clone(defaults)) : api;
};

const getInstanceMethods = (): ApiDispatch => ({
  create: initapi,
  configure(this: FetchedApi, config) {
    const api = this as JsObject<any>;
    for (const key of Object.keys(config || {})) {
      let value = (config as JsObject)[key];
      isPrimitive(value) || (value = clone(value));
      const isMethod = typeof api[key] === 'function';
      isMethod ? Object.assign(api[key], value) : (api[key] = value);
    }

    return this;
  },
  set(this: FetchedApi, config) {
    clear(this);
    for (const method of HTTP_METHODS) clear(this[method]);
    return this.configure(config);
  },
  with(this: FetchedApi, config) {
    const instance = initapi(this);
    if (!config) return instance;
    return instance.configure(config);
  },
});

const HTTP_METHODS = new Set([
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'trace',
  'connect',
  'options',
] as const);

const METHOD_DESCRIPTOR = {
  configurable: false,
  enumerable: false,
  writable: false,
} as const;

const DESCRIPTOR_MAP = {
  set: METHOD_DESCRIPTOR,
  configure: METHOD_DESCRIPTOR,
  create: METHOD_DESCRIPTOR,
  with: METHOD_DESCRIPTOR,
  get: METHOD_DESCRIPTOR,
  post: METHOD_DESCRIPTOR,
  put: METHOD_DESCRIPTOR,
  patch: METHOD_DESCRIPTOR,
  delete: METHOD_DESCRIPTOR,
  head: METHOD_DESCRIPTOR,
  trace: METHOD_DESCRIPTOR,
  connect: METHOD_DESCRIPTOR,
  options: METHOD_DESCRIPTOR,
} as const;
