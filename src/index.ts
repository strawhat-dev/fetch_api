/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Merge } from 'type-fest';
import type {
  FetchApi,
  FetchConfig,
  FetchHandlers,
  FetchInput,
  FetchMethod,
  FetchRequest,
} from './types/api.js';

import { define, isPromise } from './util.js';
import { parseConfig, parseInput } from './api-parsers.js';

export const api = define({
  get(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.get, config);
    return _fetch('get', parseInput(input, baseURL), rest);
  },
  post(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.post, config);
    return _fetch('post', parseInput(input, baseURL), rest);
  },
  put(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.put, config);
    return _fetch('put', parseInput(input, baseURL), rest);
  },
  patch(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.patch, config);
    return _fetch('patch', parseInput(input, baseURL), rest);
  },
  delete(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.delete, config);
    return _fetch('delete', parseInput(input, baseURL), rest);
  },
  head(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.head, config);
    return _fetch('head', parseInput(input, baseURL), rest);
  },
  connect(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.connect, config);
    return _fetch('connect', parseInput(input, baseURL), rest);
  },
  options(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.options, config);
    return _fetch('options', parseInput(input, baseURL), rest);
  },
  trace(input, config) {
    const { baseURL, ...rest } = parseConfig(this, this.trace, config);
    return _fetch('trace', parseInput(input, baseURL), rest);
  },
} as FetchHandlers) as FetchApi;

const _fetch = async (method: FetchMethod, input: FetchInput, config: FetchConfig) => {
  const { transform, onres, onError, ...init } = config as Merge<
    Pick<FetchConfig, 'transform' | 'onres' | 'onError'>,
    RequestInit
  >;

  init.method = method.toUpperCase();
  const request = { ...init, input } as FetchRequest;
  const response = await fetch(input, init).catch(
    typeof onError === 'function' ? (error) => onError(error, request) : undefined,
  );

  let resolved = onres?.(response, request);
  if (isPromise(resolved)) resolved = onres?.await ? await resolved : undefined;
  if (typeof resolved !== 'undefined') return resolved;
  return transform ? response.json() : response;
};
