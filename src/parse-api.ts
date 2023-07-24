import type { HttpMethod } from '@/constants';
import type { JsObject } from '@/types';
import type { FetchInput, FetchOptions, FetchQuery } from '@/types/api';

import { isBodyInit, isFormDataEntryValue, isRequest, jsonify } from '@/utils';

export const parseInput = (input: FetchInput, baseURL?: string, query?: FetchQuery): FetchInput => {
  if (!baseURL && !query) return input || '';
  const searchParams = query ? `?${new URLSearchParams(query as {})}` : '';
  let url = ((input as Request)?.url || `${input || ''}`).trim();
  url.startsWith('http') && url.startsWith(baseURL!) && (baseURL = '');
  if (!url || !baseURL) return parseURL(`${baseURL || url}${searchParams}`, input);
  (url = url.replace(/^\/+/, '')), (baseURL = baseURL.replace(/\/+$/, ''));
  return parseURL(`${baseURL}/${url}${searchParams}`, input);
};

export const parseConfig = (method: HttpMethod, ...configs: FetchOptions[]): FetchOptions => {
  const ensureProperBody = (method === 'get' || method === 'head') && { body: undefined };
  const transform = method === 'get' || method === 'post' || method === 'options';
  const config = Object.assign({ transform }, ...configs, ensureProperBody);
  if (config.body == null || isBodyInit(config.body)) return config;
  const headers = ((config.headers as Headers) ??= new Headers());
  const contentType = headers.get('content-type')!;
  contentType || headers.set('content-type', 'application/json');
  config.body = /multipart\/form-data/.test(contentType)
    ? (headers.delete('content-type'), parseFormData(config.body))
    : /application\/x-www-form-urlencoded/.test(contentType)
    ? new URLSearchParams(config.body)
    : jsonify(config.body);

  return config;
};

export const parseHeaders = (...configs: FetchOptions[]) => {
  const resolved = {} as { headers?: Headers };
  for (let { headers, appendHeaders } of configs) {
    if (headers) {
      if (!resolved.headers) resolved.headers = new Headers(headers as {});
      else {
        'entries' in headers || (headers = Object.entries(headers));
        for (const header of headers as [string, string][]) {
          resolved.headers.set(...header);
        }
      }
    }
    if (appendHeaders) {
      if (!resolved.headers) resolved.headers = new Headers(appendHeaders as {});
      else {
        'entries' in appendHeaders || (appendHeaders = Object.entries(appendHeaders));
        for (const header of appendHeaders as [string, string][]) {
          resolved.headers.append(...header);
        }
      }
    }
  }

  return resolved;
};

const parseURL = (url: string, input: FetchInput) => {
  const resolved = new URL(url);
  if (isRequest(input)) return new Request(resolved, input);
  return resolved;
};

const parseFormData = (obj: object) => {
  const fd = new FormData();
  if (obj == null) return fd;
  typeof obj === 'object' || (obj = { 0: obj });
  for (const key of Object.keys(obj)) {
    let value = (obj as JsObject<string>)[key];
    isFormDataEntryValue(value) || (value = jsonify(value));
    fd.append(key, value);
  }

  return fd;
};
