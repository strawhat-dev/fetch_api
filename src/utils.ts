import type { Fn, JsObject, Primitive } from '@/types';
import { BODY_TYPES, SELF_CONSTRUCTABLE_TYPES, STRUCTURED_CLONABLE_TYPES } from '@/constants';

export const isRecord = (x: unknown): x is JsObject => !!x && type(x) === 'Object';

export const isRequest = (x: unknown): x is Request => !!x && type(x) === 'Request';

export const isPromise = (x: unknown): x is Promise<any> => !!x && type(x) === 'Promise';

export const isPrimitive = (x: unknown): x is Primitive => (
  !x || (typeof x !== 'object' && typeof x !== 'function')
);

export const isNode = (x: unknown): x is Node => (
  !!(x as Node)?.ELEMENT_NODE && typeof (x as Node).cloneNode === 'function'
);

export const isFormDataEntryValue = (x: unknown): x is FormDataEntryValue => (
  x != null && ['String', 'File', 'Blob'].includes(type(x))
);

export const isBodyInit = (x: unknown): x is BodyInit => (
  isFormDataEntryValue(x) || ArrayBuffer.isView(x) || BODY_TYPES.has(type(x))
);

export const type = (x: unknown) => {
  if (x == null || Number.isNaN(x)) return 'null';
  return x.constructor?.name || prototype.toString.call(x).slice(8, -1);
};

export const jsonify = (x: any) => {
  if (x == null) return null;
  if (typeof x === 'string') return JSON.stringify(x);
  if (isPrimitive(x)) return x!.toString();
  return JSON.stringify(toJsonObject(x));
};

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

const structured_clone = globalThis['structuredClone'] || ((x) => x);

const skipClone = (x: unknown): x is Primitive | Fn => !x || typeof x !== 'object';

const toJsonObject = (x: any) => {
  if (isArray(x)) return x;
  if (!x?.[Symbol.iterator]) return x;
  return type(x) === 'Map' ? fromEntries(x) : [...x];
};

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
