/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Entries, JsonArray, JsonObject, Merge } from 'type-fest';
import type { IncomingHttpHeaders } from 'http';
import type { KeyOf, Union } from './index.js';

export type JsonResponse = JsonArray | JsonObject;

export type FetchApi = Merge<FetchConfig, FetchHandlers>;

export type FetchHandlers = { [method in FetchMethod]: FetchHandler };

export type FetchHandler<Options extends FetchConfig = { transform: true }> = {
  <T = JsonResponse>(
    input: FetchInput,
    options?: Options,
  ): Promise<Options['transform'] extends true ? Response : T>;
} & FetchConfig;

export type FetchConfig = Merge<
  Omit<FetchRequestInit, 'method'>,
  {
    baseURL?: string;
    transform?: boolean;
    onres?: FetchResponseHandler;
    onError?: FetchErrorHandler;
  }
>;

export type FetchRequestInit = Merge<
  RequestInit,
  {
    method: FetchMethod;
    body?: BodyInit | JsonObject;
    headers?: Partial<FetchHeaders> | Entries<FetchHeaders>;
  }
>;

export type FetchInput = RequestInfo | URL;

export type FetchRequest = Merge<FetchRequestInit, { input: FetchInput }>;

export type FetchResponseHandler = {
  await?: boolean;
  (res: Response, req: FetchRequest): unknown;
};

export type FetchErrorHandler = (err: Error, req: FetchRequest) => any;

export type FetchHeaders = Merge<
  Record<Union<KeyOf<IncomingHttpHeaders>>, string>,
  Record<'accept' | 'content-type', Union<MimeType>>
>;

export type FetchMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'connect'
  | 'options'
  | 'trace';

// most commonly used content types
// (https://stackoverflow.com/a/48704300)
export type MimeType =
  | 'application/EDI-X12'
  | 'application/EDIFACT'
  | 'application/java-archive'
  | 'application/javascript'
  | 'application/json'
  | 'application/ld+json'
  | 'application/octet-stream'
  | 'application/ogg'
  | 'application/pdf'
  | 'application/x-shockwave-flash'
  | 'application/x-www-form-urlencoded'
  | 'application/xhtml+xml'
  | 'application/xml'
  | 'application/zip'
  | 'audio/mpeg'
  | 'audio/vnd.rn-realaudio'
  | 'audio/x-ms-wma'
  | 'audio/x-wav'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/vnd.djvu'
  | 'image/x-icon'
  | 'multipart/alternative'
  | 'multipart/form-data'
  | 'multipart/mixed'
  | 'multipart/related'
  | 'text/css'
  | 'text/csv'
  | 'text/html'
  | 'text/javascript'
  | 'text/plain'
  | 'text/xml'
  | 'video/mp4'
  | 'video/mpeg'
  | 'video/quicktime'
  | 'video/webm'
  | 'video/x-flv'
  | 'video/x-ms-wmv'
  | 'video/x-msvideo';
