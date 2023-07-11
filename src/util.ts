/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JsObject, Union } from './types/index.js';
import type { Merge } from 'type-fest';

export const define = (init: JsObject) => {
  const target = {};
  for (const [prop, value] of Object.entries(init)) Object.defineProperty(target, prop, { value });
  return target;
};

export const type = (value: unknown) => Object.prototype.toString.call(value).slice(8, -1);
export const isRequest = (value: unknown): value is Request => type(value) === 'Request';
export const isObject = (value: unknown): value is JsObject<any> => type(value) === 'Object';
export const isPromise = (value: unknown): value is Promise<any> => type(value) === 'Promise';
