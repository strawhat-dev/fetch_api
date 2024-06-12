import type { HttpMethod } from '@/constants';
import type { JsObject, Union } from '@/types';
import type { FetchInput, FetchOptions, FetchQuery } from '@/types/api';
import { entries, isBodyInit, isFormDataEntryValue, isRequest, jsonify } from '@/utils';

export const parseInput = (input: FetchInput, params?: FetchQuery, baseURL?: string) => {
  if (!params && !baseURL) return input;
  input ||= '', params ||= '', baseURL ||= '';
  params &&= '?' + new URLSearchParams(params as {});
  const endpoint = ((input as Request).url ?? input.toString()).trim();
  endpoint.startsWith('http') && endpoint.startsWith(baseURL) && (baseURL = '');
  endpoint.startsWith('/') && baseURL.endsWith('/') && (baseURL = baseURL.slice(0, -1));
  const url = new URL(baseURL + endpoint + params);
  return isRequest(input) ? new Request(url, input) : url;
};

export const parseConfig = (method: Union<Uppercase<HttpMethod>>, ...configs: FetchOptions[]) => {
  const transform = method === 'GET' || method === 'POST' || method === 'OPTIONS';
  const ensureProperBody = (method === 'GET' || method === 'HEAD') && { body: undefined };
  const config = assign({ method, transform }, ...configs, parseHeaders(configs), ensureProperBody);
  if (config.body == null || isBodyInit(config.body)) return config;
  const headers = ((config.headers as Headers) ||= new Headers());
  const type = headers.get('content-type')?.toLowerCase();
  type || headers.set('content-type', 'application/json');
  config.body = type?.includes('multipart/form-data') ?
    (headers.delete('content-type'), parseFormData(config.body)) :
    type?.includes('application/x-www-form-urlencoded') ?
    new URLSearchParams(config.body) :
    jsonify(config.body);

  return config;
};

const parseHeaders = (configs: FetchOptions[]) => {
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
  const formdata = new FormData();
  if (obj == null) return formdata;
  typeof obj === 'object' || (obj = { 0: obj });
  for (const key of keys(obj)) {
    let value = (obj as JsObject)[key];
    isFormDataEntryValue(value) || (value = jsonify(value));
    formdata.append(key, value);
  }

  return formdata;
};

const { keys, assign } = Object;
