import type { Fn, JsObject, Primitive } from '@/types';
import { BODY_TYPES, SELF_CONSTRUCTABLE_TYPES, STRUCTURED_CLONABLE_TYPES } from '@/constants';

export const identity = <T>(x: T) => x;

export const isObject = (x: unknown): x is object => !isPrimitive(x);

export const isRequest = (x: unknown): x is Request => !!x && type(x) === 'Request';

export const isPromise = (x: unknown): x is Promise<any> => !!x && type(x) === 'Promise';

export const isPrimitive = (x: unknown): x is Primitive => (
  !x || (typeof x !== 'object' && typeof x !== 'function')
);

export const isNode = (x: unknown): x is Node => (
  !!(x as Node)?.ELEMENT_NODE && typeof (x as Node).cloneNode === 'function'
);

export const isBodyInit = (x: unknown): x is BodyInit => (
  isFormDataEntryValue(x) || ArrayBuffer.isView(x) || BODY_TYPES.has(type(x))
);

export const isFormDataEntryValue = (x: unknown): x is FormDataEntryValue => {
  if (x == null) return false;
  return ['String', 'File', 'Blob'].includes(type(x));
};

export const type = (x: unknown) => {
  if (x == null || Number.isNaN(x)) return 'null';
  return x.constructor?.name || prototype.toString.call(x).slice(8, -1);
};

export const jsonify = (x: any) => (
  isPrimitive(x) ? x?.toString() : JSON.stringify(
    type(x) === 'Map' ? fromEntries(x) : x[Symbol.iterator] ? [...x] : x
  )
);

export const clear = <T extends JsObject>(obj: T) => {
  if (!obj) return {} as never;
  for (const key of keys(obj)) delete obj[key];
  return obj;
};

export const clone = ((src: any) => {
  if (skipClone(src)) return src;
  if (isArray(src)) return cloneArray(src);
  if (isNode(src)) return src.cloneNode(true);
  if (SELF_CONSTRUCTABLE_TYPES.has(type(src))) return new src.constructor(src);
  if (STRUCTURED_CLONABLE_TYPES.has(type(src)) || ArrayBuffer.isView(src)) return structured_clone(src);
  return entries(src).reduce((acc, [key, value]) => {
    skipClone(value) || (value = clone(value));
    acc[key] = value;
    return acc;
  }, {} as JsObject);
}) as <T>(src: T) => T;

const { isArray } = Array;

const { keys, entries, prototype, fromEntries } = Object;

const structured_clone = globalThis['structuredClone'] || identity;

const skipClone = (src: unknown): src is Primitive | Fn => !src || typeof src !== 'object';

const cloneArray = (src: any[]) => {
  const len = src.length;
  const arr = new Array(len);
  for (let i = 0; i < len; ++i) {
    let value = src[i];
    skipClone(value) || (value = clone(value));
    arr[i] = value;
  }

  return arr;
};
