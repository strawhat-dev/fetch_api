import type { JsObject, KeyOf } from '@/types';
import type {
  ApiDispatch,
  FetchInit,
  FetchedApi,
  HttpMethod,
} from '@/types/api';

import { clear, clone, extend, isPrimitive } from '@/utils';
import { resolveConfig, resolveInput, resolveRequest } from '@/request-parser';

export const HTTP_METHODS = new Set([
  'get',
  'post',
  'put',
  'patch',
  'head',
  'options',
  'connect',
  'trace',
  'delete',
] as const satisfies readonly HttpMethod[]);

export const initapi = (defaults: FetchInit = {}): FetchedApi => {
  const api = getInstanceMethods() as Partial<FetchedApi>;

  Object.defineProperties(api, {
    create: METHOD_DESCRIPTOR,
    configure: METHOD_DESCRIPTOR,
    with: METHOD_DESCRIPTOR,
    set: METHOD_DESCRIPTOR,
  });

  for (const method of HTTP_METHODS) {
    if (method === 'post' || method === 'put' || method === 'patch') {
      api[method] = function (this: FetchedApi, input, body, config = {}) {
        (config as JsObject).body = body;
        const { baseURL, query, ...rest } = resolveConfig(this, this[method], config);
        const url = resolveInput(input, baseURL?.trim(), query);
        return resolveRequest(method, url, rest);
      };
    } else {
      api[method] = function (this: FetchedApi, input, config = {}) {
        const { baseURL, query, ...rest } = resolveConfig(this, this[method], config);
        const url = resolveInput(input, baseURL?.trim(), query);
        return resolveRequest(method, url, rest);
      };
    }

    defaults[method] && Object.assign(api[method]!, clone(defaults[method]));
  }

  return extend(clone(defaults), api) as FetchedApi;
};

const METHOD_DESCRIPTOR: PropertyDescriptor = {
  configurable: false,
  enumerable: false,
  writable: false,
};

const getInstanceMethods = (): ApiDispatch => ({
  create: initapi,
  configure(this: FetchedApi, config) {
    let key: KeyOf<FetchInit>;
    for (key in config) {
      let value = config[key];
      isPrimitive(value) || (value = clone(value));
      const isMethod = typeof this[key] === 'function';
      isMethod ? Object.assign(this[key]!, value) : ((this as JsObject)[key] = value);
    }

    return this;
  },
  with(this: FetchedApi, config) {
    const instance = initapi(this);
    if (!config) return instance;
    return instance.configure(config);
  },
  set(this: FetchedApi, config) {
    clear(this);
    for (const method of HTTP_METHODS) clear(this[method]);
    return this.configure(config);
  },
});
