import type { JsObject, Primitive } from '@/types';

export const extend = (target: object, props?: JsObject) => {
  props || ([target, props] = [{}, target as JsObject]);
  for (const key of Object.keys(props)) {
    const value = props[key];
    if (typeof value === 'function' && !value.name) {
      Object.defineProperty(value, 'name', { value: key, configurable: true });
    }

    if (key in target) {
      const prev = (target as JsObject)[key];
      !isPrimitive(value) && !isPrimitive(prev) && Object.assign(value!, prev);
      continue;
    }

    Object.defineProperty(target, key, { value });
  }

  return target;
};

export const clear = (target: object) => {
  target ||= {};
  for (const key of Object.keys(target)) delete (target as JsObject)[key];
  return target;
};

export const jsonify = (target: any) => {
  if (isPrimitive(target)) return target?.toString();
  if (target instanceof Map) return JSON.stringify(Object.fromEntries(target));
  if (Symbol.iterator in target) return JSON.stringify([...target]);
  return JSON.stringify(target);
};

export const clone = <T>(target: T): T => {
  const t = type(target);
  if (isPrimitive(target)) return target;
  if (Array.isArray(target)) return target.map(clone) as T;
  if (ArrayBuffer.isView(target)) return structured_clone(target);
  if (STRUCTURED_CLONABLE_TYPES.has(t)) return structured_clone(target);
  if (SELF_CONSTRUCTABLE_TYPES.has(t)) return new (target as any).constructor(target);
  if (target instanceof Set) return new Set([...target].map(clone)) as T;
  if (target instanceof Map) return new Map([...target].map(clone)) as T;
  if (target instanceof Node) return target.cloneNode(true) as T;

  const copy = {} as JsObject;
  for (const key of Object.keys(target as {})) {
    let value = (target as JsObject)[key];
    isPrimitive(value) || (value = clone(value));
    copy[key] = value;
  }

  return copy as T;
};

const structured_clone = globalThis['structuredClone'] || ((target) => target);
const type = (value: unknown) => Object.prototype.toString.call(value).slice(8, -1);
export const isValidFetchBody = (value: unknown): value is BodyInit => isValidFormDataValue(value) || ArrayBuffer.isView(value) || BODY_TYPES.has(type(value));
export const isValidFormDataValue = (value: unknown): value is FormDataEntryValue => typeof value === 'string' || value instanceof Blob;
export const isPromise = (value: unknown): value is Promise<unknown> => type(value) === 'Promise';
export const isRequest = (value: unknown): value is Request => type(value) === 'Request';
export const isHeaders = (value: unknown): value is Headers => type(value) === 'Headers';
export const isPrimitive = (value: unknown): value is Primitive => {
  if (!value) return true;
  const t = typeof value;
  return t !== 'object' && t !== 'function';
};

const BODY_TYPES = new Set(['URLSearchParams', 'FormData', 'ReadableStream', 'ArrayBuffer', 'SharedArrayBuffer']);
const SELF_CONSTRUCTABLE_TYPES = new Set(['Date', 'Error', 'Headers', 'RegExp', 'Request', 'Response', 'URL', 'URLSearchParams']);
const STRUCTURED_CLONABLE_TYPES = new Set([
  'ArrayBuffer',
  'AudioData',
  'Blob',
  'CropTarget',
  'CryptoKey',
  'DOMException',
  'DOMMatrix',
  'DOMMatrixReadOnly',
  'DOMPoint',
  'DOMPointReadOnly',
  'DOMQuad',
  'DOMRect',
  'DOMRectReadOnly',
  'File',
  'FileList',
  'FileSystemDirectoryHandle',
  'FileSystemFileHandle',
  'FileSystemHandle',
  'GPUCompilationInfo',
  'GPUCompilationMessage',
  'ImageBitmap',
  'ImageData',
  'RTCCertificate',
  'SharedArrayBuffer',
  'VideoFrame',
]);
