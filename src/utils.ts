import type { JsObject } from '@/types';

export const define = (target: object, props?: JsObject) => {
  props || ([target, props] = [{}, target as JsObject]);
  for (const [prop, value] of Object.entries(props)) Object.defineProperty(target, prop, { value });
  return target;
};

export const clear = (target: object) => {
  target ||= {};
  for (const key of Object.keys(target)) delete target[key as never];
  return target;
};

export const parseFormData = (data: JsObject<string | Blob>) => {
  const formdata = new FormData();
  const { $filename, ...rest } = data;
  for (const entry of Object.entries(rest)) {
    $filename && isBlob(entry[1]) && entry.push($filename);
    formdata.append(...entry);
  }

  return formdata;
};

export const mergeHeaders = (
  target: Headers,
  headers: Partial<HeadersInit>,
  method: 'set' | 'append' = 'set',
) => {
  let entries = headers as Iterable<[string, string]>;
  if (isHeaders(entries)) entries = entries.entries();
  else if (!Array.isArray(entries)) entries = Object.entries(entries);
  for (const entry of entries) target[method](...(entry as [string, string]));
  return target;
};

export const type = (value: unknown) => Object.prototype.toString.call(value).slice(8, -1);
export const isBlob = (value: unknown): value is Blob => type(value) === 'Blob';
export const isRequest = (value: unknown): value is Request => type(value) === 'Request';
export const isHeaders = (value: unknown): value is Headers => type(value) === 'Headers';
export const isObject = (value: unknown): value is JsObject<any> => type(value) === 'Object';
export const isPromise = (value: unknown): value is Promise<any> => type(value) === 'Promise';
