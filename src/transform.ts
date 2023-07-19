import type { JsObject } from '@/types';
import type { FetchConfig, FetchInput, FetchRequest, HttpMethod } from '@/types/api';

import { isBodyInit, isFormDataEntryValue, isPromise, isRequest, jsonify } from '@/utils';

export const fetchedMethod = async (method: HttpMethod, input: FetchInput, config: FetchConfig) => {
  const { transform, onres, onError, ...init } = config;
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

export const parseInput = (input: FetchInput, baseURL?: string, query?: {}): FetchInput => {
  const asRequest = isRequest(input);
  if (asRequest && !baseURL && !query) return input;
  const searchParams = query ? `?${new URLSearchParams(query)}` : '';
  let url = (asRequest ? input.url : `${input || ''}`).trim();
  if (!url || !baseURL) return `${url || baseURL || ''}${searchParams}`;
  (url = url.replace(/^\/+/, '')), (baseURL = baseURL.replace(/\/+$/, ''));
  const resolved = new URL(`${baseURL}/${url}${searchParams}`);
  return asRequest ? new Request(resolved, input) : resolved;
};

export const parseConfig = (...configs: FetchConfig[]) => {
  const config = Object.assign({ transform: true }, ...configs);
  if (config.body == null || isBodyInit(config.body)) return config;
  const headers = ((config.headers as Headers) ??= new Headers());
  const contentType = headers.get('content-type')!;
  contentType || headers.set('content-type', 'application/json');
  config.body = /multipart\/form-data/.test(contentType)
    ? (headers.delete('content-type'), parseFormData(config.body))
    : /application\/x-www-form-urlencoded/.test(contentType)
    ? new URLSearchParams(config.body as JsObject<string>)
    : jsonify(config.body);

  return config;
};

export const mergeHeaders = (...configs: FetchConfig[]) => {
  const resolved = {} as { headers?: Headers };
  for (let { headers, appendHeaders } of configs) {
    if (headers) {
      if (!resolved.headers) resolved.headers = new Headers(headers as {});
      else {
        headers.entries || (headers = Object.entries(headers));
        for (const header of headers as [string, string][]) {
          resolved.headers.set(...header);
        }
      }
    }

    if (appendHeaders) {
      if (!resolved.headers) resolved.headers = new Headers(appendHeaders as {});
      else {
        appendHeaders.entries || (appendHeaders = Object.entries(appendHeaders));
        for (const header of appendHeaders as [string, string][]) {
          resolved.headers.append(...header);
        }
      }
    }
  }

  return resolved;
};

export const parseFormData = (obj: object) => {
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
