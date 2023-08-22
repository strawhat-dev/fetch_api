/// <reference types="node" />

import type { IncomingHttpHeaders } from 'node:http';
import type { EmptyObject, Entries, JsonPrimitive, JsonValue, Jsonifiable, Merge, OmitIndexSignature, PickIndexSignature, Primitive, UnionToIntersection } from 'type-fest';

/** Deep clone most standard objects. Does not handle non-enumerable properties or circular references. */
export declare const clone: <T>(target: T) => T;

declare const _default: FetchedApi;
export default _default;

declare type Descriptor = { responseHasBody: boolean };

declare type Extends<T1, T2> = [T1] extends [never] ? false : [T2] extends [never] ? false : T1 extends T2 ? true : false;

export declare type FetchBody = BodyInit | Jsonifiable | Set<Jsonifiable> | Map<JsonPrimitive, Jsonifiable>;

declare type FetchConfig = FetchOptions & { [method in HttpMethod]?: Merge<FetchedApi[method], {}> };

export declare interface FetchedApi extends FetchOptions {
  /**
   * Create and initialize a new instance.
   *
   * @returns The **new** instance.
   */
  create(config?: FetchConfig): FetchedApi;
  /**
   * Create a new instance with the provided defaults while inheriting from any previous configuration.
   *
   * @returns The **new** instance.
   */
  with(config?: FetchConfig): FetchedApi;
  /**
   * Set the defaults for the current instance, disregarding any previous configuration.
   *
   * @returns The current **mutated** instance.
   */
  set(config: FetchConfig): FetchedApi;
  /**
   * Update the defaults for the current instance while merging with any previous configuration.
   *
   * @returns The current **mutated** instance.
   */
  use(config: FetchConfig): FetchedApi;
  /**
   * The `HEAD` method asks for a response identical to a `GET` request, but without the response body.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD | MDN Reference}
   */
  head: FetchedMethodWithoutBody;
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
}

/**
 * Methods that _may_ have a body.\
 * I.e. `DELETE` + `TRACE` + `CONNECT` + `OPTIONS`
 */
declare interface FetchedMethod<T extends Descriptor = { responseHasBody: false }> extends FetchOptions {
  <Data = JsonObject, Transform extends boolean = T['responseHasBody']>(input: FetchInput, options?: MethodOptions & { transform?: Transform }): Promise<
    (Transform extends false ? Response : Data) & { error?: Error }
  >;
}

/**
 * Methods that _should_ have a body.\
 * I.e. `POST` + `PUT` + `PATCH`
 */
declare interface FetchedMethodWithBody<T extends Descriptor = { responseHasBody: false }> extends FetchOptions {
  <Data = JsonObject, Transform extends boolean = T['responseHasBody']>(input: FetchInput, body?: FetchBody, options?: MethodOptions & { transform?: Transform }): Promise<
    (Transform extends false ? Response : Data) & { error?: Error }
  >;
}

/**
 * Methods that _should never_ have a `body` since `fetch` will throw an error anyway if provided.\
 * I.e. `GET` + `HEAD`
 */
declare interface FetchedMethodWithoutBody<T extends Descriptor = { responseHasBody: false }> extends Omit<FetchOptions, 'body'> {
  <Data = JsonObject, Transform extends boolean = T['responseHasBody']>(input: FetchInput, options?: Omit<MethodOptions, 'body'> & { transform?: Transform }): Promise<
    (Transform extends false ? Response : Data) & { error?: Error }
  >;
}

export declare type FetchHeaders = Partial<HttpHeaders> | Entries<HttpHeaders> | object;

export declare type FetchInput = RequestInfo | URL;

export declare interface FetchOptions extends Omit<RequestInit, 'method' | 'body' | 'headers'> {
  /**
   * Transform the default return type for fetch requests to the result of `res.json()` (or `res.text()`) for resolved responses. _While `true`, it may still be possible to access the resolved
   * response with a provided `onres` callback._
   *
   * @defaultValue `true` for `get`, `post`, and `options` methods.
   */
  transform?: boolean;
  /**
   * Body types supported natively by `fetch` are passed as is. Otherwise the body will be transformed and converted to:
   *
   * - `string`, resulting from converting the body with `JSON.stringify`.
   * - `URLSearchParams`, if the `Content-Type` header is set to `"application/x-www-form-urlencoded"`.
   * - `FormData`, if the `Content-Type` header is set to `"multipart/form-data"`.\
   *   Note: This header will be omitted during the request since it is {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sect4 | not meant to be set explicitly}.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch#body | Fetch API Body}
   */
  body?: FetchBody;
  /** Base URL to be prefixed to the request input. */
  baseURL?: string;
  /** URL search parameters to be suffixed to the request input. */
  query?: FetchQuery;
  /**
   * Headers to be merged and constructed into a new `Headers` object, with any previous headers being overwritten using the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Headers/set | `Headers.set`} method.
   *
   * @see {@link RequestInit.headers}
   */
  headers?: FetchHeaders;
  /**
   * Headers to be merged and constructed into a new `Headers` object, with any previous headers being appended to using the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Headers/append | `Headers.append`} method.
   *
   * @see {@link RequestInit.headers}
   */
  appendHeaders?: FetchHeaders;
  /**
   * Define a default callback for resolved requests with sucessful responses (i.e. `res.ok`), which may be used to perform some background task (if callback is `void`/`async`) or intercept the
   * returned response (if anything other than `undefined` is returned).\
   * _Asynchronous callbacks that return a `Promise` may be awaited and resolved if the callback is provided under the sub-property `onres.await` instead._
   */
  onres?: ((res: Response, req: Requested) => unknown) | { await: (res: Response, req: Requested) => Promise<unknown> };
  /** Define a default callback to handle any errors during the fetch request and non-sucessful responses (i.e. `!res.ok`). */
  onError?: (reason: (Response | Requested) & { error: Error }) => any;
}

export declare type FetchQuery = JsObject<JsonPrimitive> | ConstructorParameters<typeof URLSearchParams>[0];

declare const HTTP_METHODS: Set<'get' | 'post' | 'put' | 'patch' | 'delete' | 'trace' | 'connect' | 'options' | 'head'>;

declare type HttpContentType =
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

declare type HttpHeaders = Merge<Record<Union<KeyOf<IncomingHttpHeaders>>, string>, Record<'accept' | 'content-type', Union<HttpContentType>>>;

declare type HttpMethod = SetEntry<typeof HTTP_METHODS>;

export declare const initapi: FetchedApi['create'];

declare type IsLiteral<T> = string extends T
  ? false
  : number extends T
  ? false
  : boolean extends T
  ? false
  : object extends T
  ? false
  : Function extends T
  ? false
  : [T] extends [never]
  ? false
  : T extends readonly (infer Item)[]
  ? IsLiteral<Item>
  : T extends JsObject
  ? Extends<PickIndexSignature<T>, EmptyObject>
  : Extends<T, Primitive>;

declare type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

declare type JsObject<value = unknown> = {
  [key: string]: value;
};

declare type JsonObject = {
  [key in string]?: JsonValue;
};

declare type KeyOf<T, Explicit = OmitIndexSignature<Readonly<UnionToIntersection<T>>>, Key = keyof (Explicit extends EmptyObject ? T : Explicit)> = Key extends keyof (IsUnion<T> extends true
  ? Explicit
  : T)
  ? `${Exclude<Key, symbol>}`
  : never;

declare interface MethodOptions extends FetchOptions {
  /** May be used as override if using custom non-standard method. */
  method?: Union<HttpMethod>;
}

declare type Narrow<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends undefined
  ? undefined
  : T extends null
  ? null
  : T extends readonly (infer Item)[]
  ? Narrow<Item>[]
  : T extends ReadonlySet<infer Item>
  ? Set<Narrow<Item>>
  : T extends ReadonlyMap<infer K, infer V>
  ? Map<Narrow<K>, Narrow<V>>
  : T extends Promise<infer Resolved>
  ? Promise<Narrow<Resolved>>
  : T extends JsObject<infer Values>
  ? JsObject<Narrow<Values>>
  : T extends object
  ? object
  : {};

declare interface NonNullish {}

declare interface Requested extends RequestInit {
  input: FetchInput;
}

declare type SetEntry<T> = T extends ReadonlySet<infer Entry> ? Entry : never;

declare type Union<T> = IsLiteral<T> extends true ? T | (Narrow<T> & NonNullish) : T;

export {};
