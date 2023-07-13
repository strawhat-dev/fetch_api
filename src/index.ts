import type { FetchApi, FetchHandlers } from './types/api.js';

import { define } from './utils.js';
import { methods, reducer } from './lib.js';

export const api = define(
  methods.reduce(reducer, {} as FetchHandlers) as FetchHandlers,
) as FetchApi;
