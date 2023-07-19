import type { JsObject, Primitive } from '@/types';

const structured_clone = globalThis['structuredClone'] || ((target) => target);

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

  const copy = {};
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

export const jsonify = (target: {} | []) => {
  if (isPrimitive(target)) return target?.toString();
  if (target instanceof Map) return JSON.stringify(Object.fromEntries(target));
  if (Symbol.iterator in target) return JSON.stringify([...target]);
  return JSON.stringify(target);
};

const type = (value: unknown) => Object.prototype.toString.call(value).slice(8, -1);
export const isFormDataEntryValue = (value: unknown): value is FormDataEntryValue => typeof value === 'string' || value instanceof Blob;
export const isBodyInit = (value: unknown): value is BodyInit => isFormDataEntryValue(value) || ArrayBuffer.isView(value) || BODY_TYPES.has(type(value));
export const isPromise = (value: unknown): value is Promise<unknown> => type(value) === 'Promise';
export const isRequest = (value: unknown): value is Request => type(value) === 'Request';
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
