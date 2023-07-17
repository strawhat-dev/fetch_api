import type { JsObject, Primitive } from '@/types';

export const extend = (target: object, props?: JsObject) => {
  props || ([target, props] = [{}, target as JsObject]);
  for (const [prop, value] of Object.entries(props)) {
    typeof value === 'function' && Object.defineProperty(value, 'name', { value: prop });
    Object.defineProperty(target, prop, { value });
  }

  return target;
};

export const clear = (target: object) => {
  target ||= {};
  for (const key of Object.keys(target)) delete target[key as never];
  return target;
};

export const jsonify = (target: unknown) => {
  if (isPrimitive(target)) return target?.toString();
  const t = type(target);
  if (t === 'Set') target = [...(target as Set<unknown>)];
  if (t === 'Map') target = Object.fromEntries(target as Map<unknown, unknown>);
  return JSON.stringify(target);
};

export const clone = <T>(target: T): T => {
  const t = type(target);
  if (isPrimitive(target)) return target;
  if (Array.isArray(target)) return target.map(clone) as T;
  if (t === 'RegExp') return new RegExp(target as '') as T;
  if (t === 'Date') return new Date(target as '') as T;
  if (t === 'Set') return new Set(clone([...(target as [])])) as T;
  if (t === 'Map') return new Map(clone([...(target as [])])) as T;
  if (target instanceof Blob) return cloneBuffer(target);
  if (t.endsWith('ArrayBuffer')) return cloneBuffer(target);
  if (ArrayBuffer.isView(target)) return cloneBuffer(target);

  const obj = {} as JsObject<unknown>;
  for (const key in target) {
    if (!Object.hasOwn(target as {}, key)) continue;
    let cur = target[key];
    isPrimitive(cur) || (cur = clone(cur));
    obj[key] = cur;
  }

  return obj as T;
};

const cloneBuffer = globalThis['structuredClone'] || ((value) => value);
const type = (value: unknown) => Object.prototype.toString.call(value).slice(8, -1);
export const isRequest = (value: unknown): value is Request => type(value) === 'Request';
export const isHeaders = (value: unknown): value is Headers => type(value) === 'Headers';
export const isPromise = (value: unknown): value is Promise<unknown> => type(value) === 'Promise';
export const isPrimitive = (value: unknown): value is Primitive => !value || typeof value !== 'object';
export const isValidFormDataValue = (value: unknown): value is string | Blob => typeof value === 'string' || value instanceof Blob;
export const isValidFetchBody = (value: unknown): value is BodyInit => {
  const t = type(value);
  if (t === 'FormData') return true;
  if (t === 'ReadableStream') return true;
  if (t === 'URLSearchParams') return true;
  if (t.endsWith('ArrayBuffer')) return true;
  if (ArrayBuffer.isView(value)) return true;
  return isValidFormDataValue(value);
};
