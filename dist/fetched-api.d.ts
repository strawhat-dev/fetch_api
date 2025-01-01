import type * as tf from 'type-fest';
import type { IncomingHttpHeaders } from 'http';
import type { Spreadable } from 'type-fest/source/spread';

export {};
export const clone: <T>(src: T) => T;
export const jsonify: (x: any) => string | null;
export const initapi: FetchedApi['create'];
declare const api: FetchedApi;
export default api;

/**
 * Simple and lightweight configurable request client with cross-support for both browsers and node.js _(versions >=18)_, providing many axios-like conveniences such as automatic transforms and an alternative intuitive api, all while using `fetch-api` natively without any other external dependencies.
 *
 * ```js
 * import api from 'fetched-api';
 *
 * // configurable with enhanced type support
 * api.set({ baseURL: 'https://pokeapi.co/api/v2/pokemon' });
 * // ...direct assignment alternative
 * api.baseURL = 'https://pokeapi.co/api/v2/pokemon';
 * // ...per method configuration alternative
 * api.get.baseURL = 'https://pokeapi.co/api/v2/pokemon';
 * // ...per method options on request
 * await api.get('/pikachu', { headers: { accept: 'application/json' }, onError: console.error });
 * ```
 */
export interface FetchedApi extends FetchOptions {
  /**
   * Create and initialize a new instance with optionally provided default configuration.
   *
   * - Essentially equivalent to `initapi` named export:
   *
   * ```js
   * // alternative initial usage...
   * import { initapi } from 'fetched-api';
   * const api = initapi({ transform: false });
   * ```
   *
   * @returns The _new_ instance
   */
  create(config?: FetchConfig): FetchedApi;
  /**
   * Create and initialize a new instance, merging with any previous configuration.
   *
   * - **non-mutating** version of {@link FetchedApi.use}
   *
   * @returns The _new_ instance
   */
  with(config: FetchConfig): FetchedApi;
  /**
   * Set the defaults for the current instance, disregarding any previous configuration.
   *
   * - **mutates** the current instance
   *
   * @returns The _updated_ instance
   */
  set(config: FetchConfig): FetchedApi;
  /**
   * Update the defaults for the current instance, merging with any previous configuration.
   *
   * - **mutating** version of {@link FetchedApi.with}
   *
   * @returns The _updated_ instance
   */
  use(config: FetchConfig): FetchedApi;
  /**
   * Generic method and wrapper for fetch requests.
   */
  fetch(req: FetchMethodOptions): Promise<Response & { error?: Error }>;
  /**
   * The `GET` method requests a representation of the specified resource. Requests using `GET` should only retrieve data.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET | MDN Reference}
   */
  get: FetchedMethodWithoutBody<{ responseHasBody: true }>;
  /**
   * The `POST` method submits an entity to the specified resource, often causing a change in state or side effects on the server.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST | MDN Reference}
   */
  post: FetchedMethodWithBody<{ responseHasBody: true }>;
  /**
   * The `PUT` method replaces all current representations of the target resource with the request payload.
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
   * The `TRACE` method performs a message loop-back test along the path to the target resource.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE | MDN Reference}
   */
  trace: FetchedMethod;
  /**
   * The `CONNECT` method establishes a tunnel to the server identified by the target resource.
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
  /**
   * The `HEAD` method asks for a response identical to a `GET` request, but without the response body.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD | MDN Reference}
   */
  head: FetchedMethodWithoutBody;
}

/** Available options configurable per instance, method, or call. */
export interface FetchOptions extends Omit<RequestInit, 'method' | 'body' | 'headers'> {
  /**
   * Automatically transform the default return type for fetched requests using `res.json()` _(or `res.text()`)_ for resolved responses.\
   * _While `true`, the resolved response may still be accessed using a provided `onres` callback._
   *
   * @defaultValue `true` for `get`, `post`, and `options` methods.
   */
  transform?: boolean;
  /**
   * Body types supported natively by `fetch` are passed as is; otherwise the body will be transformed and converted to:
   * - `string`, resulting from `JSON.stringify`
   * - `URLSearchParams`, if `"Content-Type"` header is set to `"application/x-www-form-urlencoded"`
   * - `FormData`, if `"Content-Type"` header is set to `"multipart/form-data"`
   *   - Note: This header will be omitted during the request since it is {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sect4 | not meant to be set explicitly}.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch#body | Fetch API Body}
   */
  body?: FetchBody;
  /**
   * Base URL to be _prefixed_ to the request input.
   */
  baseURL?: string;
  /**
   * URL search parameters to be _suffixed_ to the request input.
   */
  params?: FetchParams;
  /**
   * Headers to be merged and constructed into a new `Headers` object, with any previous headers being _overwritten_ using the {@link https://developer.mozilla.org/en-US/docs/Web/API/Headers/set | `Headers.set`} method.
   *
   * @see {@link RequestInit.headers}
   */
  headers?: FetchHeaders;
  /**
   * Headers to be merged and constructed into a new `Headers` object, with any previous headers being _appended_ to using the {@link https://developer.mozilla.org/en-US/docs/Web/API/Headers/append | `Headers.append`} method.
   *
   * @see {@link RequestInit.headers}
   */
  appendHeaders?: FetchHeaders;
  /**
   * Define a default callback for requests _before_ they are executed.
   */
  onreq?: (req: Requested) => any;
  /**
   * - Define a default callback for resolved requests with sucessful responses, which may be used to perform some background task,
   * or handle & intercept the returned response (by returning a _non-`undefined`_ value, where the resolved value will be returned instead).
   * - Asynchronous callbacks that return a `Promise` may be awaited and resolved if the callback is provided under the sub-property `onres.await`.
   */
  onres?: ((req: Requested, res: Response) => any) | { await: (req: Requested, res: Response) => Promise<any> };
  /**
   * Define a default callback to handle any errors or non-sucessful responses.
   */
  onError?: (reason: (Response | Requested) & { error: Error }) => any;
}

export type FetchInput = RequestInfo | URL;
export type FetchHeaders = Partial<HttpHeaders> | tf.Entries<HttpHeaders> | object;
export type FetchParams = string | [string, string][] | JsObject<tf.JsonPrimitive> | URLSearchParams;
export type FetchBody = BodyInit | tf.Jsonifiable | Set<tf.Jsonifiable> | Map<tf.JsonPrimitive, tf.Jsonifiable>;
type FetchConfig = FetchOptions & { [method in HttpMethod]?: tf.Merge<FetchedApi[method], {}> };
type Descriptor = { responseHasBody: boolean };

/**
 * Methods that _may_ have a body.\
 * i.e. `DELETE` + `TRACE` + `CONNECT` + `OPTIONS`
 */
interface FetchedMethod<T extends Descriptor = { responseHasBody: false }> extends FetchOptions {
  <Data = Any, Transform extends boolean = T['responseHasBody']>(
    options: FetchOptions & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
  <Data = Any, Transform extends boolean = T['responseHasBody']>(
    input: FetchInput,
    options?: FetchOptions & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
}

/**
 * Methods that _should_ have a body.\
 * i.e. `POST` + `PUT` + `PATCH`
 */
interface FetchedMethodWithBody<T extends Descriptor = { responseHasBody: false }> extends FetchOptions {
  <Data = Any, Transform extends boolean = T['responseHasBody']>(
    options: FetchOptions & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
  <Data = Any, Transform extends boolean = T['responseHasBody']>(
    body: FetchBody,
    options?: Omit<FetchOptions, 'body'> & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
  <Data = Any, Transform extends boolean = T['responseHasBody']>(
    input: FetchInput,
    body?: FetchBody,
    options?: Omit<FetchOptions, 'body'> & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
}

/**
 * Methods that _should never_ have a `body` since `fetch` will throw an error anyway if provided.\
 * i.e. `GET` + `HEAD`
 */
interface FetchedMethodWithoutBody<T extends Descriptor = { responseHasBody: false }>
  extends Omit<FetchOptions, 'body'>
{
  <Data = Any, Transform extends boolean = T['responseHasBody']>(
    options: Omit<FetchOptions, 'body'> & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
  <Data = Any, Transform extends boolean = T['responseHasBody']>(
    input: FetchInput,
    options?: Omit<FetchOptions, 'body'> & { transform?: Transform },
  ): Promise<(Transform extends false ? Response : Data) & { error?: Error }>;
}

interface FetchMethodOptions extends Omit<FetchOptions, 'transform' | 'baseURL'> {
  url?: string | URL;
  method?: Union<HttpMethod>;
}

interface Requested extends RequestInit {
  input: FetchInput;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'trace' | 'connect' | 'options' | 'head';

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

interface Any {}
type Value = Primitive | object;
type Fn<T = any> = (...args: any[]) => T;
type Primitive = Exclude<tf.Primitive, symbol>;
type Composite<T> = tf.Simplify<tf.OmitIndexSignature<tf.UnionToIntersection<Spread<T>>>>;
type JsObject<T extends Value = any> = { [key in Exclude<PropertyKey, symbol> as `${key}`]: T };
type Extends<T1, T2> = [T1] extends [never] ? false : [T2] extends [never] ? false : T1 extends T2 ? true : false;
type Spread<T1, T2 = T1> = T1 extends Spreadable ? (T2 extends Spreadable ? tf.Spread<T1, T2> : T1 & T2) : T1 & T2;

type KeyOf<T, K = keyof (Composite<T> extends tf.EmptyObject ? T : Composite<T>)> = Exclude<
  K extends keyof T ? (`${Exclude<K, symbol>}` extends keyof T ? `${Exclude<K, symbol>}` : never) :
    (`${Exclude<keyof T, symbol>}` extends keyof T ? `${Exclude<keyof T, symbol>}` : never),
  number
>;

type Union<T> = [T] extends [never] ? never :
  T extends never[] ? any[] :
  T extends tf.EmptyObject ? JsObject :
  IsLiteral<T> extends true ? T extends Primitive ? T | (Narrow<T> & Any) : T & JsObject :
  T;

type IsLiteral<T> = [T] extends [never] ? false :
  boolean extends T ? false :
  bigint extends T ? false :
  number extends T ? false :
  string extends T ? false :
  object extends T ? false :
  T extends readonly (infer Item)[] ? IsLiteral<Item> :
  T extends JsObject ? Extends<tf.PickIndexSignature<T>, tf.EmptyObject> :
  Fn extends T ? false :
  Extends<T, tf.Primitive>;

type Narrow<T> = T extends readonly (infer Item)[] ? Narrow<Item>[] :
  T extends (...args: readonly any[]) => infer Return ? Fn<Narrow<Return>> :
  T extends ReadonlyMap<infer K, infer V> ? Map<Narrow<K>, Narrow<V>> :
  T extends Promise<infer Resolved> ? Promise<Narrow<Resolved>> :
  T extends JsObject<infer Values> ? JsObject<Narrow<Values>> :
  T extends ReadonlySet<infer Item> ? Set<Narrow<Item>> :
  T extends undefined ? undefined :
  T extends boolean ? boolean :
  T extends bigint ? bigint :
  T extends number ? number :
  T extends string ? string :
  T extends object ? object :
  T extends null ? null :
  Any;
