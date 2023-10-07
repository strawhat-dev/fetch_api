import type { Entries } from 'type-fest';
import type { Composite, JsObject, primitive } from '@/types';
import { BODY_TYPES, SELF_CONSTRUCTABLE_TYPES, STRUCTURED_CLONABLE_TYPES } from '@/constants';

export const type = (x: unknown) => {
  if (x == null || Number.isNaN(x)) return 'Nullish';
  return x.constructor?.name ?? Object.prototype.toString.call(x).slice(8, -1);
};

export const isobject = (x: unknown): x is object => !isPrimitive(x);

export const isPrimitive = (x: unknown): x is primitive => (
  !x || (typeof x !== 'object' && typeof x !== 'function')
);

export const isPromise = (x: unknown): x is Promise<any> => (
  !!x && type(x) === 'Promise'
);

export const isRequest = (x: unknown): x is Request => (
  !!x && type(x) === 'Request'
);

export const isNode = (x: unknown): x is Node => (
  !!(x as Node)?.ELEMENT_NODE && typeof (x as Node).cloneNode === 'function'
);

export const isBodyInit = (x: unknown): x is BodyInit => (
  isFormDataEntryValue(x) || ArrayBuffer.isView(x) || BODY_TYPES.has(type(x))
);

export const isFormDataEntryValue = (x: unknown): x is FormDataEntryValue => {
  if (x == null) return false;
  const t = type(x);
  return t === 'String' || t === 'File' || t === 'Blob';
};

export const jsonify = (x: any) => (
  JSON.stringify(
    type(x) === 'Map' ?
      Object.fromEntries(x) :
      x?.[Symbol.iterator] ?
      [...x] :
      x
  )
);

export const entries = <T extends JsObject>(obj: T) => {
  if (!obj) return [] as never;
  const ret: any[] = Object.keys(obj);
  const len = ret.length;
  for (let i = 0; i < len; ++i) ret[i] = [ret[i], obj[ret[i]]];
  return ret as Entries<Composite<T>>;
};

export const clone = ((source: any) => {
  if (skipClone(source)) return source;
  if (isNode(source)) return source.cloneNode(true);
  if (Array.isArray(source)) return clone_array(source, new Array(source.length));

  const t = type(source);
  const Constructor = source.constructor;
  if (t === 'Set' || t === 'Map') return new Constructor(clone_array([...source]));
  if (SELF_CONSTRUCTABLE_TYPES.has(t)) return new Constructor(source);
  if (STRUCTURED_CLONABLE_TYPES.has(t) || ArrayBuffer.isView(source)) {
    return structured_clone(source);
  }

  const target: JsObject = {};
  for (const key of Object.keys(source)) {
    let value = source[key];
    skipClone(value) || (value = clone(value));
    target[key] = value;
  }

  return target;
}) as <T>(source: T) => T;

export const clear = ((obj) => {
  if (!obj) return {};
  for (const key of Object.keys(obj) as []) delete obj[key];
  return obj;
}) as typeof clone;

const skipClone = (x: unknown) => !x || typeof x !== 'object';

const structured_clone = globalThis['structuredClone'] || ((x) => x);

const clone_array = (source: any[], target = source) => {
  const len = source.length;
  for (let i = 0; i < len; ++i) {
    let cur = source[i];
    skipClone(cur) || (cur = clone(cur));
    target[i] = cur;
  }

  return target;
};
