import type { JsObject } from '@/types';
import type { ApiDispatch, FetchConfig, FetchInit, FetchedApi, HttpMethod } from '@/types/api';

import { clear, define } from '@/utils';
import { resolveConfig, resolveInput, resolveRequest } from '@/resolvers';

export const HTTP_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'options',
  'connect',
  'trace',
  'delete',
] as const satisfies readonly HttpMethod[];

export const initapi = (config: FetchInit = {}): FetchedApi => {
  const { defaults, methods } = parseConfig(config);
  const init = HTTP_METHODS.reduce(reducer, getInstanceMethods());
  const instance = define(defaults, init) as FetchedApi;
  for (const [method, props] of methods) Object.assign(instance[method], props);
  return instance;
};

export const reducer = (api: Partial<FetchedApi>, method: HttpMethod) => {
  api[method] = function (this: FetchedApi, input, config = {}) {
    const { baseURL, ...rest } = resolveConfig(this, this[method], config);
    return resolveRequest(method, resolveInput(input, baseURL?.trim()), rest);
  };

  return api;
};

export const getInstanceMethods = (): ApiDispatch => ({
  create: initapi,
  configure(this: FetchedApi, config) {
    const { defaults, methods } = parseConfig(config);
    for (const [method, props] of methods) Object.assign(this[method], props);
    return Object.assign(this, defaults);
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

const parseConfig = (config: FetchInit = {}) => {
  const methods = [];
  const defaults = {} as JsObject;

  for (const key in config) {
    const prop = key as HttpMethod;
    const value = config[prop];
    if (HTTP_METHODS.includes(prop)) methods.push([prop, value]);
    else if (!/^(configure|create|set|with)$/.test(key)) defaults[prop] = value;
  }

  return { defaults, methods } as {
    defaults: FetchConfig;
    methods: [HttpMethod, FetchConfig][];
  };
};
