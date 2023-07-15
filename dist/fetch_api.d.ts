export declare const api: FetchApi;
export declare const initapi: (config?: FetchInit) => FetchApi;

export type FetchApi = Merge<FetchConfig, ApiDispatch & RequestDispatch>;
export type FetchInit = Merge<FetchConfig, PartialRecord<HttpMethod, FetchConfig>>;
export type FetchRequest = Merge<RequestInit, { input: FetchInput }>;
export type FetchInput = RequestInfo | URL;

export type FetchHeaders = Merge<
  Record<KeyOf<IncomingHttpHeaders>, string>,
  Record<'accept' | 'content-type', Union<MimeType>>
>;

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

interface ApiDispatch {
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

interface RequestDispatch {
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

type FetchedData = JsonValue;

type FetchMethod = {
  <T = FetchedData, Transform extends boolean = true>(
    input: FetchInput,
    options?: FetchConfig & { transform?: Transform },
  ): Promise<Transform extends false ? Response : T>;
} & FetchConfig;

type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'connect'
  | 'options'
  | 'trace';

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

interface NonNullish {}
type Value = Primitive | object;
type JsObject<value = Value> = { [key: string]: value };
type PartialRecord<K, V> = {
  [key in K as K extends PropertyKey
    ? K
    : K extends Exclude<Primitive, symbol>
    ? `${K}`
    : never]?: V;
};
type KeyOf<
  T,
  Explicit = OmitIndexSignature<Readonly<UnionToIntersection<T>>>,
  Key = keyof (Explicit extends EmptyObject ? T : Explicit),
> = Key extends keyof (IsUnion<T> extends true ? Explicit : T) ? `${Exclude<Key, symbol>}` : never;
type Union<T> = IsLiteral<T> extends true ? T | (Narrow<T> & NonNullish) : T;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type Extends<T1, T2> = [T1] extends [never]
  ? false
  : [T2] extends [never]
  ? false
  : T1 extends T2
  ? true
  : false;
type Narrow<T> = T extends string
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
type IsLiteral<T> = string extends T
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

type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type JsonObject = { [Key in string]: JsonValue } & { [Key in string]?: JsonValue | undefined };
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
declare const emptyObjectSymbol: unique symbol;
type EmptyObject = { [emptyObjectSymbol]?: never };
type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
type OmitIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? never
    : KeyType]: ObjectType[KeyType];
};
type PickIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? KeyType
    : never]: ObjectType[KeyType];
};
type RequiredFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
  ? Type[Key] extends undefined
    ? Key
    : never
  : Key;
type OptionalFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
  ? Type[Key] extends undefined
    ? never
    : Key
  : never;
type EnforceOptional<ObjectType> = Simplify<
  {
    [Key in keyof ObjectType as RequiredFilter<ObjectType, Key>]: ObjectType[Key];
  } & {
    [Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<
      ObjectType[Key],
      undefined
    >;
  }
>;
type SimpleMerge<Destination, Source> = {
  [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;
type Merge<Destination, Source> = EnforceOptional<
  SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> &
    SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;
type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;
type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
type MapValue<BaseType> = BaseType extends Map<unknown, infer ValueType> ? ValueType : never;
type ArrayEntry<BaseType extends readonly unknown[]> = [number, BaseType[number]];
type MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]];
type SetEntry<BaseType> = BaseType extends Set<infer ItemType> ? [ItemType, ItemType] : never;
type ArrayEntries<BaseType extends readonly unknown[]> = Array<ArrayEntry<BaseType>>;
type MapEntries<BaseType> = Array<MapEntry<BaseType>>;
type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>;
type SetEntries<BaseType extends Set<unknown>> = Array<SetEntry<BaseType>>;
type Entries<BaseType> = BaseType extends Map<unknown, unknown>
  ? MapEntries<BaseType>
  : BaseType extends Set<unknown>
  ? SetEntries<BaseType>
  : BaseType extends readonly unknown[]
  ? ArrayEntries<BaseType>
  : BaseType extends object
  ? ObjectEntries<BaseType>
  : never;

interface IncomingHttpHeaders {
  accept?: string | undefined;
  'accept-language'?: string | undefined;
  'accept-patch'?: string | undefined;
  'accept-ranges'?: string | undefined;
  'access-control-allow-credentials'?: string | undefined;
  'access-control-allow-headers'?: string | undefined;
  'access-control-allow-methods'?: string | undefined;
  'access-control-allow-origin'?: string | undefined;
  'access-control-expose-headers'?: string | undefined;
  'access-control-max-age'?: string | undefined;
  'access-control-request-headers'?: string | undefined;
  'access-control-request-method'?: string | undefined;
  age?: string | undefined;
  allow?: string | undefined;
  'alt-svc'?: string | undefined;
  authorization?: string | undefined;
  'cache-control'?: string | undefined;
  connection?: string | undefined;
  'content-disposition'?: string | undefined;
  'content-encoding'?: string | undefined;
  'content-language'?: string | undefined;
  'content-length'?: string | undefined;
  'content-location'?: string | undefined;
  'content-range'?: string | undefined;
  'content-type'?: string | undefined;
  cookie?: string | undefined;
  date?: string | undefined;
  etag?: string | undefined;
  expect?: string | undefined;
  expires?: string | undefined;
  forwarded?: string | undefined;
  from?: string | undefined;
  host?: string | undefined;
  'if-match'?: string | undefined;
  'if-modified-since'?: string | undefined;
  'if-none-match'?: string | undefined;
  'if-unmodified-since'?: string | undefined;
  'last-modified'?: string | undefined;
  location?: string | undefined;
  origin?: string | undefined;
  pragma?: string | undefined;
  'proxy-authenticate'?: string | undefined;
  'proxy-authorization'?: string | undefined;
  'public-key-pins'?: string | undefined;
  range?: string | undefined;
  referer?: string | undefined;
  'retry-after'?: string | undefined;
  'sec-websocket-accept'?: string | undefined;
  'sec-websocket-extensions'?: string | undefined;
  'sec-websocket-key'?: string | undefined;
  'sec-websocket-protocol'?: string | undefined;
  'sec-websocket-version'?: string | undefined;
  'set-cookie'?: string[] | undefined;
  'strict-transport-security'?: string | undefined;
  tk?: string | undefined;
  trailer?: string | undefined;
  'transfer-encoding'?: string | undefined;
  upgrade?: string | undefined;
  'user-agent'?: string | undefined;
  vary?: string | undefined;
  via?: string | undefined;
  warning?: string | undefined;
  'www-authenticate'?: string | undefined;
}
