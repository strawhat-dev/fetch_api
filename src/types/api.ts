import type { IncomingHttpHeaders } from 'http';
import type {
  Entries,
  JsObject,
  JsonObject,
  JsonPrimitive,
  Jsonifiable,
  KeyOf,
  Merge,
  PartialRecord,
  Union,
} from '@/types';

export type HttpMethod = KeyOf<RequestDispatch>;
export type FetchInput = RequestInfo | URL;
export type FetchRequest = Merge<RequestInit, { input: FetchInput }>;
export type FetchConfig = Merge<Omit<RequestInit, 'method'>, ApiOptions>;
export type FetchHeaders = Headers | Partial<HttpHeaders> | Entries<HttpHeaders>;
export type FetchInit = Merge<FetchConfig, PartialRecord<HttpMethod, FetchConfig>>;
export interface FetchedApi extends Merge<FetchConfig, ApiDispatch & RequestDispatch> {}
export type FetchBody = BodyInit | Jsonifiable | Set<Jsonifiable> | Map<JsonPrimitive, Jsonifiable>;
export type FetchParams =
  | JsObject<JsonPrimitive>
  | ConstructorParameters<typeof URLSearchParams>[0];

interface ApiOptions {
  transform?: boolean;
  baseURL?: string;
  body?: FetchBody;
  query?: JsonObject;
  headers?: FetchHeaders;
  appendHeaders?: FetchHeaders;
  onres?: FetchResponseHandler | { await: FetchResponseHandler };
  onError?: (req: { error?: Error } & FetchRequest) => any;
}

export interface ApiDispatch {
  /**
   * Set the defaults for the current instance.
   * @returns the current **mutated** instance.
   */
  set(config: FetchInit): FetchedApi;
  /**
   * Configure and update the current instance.
   * @returns the current **mutated** instance.
   */
  configure(config: FetchInit): FetchedApi;
  /**
   * Create and initialize a new instance.
   * @returns the **new** instance.
   */
  create(config?: FetchInit): FetchedApi;
  /**
   * Create a new instance based off of the current one while
   * optionally providing a new config object to merge with.
   * @returns the **new** instance with *inherited* defaults.
   */
  with(config?: FetchInit): FetchedApi;
}

export interface RequestDispatch {
  /**
   * The `GET` method requests a representation of the specified resource.
   * Requests using `GET` should only retrieve data.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET}
   */
  get: FetchMethodWithoutBody;
  /**
   * The `POST` method submits an entity to the specified resource,
   * often causing a change in state or side effects on the server.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST}
   */
  post: FetchMethodWithBody;
  /**
   * The `PUT` method replaces all current representations
   * of the target resource with the request payload.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT}
   */
  put: FetchMethodWithBody;
  /**
   * The `PATCH` method applies partial modifications to a resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH}
   */
  patch: FetchMethodWithBody;
  /**
   * The `DELETE` method deletes the specified resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE}
   */
  delete: FetchMethod;
  /**
   * The `HEAD` method asks for a response identical
   * to a `GET` request, but without the response body.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD}
   */
  head: FetchMethodWithoutBody;
  /**
   * The `TRACE` method performs a message loop-back
   * test along the path to the target resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE}
   */
  trace: FetchMethod;
  /**
   * The `CONNECT` method establishes a tunnel to
   * the server identified by the target resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT}
   */
  connect: FetchMethod;
  /**
   * The `OPTIONS` method describes the communication options for the target resource.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS}
   */
  options: FetchMethod;
}

type FetchMethod = {
  <Data = JsonObject, Transform extends boolean = true>(
    input: FetchInput,
    options?: FetchOptions & { transform?: Transform },
  ): Promise<Transform extends false ? Response : Data>;
} & FetchConfig;

type FetchMethodWithBody = {
  <Data = JsonObject, Transform extends boolean = true>(
    input: FetchInput,
    body: FetchBody,
    options?: Omit<FetchOptions, 'body'> & { transform?: Transform },
  ): Promise<Transform extends false ? Response : Data>;
} & FetchConfig;

type FetchMethodWithoutBody = {
  <Data = JsonObject, Transform extends boolean = true>(
    input: FetchInput,
    options?: Omit<FetchOptions, 'body'> & { transform?: Transform },
  ): Promise<Transform extends false ? Response : Data>;
} & Omit<FetchConfig, 'body'>;

type FetchOptions = FetchConfig & { method?: Union<HttpMethod> };
type FetchResponseHandler = (res: Response, req: FetchRequest) => unknown;
type HttpHeaders = Merge<
  Record<Union<KeyOf<IncomingHttpHeaders>>, string>,
  Record<'accept' | 'content-type', Union<ContentMimeType>>
>;

/**
 * common content-types \
 * {@link https://stackoverflow.com/a/48704300}
 */
type ContentMimeType =
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
