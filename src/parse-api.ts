import type { JsObject } from '@/types';
import type { HttpMethod } from '@/constants';
import type { FetchInput, FetchOptions, FetchQuery } from '@/types/api';
import { entries, isBodyInit, isFormDataEntryValue, isRequest, jsonify } from '@/utils';

const { keys, assign } = Object;

export const parseInput = (
  input: FetchInput,
  baseURL?: string,
  params?: FetchQuery,
): FetchInput => {
  if (!baseURL && !params) return input || '';
  const searchParams = params ? `?${new URLSearchParams(params as {})}` : '';
  const endpoint = ((input as Request)?.url || `${input || ''}`).trim();
  endpoint.startsWith('http') && endpoint.startsWith(baseURL!) && (baseURL = '');
  endpoint.startsWith('/') && baseURL?.endsWith('/') && (baseURL = baseURL.slice(0, -1));
  const url = new URL((baseURL || '') + endpoint + searchParams);
  return isRequest(input) ? new Request(url, input) : url;
};

export const parseConfig = (method: HttpMethod, ...configs: FetchOptions[]): FetchOptions => {
  const ensureProperBody = (method === 'get' || method === 'head') && { body: undefined };
  const transform = method === 'get' || method === 'post' || method === 'options';
  const config = assign({ transform }, ...configs, ensureProperBody);
  if (config.body == null || isBodyInit(config.body)) return config;
  const headers = ((config.headers as Headers) ??= new Headers());
  const contentType = headers.get('content-type')!;
  contentType || headers.set('content-type', 'application/json');
  config.body = /multipart\/form-data/i.test(contentType) ?
    (headers.delete('content-type'), parseFormData(config.body)) :
    /application\/x-www-form-urlencoded/i.test(contentType) ?
    new URLSearchParams(config.body) :
    jsonify(config.body);

  return config;
};

export const parseHeaders = (...configs: FetchOptions[]) => {
  const resolved = {} as { headers?: Headers };
  for (let { headers, appendHeaders } of configs) {
    if (headers) {
      if (!resolved.headers) resolved.headers = new Headers(headers as {});
      else {
        (headers as []).entries || (headers = entries(headers));
        for (const header of headers as [string, string][]) {
          resolved.headers.set(...header);
        }
      }
    }
    if (appendHeaders) {
      if (!resolved.headers) resolved.headers = new Headers(appendHeaders as {});
      else {
        (appendHeaders as []).entries || (appendHeaders = entries(appendHeaders));
        for (const header of appendHeaders as [string, string][]) {
          resolved.headers.append(...header);
        }
      }
    }
  }

  return resolved;
};

const parseFormData = (obj: object) => {
  const fd = new FormData();
  if (obj == null) return fd;
  typeof obj === 'object' || (obj = { 0: obj });
  for (const key of keys(obj)) {
    let value = (obj as JsObject<string>)[key];
    isFormDataEntryValue(value) || (value = jsonify(value));
    fd.append(key, value);
  }

  return fd;
};
