/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JsObject } from './types/index.js';
import type { FetchConfig, FetchInput } from './types/api.js';

import { deepmerge, isObject, isRequest } from './utils.js';

export const resolveInput = (input: FetchInput, baseURL?: string) => {
  if (!baseURL || !input) return input ?? baseURL ?? '';
  const asRequest = isRequest(input);
  const url = (asRequest ? input.url : input.toString()).trim();
  if (url.startsWith(baseURL)) return input;
  const resolved = new URL([baseURL.replace(/[/]+$/, ''), url.replace(/^[/]+/, '')].join('/'));
  return asRequest ? new Request(resolved, input) : resolved;
};

export const resolveConfig = (...configs: any[]) => {
  const config = deepmerge({ transform: true }, ...configs) as FetchConfig;
  if (!isObject(config.body)) return config; // skip transforming body

  let contentType;
  if (Array.isArray(config.headers)) {
    contentType = (config.headers.find((cur) => /content-type/i.test(cur[0])) ?? []).pop();
    contentType ??= (config.headers.push(['content-type', 'application/json']), 'application/json');
  } else {
    (config.headers ??= {}), (config.headers['content-type'] ??= 'application/json');
    contentType = config.headers['content-type'] ?? config.headers['Content-Type'];
  }

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
