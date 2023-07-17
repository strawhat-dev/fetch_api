/// <reference types="node" />

import type { IncomingHttpHeaders } from 'http';

export default api;
export declare const initapi: (defaults?: FetchInit) => FetchedApi;

declare const api: FetchedApi;
export declare type FetchInput = RequestInfo | URL;
export declare type FetchRequest = Merge<RequestInit, { input: FetchInput }>;
export declare type FetchConfig = Merge<Omit<RequestInit, 'method'>, ApiOptions>;
export declare type FetchHeaders = Headers | Partial<HttpHeaders> | Entries<HttpHeaders>;
export declare type FetchInit = Merge<FetchConfig, PartialRecord<HttpMethod, FetchConfig>>;
export declare interface FetchedApi extends Merge<FetchConfig, ApiDispatch & RequestDispatch> {}
export declare type FetchBody = Type<
  BodyInit | Jsonifiable | Set<Jsonifiable> | Map<JsonPrimitive, Jsonifiable>
>;

declare interface ApiOptions {
  transform?: boolean;
  baseURL?: string;
  body?: FetchBody;
  query?: JsonObject;
  headers?: FetchHeaders;
  appendHeaders?: FetchHeaders;
  onres?: FetchResponseHandler | { await: FetchResponseHandler };
  onError?: (req: { error?: Error } & FetchRequest) => any;
}

declare interface ApiDispatch {
  /**
   * Create and initialize a new instance.
   * @returns the **new** instance.
   */
  create(config?: FetchInit): FetchedApi;
  /**
   * Configure and update the current instance.
   * @returns the current **mutated** instance.
   */
  configure(config: FetchInit): FetchedApi;
  /**
   * Create a new instance based off of the current one while
   * optionally providing a new config object to merge with.
   * @returns the **new** instance with *inherited* defaults.
   */
  with(config?: FetchInit): FetchedApi;
  /**
   * Sets the defaults for the current instance.
   * @returns the current **mutated** instance.
   */
  set(config: FetchInit): FetchedApi;
}

declare interface RequestDispatch {
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

declare type Type<T> = T;
declare type ArrayEntries<BaseType extends readonly unknown[]> = Array<ArrayEntry<BaseType>>;
declare type ArrayEntry<BaseType extends readonly unknown[]> = [number, BaseType[number]];
declare type EmptyObject = { [emptyObjectSymbol]?: never };
declare const emptyObjectSymbol: unique symbol;
declare type EnforceOptional<T> = Simplify<
  { [Key in keyof T as RequiredFilter<T, Key>]: T[Key] } & {
    [Key in keyof T as OptionalFilter<T, Key>]?: Exclude<T[Key], undefined>;
  }
>;

declare type Entries<BaseType> = Type<
  BaseType extends Map<unknown, unknown>
    ? MapEntries<BaseType>
    : BaseType extends Set<unknown>
    ? SetEntries<BaseType>
    : BaseType extends readonly unknown[]
    ? ArrayEntries<BaseType>
    : BaseType extends object
    ? ObjectEntries<BaseType>
    : never
>;

declare type Extends<T1, T2> = [T1] extends [never]
  ? false
  : [T2] extends [never]
  ? false
  : T1 extends T2
  ? true
  : false;

declare type FetchMethod = {
  <Data = JsonObject, Transform extends boolean = true>(
    input: FetchInput,
    options?: FetchOptions & { transform?: Transform },
  ): Promise<Transform extends false ? Response : Data>;
} & FetchConfig;

declare type FetchMethodWithBody = {
  <Data = JsonObject, Transform extends boolean = true>(
    input: FetchInput,
    body: FetchBody,
    options?: Omit<FetchOptions, 'body'> & { transform?: Transform },
  ): Promise<Transform extends false ? Response : Data>;
} & FetchConfig;

declare type FetchOptions = FetchConfig & { method?: Union<HttpMethod> };
declare type FetchResponseHandler = (res: Response, req: FetchRequest) => unknown;
declare type HttpHeaders = Merge<
  Record<Union<KeyOf<IncomingHttpHeaders>>, string>,
  Record<'accept' | 'content-type', Union<ContentMimeType>>
>;

declare type Primitive = null | undefined | string | number | boolean | symbol | bigint;
declare type JsonArray = JsonValue[] | readonly JsonValue[];
declare type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray;
declare type JsonifiableArray = readonly Jsonifiable[];
declare type JsonifiableObject = { [Key in string]?: Jsonifiable } | { toJSON: () => Jsonifiable };
declare type JsonPrimitive = string | number | boolean | null;
declare type JsonValue = JsonPrimitive | JsonObject | JsonArray;
declare type JsonObject = { [key in string]?: JsonValue };
declare type JsObject<value = unknown> = { [key: string]: value };
declare type MapEntries<BaseType> = Array<MapEntry<BaseType>>;
declare type MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
declare type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
declare type MapValue<BaseType> = BaseType extends Map<unknown, infer ValueType>
  ? ValueType
  : never;

declare type KeyOf<
  T,
  Explicit = OmitIndexSignature<Readonly<UnionToIntersection<T>>>,
  Key = keyof (Explicit extends EmptyObject ? T : Explicit),
> = Key extends keyof (IsUnion<T> extends true ? Explicit : T) ? `${Exclude<Key, symbol>}` : never;

declare type Merge<T1, T2> = EnforceOptional<
  SimpleMerge<PickIndexSignature<T1>, PickIndexSignature<T2>> &
    SimpleMerge<OmitIndexSignature<T1>, OmitIndexSignature<T2>>
>;

declare type IsLiteral<T> = Type<
  string extends T
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
    : Extends<T, Primitive>
>;

declare type Narrow<T> = Type<
  T extends string
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
    : {}
>;

declare interface NonNullish {}
declare type ObjectEntry<T> = [keyof T, T[keyof T]];
declare type ObjectEntries<T> = Array<ObjectEntry<T>>;
declare type OmitIndexSignature<T> = {
  [Key in keyof T as {} extends Record<Key, unknown> ? never : Key]: T[Key];
};

declare type OptionalFilter<T, Key extends keyof T> = Type<
  undefined extends T[Key] ? (T[Key] extends undefined ? never : Key) : never
>;

declare type PartialRecord<K, V> = {
  [key in K as K extends PropertyKey
    ? K
    : K extends Exclude<Primitive, symbol>
    ? `${K}`
    : never]?: V;
};

declare type PickIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? KeyType
    : never]: ObjectType[KeyType];
};

declare type RequiredFilter<T, Key extends keyof T> = Type<
  undefined extends T[Key] ? (T[Key] extends undefined ? Key : never) : Key
>;

declare type SetEntries<BaseType extends Set<unknown>> = Array<SetEntry<BaseType>>;
declare type SetEntry<BaseType> = Type<
  BaseType extends Set<infer ItemType> ? [ItemType, ItemType] : never
>;

declare type SimpleMerge<T1, T2> = {
  [Key in keyof T1 as Key extends keyof T2 ? never : Key]: T1[Key];
} & T2;

declare type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
declare type Union<T> = IsLiteral<T> extends true ? T | (Narrow<T> & NonNullish) : T;
declare type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
declare type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

declare type HttpMethod =
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
declare type ContentMimeType =
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
