import type { JsObject } from '@/types';
import type { FetchConfig, FetchInput, FetchRequest, HttpMethod } from '@/types/api';

import {
  isHeaders,
  isPromise,
  isRequest,
  isValidFetchBody,
  isValidFormDataValue,
  jsonify,
} from '@/utils';

export const resolveRequest = async (
  method: HttpMethod,
  input: FetchInput,
  config: FetchConfig,
) => {
  const { transform, onres, onError = transform ? (e) => e : undefined, ...init } = config;
  (init as RequestInit).method ||= method.toUpperCase();
  const callback = onres?.['await' as never] || onres;
  const req = { ...init, input } as FetchRequest;
  const res = await fetch(input, init as RequestInit).catch(
    onError && ((error) => onError(Object.assign(req, { error }))),
  );

  if ('error' in req) return res;
  if (typeof callback === 'function') {
    const ret = callback(res, req);
    const unawaited = !('await' in onres!) && isPromise(ret);
    const resolved = unawaited ? undefined : await ret;
    if (typeof resolved !== 'undefined') return resolved;
  }

  return transform ? res.json?.() : res;
};

export const resolveInput = (input: FetchInput, baseURL?: string, query?: {}) => {
  const searchParams = query ? new URLSearchParams(query).toString() : '';
  if (!baseURL) return `${input || ''}${searchParams}`;
  if (!input) return `${baseURL || ''}${searchParams}`;
  const asRequest = isRequest(input);
  let url = (asRequest ? input.url : input.toString()).trim();
  searchParams && !url.endsWith('?') && (url += '?');
  const resolved = new URL(`${baseURL}${url}${searchParams}`);
  return asRequest ? new Request(resolved, input) : resolved;
};

export const resolveConfig = (...configs: FetchConfig[]) => {
  const config = configs.reduce(reducer, { transform: true }) as FetchConfig;
  if (config.body == null || isValidFetchBody(config.body)) return config; // skip transforming body
  const headers = ((config.headers as Headers) ??= new Headers());
  const contentType = headers.get('content-type')!;
  contentType || headers.set('content-type', 'application/json');
  config.body = /multipart[/]form-data/i.test(contentType)
    ? (headers.delete('content-type'), parseFormData(config.body))
    : /application[/]x-www-form-urlencoded/i.test(contentType)
    ? new URLSearchParams(config.body as JsObject<string>)
    : jsonify(config.body);

  return config;
};

const parseHeaders = (
  target: Headers,
  headers: Partial<HeadersInit>,
  method: 'set' | 'append' = 'set',
) => {
  let entries = headers as Iterable<[string, string]>;
  if (isHeaders(entries)) entries = entries.entries();
  else if (!Array.isArray(entries)) entries = Object.entries(entries);
  for (const entry of entries) target[method](...(entry as [string, string]));
  return target;
};

const parseFormData = (obj: {}) => {
  const fd = new FormData();
  if (obj == null) return fd;
  typeof obj === 'object' || (obj = { 0: obj });
  for (let [key, value] of Object.entries(obj)) {
    isValidFormDataValue(value) || (value = jsonify(value));
    fd.append(key, value as string);
  }

  return fd;
};

const reducer = ((acc, { headers, appendHeaders, ...rest } = {}) => {
  if (headers || appendHeaders) {
    acc.headers ??= new Headers();
    headers && parseHeaders(acc.headers, headers);
    appendHeaders && parseHeaders(acc.headers, appendHeaders, 'append');
  }

  return Object.assign(acc, rest);
}) as (acc: any, init: FetchConfig) => FetchConfig;
