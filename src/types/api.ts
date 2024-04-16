import type * as tf from 'type-fest';
import type { IncomingHttpHeaders } from 'http';
import type { JsObject, JsonObject, KeyOf, Union } from '@/types';
import type { HttpMethod } from '@/constants';

export type FetchInput = RequestInfo | URL;
export type FetchHeaders = Partial<HttpHeaders> | tf.Entries<HttpHeaders> | object;
export type FetchQuery = JsObject<tf.JsonPrimitive> | ConstructorParameters<typeof URLSearchParams>[0];
export type FetchBody = BodyInit | tf.Jsonifiable | Set<tf.Jsonifiable> | Map<tf.JsonPrimitive, tf.Jsonifiable>;
export type FetchConfig = FetchOptions & { [method in HttpMethod]?: tf.Merge<FetchedApi[method], {}> };

/**
 * Simple and lightweight configurable request client with cross-support
 * for both browsers and node.js *(versions >=18)*, providing many axios-like
 * conveniences such as automatic transforms and an alternative intuitive api,
 * all while using `fetch-api` natively without any other external dependencies.
 *
 * ```js
 * import api from 'fetched-api';
 *
 * // configurable with enhanced type support
 * api.set({ baseURL: 'https://pokeapi.co/api/v2/pokemon' });
 * // ...direct assignment alternative
 * api.baseURL = 'https://pokeapi.co/api/v2/pokemon';
 * // ...per method configuration supported as well
 * api.get.baseURL = 'https://pokeapi.co/api/v2/pokemon';
 *
 * // all options, including those from native fetch-api requests, may still be provided on request
 * const requestConfig = { headers: { accept: 'application/json' }, onError: console.error };
 * const data = await api.get('/pikachu');
 * ```
 */
export interface FetchedApi extends FetchOptions {
  /**
   * Create and initialize a new instance with
   * optionally provided default configuration.
   * - Essentially equivalent to `initapi` named export:
   * ```js
   * // alternative initial usage...
   * import { initapi } from 'fetched-api';
   * const api = initapi({ transform: false });
   * ```
   * @returns the *new* instance
   */
  create(config?: FetchConfig): FetchedApi;
  /**
   * Create and initialize a new instance,
   * merging with any previous configuration.
   * - **non-mutating** version of {@link FetchedApi.use}
   * @returns the *new* instance
   */
  with(config: FetchConfig): FetchedApi;
  /**
   * Set the defaults for the current instance,
   * disregarding any previous configuration.
   * - **mutates** the current instance
   * @returns the *updated* instance
   */
  set(config: FetchConfig): FetchedApi;
  /**
   * Update the defaults for the current instance,
   * merging with any previous configuration.
   * - **mutating** version of {@link FetchedApi.with}
   * @returns the *updated* instance
   */
  use(config: FetchConfig): FetchedApi;
  /**
   * The `HEAD` method asks for a response identical
   * to a `GET` request, but without the response body.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD | MDN Reference}
   */
  head: FetchedMethodWithoutBody;
  /**
   * The `GET` method requests a representation of the specified
   * resource. Requests using `GET` should only retrieve data.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET | MDN Reference}
   */
  get: FetchedMethodWithoutBody<{ responseHasBody: true }>;
  /**
   * The `POST` method submits an entity to the specified resource,
   * often causing a change in state or side effects on the server.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST | MDN Reference}
   */
  post: FetchedMethodWithBody<{ responseHasBody: true }>;
  /**
   * The `PUT` method replaces all current representations
   * of the target resource with the request payload.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT | MDN Reference}
   */
  put: FetchedMethodWithBody;
  /**
   * The `PATCH` method applies partial modifications to a resource.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH | MDN Reference}
   */
  patch: FetchedMethodWithBody;
  /**
   * The `DELETE` method deletes the specified resource.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE | MDN Reference}
   */
  delete: FetchedMethod;
  /**
   * The `TRACE` method performs a message loop-back
   * test along the path to the target resource.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE | MDN Reference}
   */
  trace: FetchedMethod;
  /**
   * The `CONNECT` method establishes a tunnel to
   * the server identified by the target resource.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT | MDN Reference}
   */
  connect: FetchedMethod;
  /**
   * The `OPTIONS` method describes the communication options for the target resource.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS | MDN Reference}
   */
  options: FetchedMethod<{ responseHasBody: true }>;
}

/** Available options configurable per instance, method, or call. */
export interface FetchOptions extends Omit<RequestInit, 'method' | 'body' | 'headers'> {
  /**
   * Transform the default return type for fetch requests to the
   * result of `res.json()` (or `res.text()`) for resolved responses.
   * *While `true`, it may still be possible to access the resolved response with a provided `onres` callback.*
   * @defaultValue `true` for `get`, `post`, and `options` methods.
   */
  transform?: boolean;
  /**
   * Body types supported natively by `fetch` are passed as is.
   * Otherwise the body will be transformed and converted to:
   * - `string`, resulting from converting the body with `JSON.stringify`.
   * - `URLSearchParams`, if the `Content-Type` header is set to `"application/x-www-form-urlencoded"`.
   * - `FormData`, if the `Content-Type` header is set to `"multipart/form-data"`. \
   *   Note: This header will be omitted during the request since it is
   *   {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sect4 | not meant to be set explicitly}.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch#body | Fetch API Body}
   */
  body?: FetchBody;
  /**
   * Base URL to be prefixed to the request input.
   */
  baseURL?: string;
  /**
   * URL search parameters to be suffixed to the request input.
   */
  params?: FetchQuery;
  /**
   * Headers to be merged and constructed into a new `Headers`
   * object, with any previous headers being overwritten using the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Headers/set | `Headers.set`} method.
   * @see {@link RequestInit.headers}
   */
  headers?: FetchHeaders;
  /**
   * Headers to be merged and constructed into a new `Headers`
   * object, with any previous headers being appended to using the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Headers/append | `Headers.append`} method.
   * @see {@link RequestInit.headers}
   */
  appendHeaders?: FetchHeaders;
  /**
   * Define a default callback for resolved requests with sucessful responses (i.e. `res.ok`),
   * which may be used to perform some background task, or handle & intercept the returned response (by
   * returning an object with the provided `symbol`, where the associated value will be returned instead).
   * Asynchronous callbacks that return a `Promise` may be awaited and resolved if the callback is provided
   * under the sub-property `onres.await`.
   */
  // prettier-ignore
  onres?: ((res: Response, req: Requested, id: symbol) => unknown) | { await: (res: Response, req: Requested, id: symbol) => Promise<unknown> };
  /**
   * Define a default callback to handle any errors during
   * the fetch request and non-sucessful responses (i.e. `!res.ok`).
   */
  onError?: (reason: (Response | Requested) & { error: Error }) => any;
}

type Descriptor = { responseHasBody: boolean };

/**
 * Methods that *may* have a body. \
 * i.e. `DELETE` + `TRACE` + `CONNECT` + `OPTIONS`
 */
interface FetchedMethod<T extends Descriptor = { responseHasBody: false }> extends FetchOptions {
  <Data = JsonObject, Transform extends boolean = T['responseHasBody']>(
    input: FetchInput,
    options?: MethodOptions & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
}

/**
 * Methods that *should* have a body. \
 * i.e. `POST` + `PUT` + `PATCH`
 */
interface FetchedMethodWithBody<T extends Descriptor = { responseHasBody: false }> extends FetchOptions {
  <Data = JsonObject, Transform extends boolean = T['responseHasBody']>(
    input: FetchInput,
    body?: FetchBody,
    options?: MethodOptions & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
}

/**
 * Methods that *should never* have a `body` since
 * `fetch` will throw an error anyway if provided. \
 * i.e. `GET` + `HEAD`
 */
interface FetchedMethodWithoutBody<T extends Descriptor = { responseHasBody: false }> extends Omit<FetchOptions, 'body'> {
  <Data = JsonObject, Transform extends boolean = T['responseHasBody']>(
    input: FetchInput,
    options?: Omit<MethodOptions, 'body'> & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
}

interface MethodOptions extends FetchOptions {
  /** May be used as override if using custom non-standard method. */
  method?: Union<HttpMethod>;
}

interface Requested extends RequestInit {
  input: FetchInput;
}

type HttpHeaders = tf.Merge<
  Record<Union<KeyOf<IncomingHttpHeaders>>, string>,
  Record<'accept' | 'content-type', Union<HttpContentType>>
>;

type HttpContentType =
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
