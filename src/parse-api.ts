import type { HttpMethod } from '@/constants';
import type { Entry, JsObject, Union } from '@/types';
import type { FetchInput, FetchOptions, FetchRequestInit } from '@/types/api';
import { isBodyInit, isFormDataEntryValue, isRequest, jsonify } from '@/utils';

const { isArray } = Array;

const { entries, assign } = Object;

export const parseInput = (input?: FetchInput, baseURL?: string, params?: URLSearchParams) => {
  (input ||= ''), (baseURL ||= '');
  let path = ((input as Request).url ?? input.toString()).trim();
  (!baseURL || /^https?:\/\//i.test(path)) && ([baseURL, path] = [path, '']);
  baseURL.endsWith('/') && (baseURL = baseURL.slice(0, -1));
  path.startsWith('/') && (path = path.slice(1));
  const url = new URL(baseURL + '/' + path);
  params?.entries?.().forEach((entry) => url.searchParams.append(...entry));
  return isRequest(input) ? new Request(url, input) : url;
};

export const parseConfig = (method: Union<Uppercase<HttpMethod>>, ...configs: FetchOptions[]) => {
  const transform = method === 'GET' || method === 'POST' || method === 'OPTIONS';
  const preventInvalidBody = (method === 'GET' || method === 'HEAD') && { body: null };
  const config = assign({ method, transform }, ...configs, mergeConfigs(configs), preventInvalidBody);
  if (config.body == null || isBodyInit(config.body)) return config as never;
  const headers: Headers = (config.headers ||= new Headers());
  const ctype = headers.get('content-type')?.toLowerCase();
  ctype || headers.set('content-type', 'application/json');
  config.body = ctype?.includes('multipart/form-data') ?
    (headers.delete('content-type'), parseFormData(config.body)) :
    ctype?.includes('application/x-www-form-urlencoded') ?
    new URLSearchParams(config.body) :
    jsonify(config.body);

  return config as FetchRequestInit;
};

const parseFormData = (data: object) => {
  typeof (data ??= {}) === 'object' || (data = { data });
  return entries(data).reduce((formData, [key, value]) => {
    isFormDataEntryValue(value) || (value = jsonify(value));
    formData.append(key, value);
    return formData;
  }, new FormData());
};

const mergeConfigs = (configs: FetchOptions[]) => {
  const config: { params?: URLSearchParams; headers?: Headers } = {};
  for (let { params, headers, appendHeaders } of configs as JsObject[]) {
    if (params) {
      if (!config.params) config.params = new URLSearchParams(params);
      else {
        isArray(params) || (params = new URLSearchParams(params).entries());
        params.forEach((entry: Entry) => config.params!.set(...entry));
      }
    }
    if (headers) {
      if (!config.headers) config.headers = new Headers(headers);
      else {
        isArray(headers) || (headers = entries(headers));
        headers.forEach((entry: Entry) => config.headers!.set(...entry));
      }
    }
    if (appendHeaders) {
      if (!config.headers) config.headers = new Headers(appendHeaders);
      else {
        isArray(appendHeaders) || (appendHeaders = entries(appendHeaders));
        appendHeaders.forEach((entry: Entry) => config.headers!.append(...entry));
      }
    }
  }

  return config;
};
