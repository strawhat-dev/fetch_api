import type { FetchApi, FetchConfig, FetchHandlers } from './types/api.js';

import { define } from './utils.js';
import { methods, reducer } from './lib.js';

export const api = define(
  methods.reduce(reducer, {} as FetchHandlers) as FetchHandlers,
) as FetchApi;

export const initapi = (config: FetchConfig) => {
  config ||= {};
  return define(config, methods.reduce(reducer, {} as FetchHandlers) as FetchHandlers);
};

const data = await api.get('');
