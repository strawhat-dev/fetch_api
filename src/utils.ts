/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JsObject } from './types/index.js';

import { deepmergeCustom } from 'deepmerge-ts';

declare global {
  interface Headers {
    extend(other: HeadersInit): this;
  }
}

export const deepmerge = deepmergeCustom({
  enableImplicitDefaultMerging: true,
  mergeRecords(records, _, meta) {
    // skip merging bodies
    if (meta?.key === 'body') return records.at(-1);
  },
  mergeOthers(others, { defaultMergeFunctions: { mergeOthers } }, meta) {
    if (meta?.key === 'headers') {
      return others.reduce<Headers>((headers, value) => headers.extend(value as {}), new Headers());
    }

    meta || (others as unknown as []).pop();
    return mergeOthers(others);
  },
});

export const type = (value: unknown) => Object.prototype.toString.call(value).slice(8, -1);
export const isobject = (value: unknown): value is object => value === Object(value);
export const isRequest = (value: unknown): value is Request => type(value) === 'Request';
export const isHeaders = (value: unknown): value is Headers => type(value) === 'Headers';
export const isObject = (value: unknown): value is JsObject<any> => type(value) === 'Object';
export const isPromise = (value: unknown): value is Promise<any> => type(value) === 'Promise';
export const define = (target: object, props?: JsObject) => {
  props || ([target, props] = [{}, target as JsObject]);
  for (const [prop, value] of Object.entries(props)) Object.defineProperty(target, prop, { value });
  return target;
};

define(Headers.prototype, {
  extend(other: HeadersInit) {
    const instance = this as unknown as Headers;
    let entries = (other || []) as [string, string][];
    isHeaders(other) && (entries = [...other.entries()]);
    Array.isArray(entries) || (entries = Object.entries(entries));
    for (const [k, v] of entries) instance.append(k, v);
    return instance;
  },
});
