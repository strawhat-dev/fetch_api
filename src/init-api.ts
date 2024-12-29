import type { FetchedApi } from '@/types/api';
import { parseConfig, parseInput } from '@/parse-api';
import { DESCRIPTOR_MAP, HTTP_METHODS } from '@/constants';
import { clear, clone, isPrimitive } from '@/utils';
import { fetchRequest } from '@/handler';

export const initapi: FetchedApi['create'] = (config) => {
  const api = assign(getInstanceMethods(), clone(config)) as FetchedApi;
  for (const method of HTTP_METHODS) {
    const hasBody = method === 'post' || method === 'put' || method === 'patch';
    api[method] = define(method, async (input, ...args) => {
      let request = { ...args.pop()! };
      hasBody && (request = args.length ? { ...request, body: args.pop() } : { body: request });
      const init = [method.toUpperCase(), api, api[method], request] as const;
      const { baseURL, params, ...rest } = parseConfig(...init);
      return fetchRequest(parseInput(input, baseURL, params), rest);
    });

    assign(api[method], clone(config?.[method]));
  }

  return defineProperties(api, DESCRIPTOR_MAP);
};

const { keys, assign, defineProperty, defineProperties } = Object;
const define = <T>(value: string, method: T) => defineProperty(method, 'name', { value });
const getInstanceMethods = (): Partial<FetchedApi> => ({
  create: define('create', initapi),
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
