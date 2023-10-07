import type { FetchConfig, FetchedApi } from '@/types/api';

import { fetchedRequest } from '@/handler';
import { clear, clone, isPrimitive } from '@/utils';
import { DESCRIPTOR_MAP, HTTP_METHODS } from '@/constants';
import { parseConfig, parseHeaders, parseInput } from '@/parse-api';

export const initapi: FetchedApi['create'] = (defaults) => {
  const api = assign(getInstanceMethods(), clone(defaults)) as FetchedApi;
  for (const method of HTTP_METHODS) {
    const config = defaults?.[method];
    const hasBody = method === 'post' || method === 'put' || method === 'patch';
    api[method] = define((input, ...args) => {
      let opts = args.pop() as FetchConfig;
      hasBody && (args.length ? (opts.body = args.pop()!) : (opts = { body: opts as {} }));
      const headers = parseHeaders(api, api[method], opts ?? {});
      const { baseURL, query, ...rest } = parseConfig(method, api, api[method], opts, headers);
      return fetchedRequest(method, parseInput(input, baseURL, query), rest);
    }, method);

    assign(api[method], clone(config));
  }

  return defineProperties(api, DESCRIPTOR_MAP);
};

const { keys, assign, defineProperty, defineProperties } = Object;
const define = <T>(fn: T, name: string) => defineProperty(fn, 'name', { value: name }) as T;
const getInstanceMethods = (): Partial<FetchedApi> => ({
  create: define(initapi, 'create'),
  with(this, config) {
    const instance = initapi(this);
    if (!config) return instance;
    return instance.use(config);
  },
  set(this, config) {
    clear(this);
    for (const method of HTTP_METHODS) clear(this[method]!);
    return this.use!(config);
  },
  use(this, config) {
    for (const key of keys(config || {}) as []) {
      let value = config[key];
      isPrimitive(value) || (value = clone(value));
      const isMethod = typeof this[key] === 'function';
      isMethod ? assign(this[key], value) : (this[key] = value);
    }

    return this as FetchedApi;
  },
});
