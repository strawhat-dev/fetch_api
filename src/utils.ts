import type { Primitive } from 'type-fest';
import type { JsObject } from '@/types';

import { BODY_TYPES, SELF_CONSTRUCTABLE_TYPES, STRUCTURED_CLONABLE_TYPES } from '@/constants';

/** Deep clone most standard objects. Does not handle non-enumerable properties or circular references. */
export const clone = <T>(target: T): T => {
  const t = type(target);
  if (isPrimitive(target)) return target;
  if (isNode(target)) return target.cloneNode(true) as T;
  if (Array.isArray(target)) return target.map(clone) as T;
  if (t === 'Set') return new Set([...(target as [])].map(clone)) as T;
  if (t === 'Map') return new Map([...(target as [])].map(clone)) as T;
  if (SELF_CONSTRUCTABLE_TYPES.has(t)) return new (target as any).constructor(target);
  if (STRUCTURED_CLONABLE_TYPES.has(t) || ArrayBuffer.isView(target)) return structured_clone(target);

  const copy = typeof target === 'function' ? target.bind({}) : {};
  for (const key of Object.keys(target!)) {
    let value = (target as JsObject)[key];
    isPrimitive(value) || (value = clone(value));
    (copy as JsObject)[key] = value;
  }

  return copy as T;
};

export const clear = (target: object) => {
  if (!target) return {};
  for (const key of Object.keys(target)) {
    delete (target as JsObject)[key];
  }

  return target;
};

const structured_clone = globalThis['structuredClone'] || ((target) => target);
export const type = (value: unknown) => Object.prototype.toString.call(value).slice(8, -1);
export const jsonify: typeof JSON.stringify = (value, ...args) => JSON.stringify(type(value) === 'Map' ? Object.fromEntries(value) : value?.[Symbol.iterator] ? [...value] : value, ...args as []);
export const isNode = (value: unknown): value is Node => typeof globalThis['Node'] === 'function' && typeof globalThis['Node'].prototype === 'object' && value instanceof globalThis['Node'];
export const isBodyInit = (value: unknown): value is BodyInit => isFormDataEntryValue(value) || ArrayBuffer.isView(value) || BODY_TYPES.has(type(value));
export const isPrimitive = (value: unknown): value is Primitive => !value || (typeof value !== 'object' && typeof value !== 'function');
export const isPromise = (value: unknown): value is Promise<unknown> => !!value && type(value) === 'Promise';
export const isRequest = (value: unknown): value is Request => !!value && type(value) === 'Request';
export const isFormDataEntryValue = (value: unknown): value is FormDataEntryValue => {
  if (typeof value === 'string') return true;
  if (!value) return false;
  const t = type(value);
  return t === 'File' || t === 'Blob';
};
