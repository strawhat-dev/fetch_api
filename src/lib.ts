import type { JsObject } from '@/types';
import type { ApiDispatch, FetchApi, FetchConfig, FetchInit, HttpMethod } from '@/types/api';

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

export const initapi = (config: FetchInit = {}): FetchApi => {
  const { defaults, methods } = parseConfig(config);
  const instance = define(defaults, HTTP_METHODS.reduce(reducer, getInstanceMethods())) as FetchApi;
  for (const [method, props] of methods) Object.assign(instance[method], props);
  return instance;
};

export const reducer = (api: Partial<FetchApi>, method: HttpMethod) => {
  api[method] = function (this: FetchApi, input, config = {}) {
    const { baseURL, ...rest } = resolveConfig(this, this[method], config);
    return resolveRequest(method, resolveInput(input, baseURL?.trim()), rest);
  };

  return api;
};

export const getInstanceMethods = (): ApiDispatch => ({
  create: initapi,
  configure(this: FetchApi, config) {
    const { defaults, methods } = parseConfig(config);
    for (const [method, props] of methods) Object.assign(this[method], props);
    return Object.assign(this, defaults);
  },
  set(this: FetchApi, config) {
    clear(this);
    for (const method of HTTP_METHODS) clear(this[method]);
    return this.configure(config);
  },
  with(this: FetchApi, config) {
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
