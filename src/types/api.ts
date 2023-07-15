import type { IncomingHttpHeaders } from 'http';
import type { Entries, JsonObject, JsonValue, Merge } from 'type-fest';
import type { KeyOf, PartialRecord, Union } from '@/types';

export type FetchInput = RequestInfo | URL;
export type FetchRequest = Merge<RequestInit, { input: FetchInput }>;
export type FetchApi = Merge<FetchConfig, ApiDispatch & RequestDispatch>;
export type FetchInit = Merge<FetchConfig, PartialRecord<HttpMethod, FetchConfig>>;
export type FetchConfig = Merge<
  Omit<RequestInit, 'method'>,
  {
    baseURL?: string;
    transform?: boolean;
    body?: BodyInit | JsonObject;
    headers?: Partial<FetchHeaders> | Entries<FetchHeaders>;
    appendHeaders?: Partial<FetchHeaders> | Entries<FetchHeaders>;
    onres?: ((res: Response, req: FetchRequest) => unknown) & { await?: boolean };
    onError?: (err: Error, req: FetchRequest) => any;
  }
>;

export interface ApiDispatch {
  /**
   * Creates and initializes a new instance.
   * @returns the **new** instance.
   */
  create(config?: FetchInit): FetchApi;
  /**
   * Configure and update the current instance.
   * @returns the current **mutated** instance.
   */
  configure(config: FetchInit): FetchApi;
  /**
   * Sets the defaults for the current instance.
   * @returns the current **mutated** instance.
   */
  set(config: FetchInit): FetchApi;
  /**
   * Creates a new instance based off of the current one while,
   * optionally providing a configuration object to merge with.
   * @returns the **new** instance with *inherited* defaults.
   */
  with(config?: FetchInit): FetchApi;
}

export interface RequestDispatch {
  /**
   * The `GET` method requests a representation of the specified resource.
   * Requests using `GET` should only retrieve data.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET}
   */
  get: FetchMethod;
  /**
   * The `POST` method submits an entity to the specified resource,
   * often causing a change in state or side effects on the server.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST}
   */
  post: FetchMethod;
  /**
   * The `PUT` method replaces all current representations
   * of the target resource with the request payload.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT}
   */
  put: FetchMethod;
  /**
   * The `PATCH` method applies partial modifications to a resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH}
   */
  patch: FetchMethod;
  /**
   * The `DELETE` method deletes the specified resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE}
   */
  delete: FetchMethod;
  /**
   * The `OPTIONS` method describes the communication options for the target resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS}
   */
  options: FetchMethod;
  /**
   * The `HEAD` method asks for a response identical
   * to a `GET` request, but without the response body.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD}
   */
  head: FetchMethod;
  /**
   * The `CONNECT` method establishes a tunnel to
   * the server identified by the target resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT}
   */
  connect: FetchMethod;
  /**
   * The `TRACE` method performs a message loop-back
   * test along the path to the target resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE}
   */
  trace: FetchMethod;
}

export type FetchMethod = {
  <T = JsonValue, Transform extends boolean = true>(
    input: FetchInput,
    options?: FetchConfig & { transform?: Transform },
  ): Promise<Transform extends false ? Response : T>;
} & FetchConfig;

export type FetchHeaders = Merge<
  Record<KeyOf<IncomingHttpHeaders>, string>,
  Record<'accept' | 'content-type', Union<MimeType>>
>;

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'connect'
  | 'options'
  | 'trace';

/**
 * common content-types \
 * {@link https://stackoverflow.com/a/48704300}
 */
type MimeType =
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
