import type { FetchedApi } from '@/types/api';

import { fetchRequest } from '@/handler';
import { parseConfig, parseInput } from '@/parse-api';
import { DESCRIPTOR_MAP, HTTP_METHODS } from '@/constants';
import { clear, clone, isPrimitive, isRecord } from '@/utils';

export const initapi: FetchedApi['create'] = (defaults) => {
  const api = assign(getInstanceMethods(), clone(defaults)) as FetchedApi;
  for (const method of HTTP_METHODS) {
    const hasBody = method === 'post' || method === 'put' || method === 'patch';
    api[method] = define(method, async (arg, ...args) => {
      isRecord(arg) && args.push(arg) && (arg = '');
      let request = { ...args.pop()! };
      if (hasBody) request = args.length ? { ...request, body: args.pop() } : { body: request };
      const init = [method.toUpperCase(), api, api[method], request] as const;
      const { baseURL, params, ...options } = parseConfig(...init);
      const input = parseInput(arg as string, baseURL, params);
      return fetchRequest(input, options);
    });

    assign(api[method], clone(defaults?.[method]));
  }

  return defineProperties(api, DESCRIPTOR_MAP);
};

const { assign, entries, defineProperty, defineProperties } = Object;
const define = <T>(value: string, method: T) => defineProperty(method, 'name', { value });
const getInstanceMethods = (): Partial<FetchedApi> => ({
  create: define('create', initapi),
  with(this, config) {
    const instance = initapi(this);
    if (!config) return instance;
    return instance.use(config);
  },
  set(this, config) {
    for (const method of HTTP_METHODS) clear(this[method]!);
    return clear(this).use!(config);
  },
  use(this: any, config) {
    entries(config || {}).forEach(([key, value]) => {
      isPrimitive(value) || (value = clone(value));
      const isMethod = typeof this[key] === 'function';
      isMethod ? assign(this[key], value) : (this[key] = value);
    });

    return this;
  },
  async fetch(this: any, config) {
    const { url, method = 'get', ...request } = config;
    const init = [method.toUpperCase(), this, this[method.toLowerCase()], request] as const;
    const { baseURL, params, ...options } = parseConfig(...init, { transform: false });
    const input = parseInput(url, baseURL, params);
    return fetchRequest(input, options);
  },
});
