import type { IncomingHttpHeaders } from 'http';
import type { KeyOf, Union } from './index.js';
import type { JsonArray, JsonObject, Merge, OmitIndexSignature } from 'type-fest';

export type JsonResponse = JsonArray | JsonObject;

type FetchHandler<T extends JsonResponse = JsonResponse> = {
  readonly [method in FetchMethod]: <Config extends FetchConfig>(
    input: FetchInput,
    options?: Config,
  ) => Promise<Config['transform'] extends false ? Response : T>;
};

export type FetchApi = Merge<FetchConfig, FetchHandler>;

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
    headers?: FetchHeaders;
    body?: BodyInit | JsonObject;
  }
>;

export type FetchHeaders = Merge<
  OmitIndexSignature<IncomingHttpHeaders>,
  Partial<Record<'accept' | 'content-type', Union<MimeType>>>
> & { [header: string]: string };

export type FetchInput = RequestInfo | URL;

export type FetchRequest = FetchRequestInit & { input: FetchInput };

type FetchErrorHandler = (err: Error, req: FetchRequest) => void;

type FetchResponseHandler = {
  await?: boolean;
  (res: Response, req: FetchRequest): unknown;
};

export type FetchMethod =
  | 'get'
  | 'head'
  | 'post'
  | 'put'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace'
  | 'patch';

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
