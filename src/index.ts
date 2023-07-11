/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JsonObject, Merge } from 'type-fest';
import type {
  FetchApi,
  FetchConfig,
  FetchHeaders,
  FetchInput,
  FetchMethod,
  FetchRequest,
  FetchRequestInit,
} from './types/api.js';
import type { JsObject } from './types/index.js';

import { define, isObject, isPromise, isRequest } from './util.js';

export const api = define({
  get(input, config) {
    const { baseURL, ...rest } = parseConfig(this, config);
    _fetch('get', parseInput(input, baseURL), rest);
  },
} as FetchApi) as FetchApi;

const _fetch = async (method: FetchMethod, input: FetchInput, config: FetchConfig) => {
  const { transform, onres, onError, ...init } = config as Merge<
    Pick<FetchConfig, 'baseURL' | 'transform' | 'onres' | 'onError'>,
    RequestInit
  >;

  input = parseInput(input, baseURL);
  init.method = method.toUpperCase();

  const request = { ...init, input } as FetchRequest;
  const response = await fetch(input, init).catch(
    onError && ((err) => onError(err, request) as unknown as Response),
  );

  let resolved = onres?.(response, request);
  if (isPromise(resolved)) resolved = onres?.await ? await resolved : undefined;
  if (typeof resolved !== 'undefined') return resolved;
  return transform ? response.json() : response;
};

const parseConfig = (defaults: FetchConfig, config?: FetchConfig) => {
  const resolved = {
    transform: true,
    ...defaults,
    ...config,
    headers: { ...defaults.headers, ...config?.headers } as FetchHeaders,
  };

  return parseBody(resolved);
};

const parseBody = (config: FetchConfig) => {
  config.headers ??= {};
  config.headers['content-type'] ??= 'application/json';
  const contentType = config.headers['content-type'] ?? config.headers['Content-Type'];
  const body = config.body as JsObject<string>;

  if (/multipart[/]form-data/i.test(contentType)) {
    const formdata = new FormData();
    for (const [k, v] of Object.entries(body)) formdata.append(k, v);
    config.body = formdata;
  } else {
    const isUrlEncoded = /application[/]x-www-form-urlencoded/i.test(contentType);
    const isKeyValuePairs = Object.values(body).every((v) => typeof v === 'string');
    const asURLSearchParams = isUrlEncoded && isKeyValuePairs;
    config.body = asURLSearchParams ? new URLSearchParams(body) : JSON.stringify(body);
  }

  return config;
};

const parseInput = (input: FetchInput, baseURL?: string) => {
  if (!baseURL) return input;
  const asRequest = isRequest(input);
  const url = asRequest ? input.url : input.toString();
  if (url.startsWith(baseURL)) return input;
  const result = new URL([baseURL.replace(/[/]+$/, ''), url.replace(/^[/]+/, '')].join('/'));
  return asRequest ? new Request(result, input) : result;
};
