import type { Merge } from 'type-fest';
import type { JsObject } from '@/types';
import type { FetchConfig, FetchInput, FetchRequest, HttpMethod } from '@/types/api';

import { isObject, isPromise, isRequest, mergeHeaders, parseFormData } from '@/utils';

export const resolveRequest = async (
  method: HttpMethod,
  input: FetchInput,
  config: FetchConfig,
) => {
  const { transform, onres, onError, ...init } = config as Merge<
    Pick<FetchConfig, 'transform' | 'onres' | 'onError'>,
    RequestInit
  >;

  let error;
  init.method = method.toUpperCase();
  const req = { ...init, input } as FetchRequest;
  const res = await fetch(input, init).catch(
    onError && (((err: Error) => ((error = err), onError(err, req))) as never),
  );

  let resolved = error || onres?.(res, req);
  isPromise(resolved) && (resolved = onres!.await ? await resolved : undefined);
  if (!error && typeof resolved !== 'undefined') return resolved;
  return transform ? res.json() : res;
};

export const resolveInput = (input: FetchInput, baseURL?: string) => {
  if (!baseURL) return input || '';
  if (!input) return baseURL || '';
  const asRequest = isRequest(input);
  const url = (asRequest ? input.url : input.toString()).trim();
  if (url.startsWith(baseURL)) return input;
  const resolved = new URL([baseURL.replace(/[/]+$/, ''), url.replace(/^[/]+/, '')].join('/'));
  return asRequest ? new Request(resolved, input) : resolved;
};

export const resolveConfig = (...configs: FetchConfig[]) => {
  const config = configs.reduce(mergeConfigs, { transform: true }) as FetchConfig;
  if (!isObject(config.body)) return config; // skip transforming body
  const headers = ((config.headers as unknown as Headers) ??= new Headers());
  const body = config.body as JsObject<string>;
  const contentType = headers.get('content-type')!;
  contentType || headers.set('content-type', 'application/json');
  config.body = /multipart[/]form-data/i.test(contentType)
    ? (headers.delete('content-type'), parseFormData(body))
    : /application[/]x-www-form-urlencoded/i.test(contentType)
    ? new URLSearchParams(body)
    : JSON.stringify(body);

  return config;
};

const mergeConfigs = ((acc, { headers, appendHeaders, ...rest } = {}) => {
  if (headers || appendHeaders) {
    acc.headers ??= new Headers();
    headers && mergeHeaders(acc.headers, headers);
    appendHeaders && mergeHeaders(acc.headers, appendHeaders, 'append');
  }

  return Object.assign(acc, rest);
}) as (acc: any, init: FetchConfig) => FetchConfig;
