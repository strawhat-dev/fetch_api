import type {
  EmptyObject,
  Entries,
  JsonPrimitive,
  JsonValue,
  Jsonifiable,
  OmitIndexSignature,
  PickIndexSignature,
  Primitive,
  Simplify,
  UnionToIntersection,
} from 'type-fest';

export type { Entries, JsonPrimitive, Jsonifiable, Primitive };

export interface NonNullish {}
export type Maybe<T> = T | undefined;
export type JsonObject = { [key in string]?: JsonValue };
export type JsObject<value = unknown> = { [key: string]: value };
export type Union<T> = IsLiteral<T> extends true ? T | (Narrow<T> & NonNullish) : T;

export type Merge<T1, T2> = EnforceOptional<
  SimpleMerge<PickIndexSignature<T1>, PickIndexSignature<T2>> &
    SimpleMerge<OmitIndexSignature<T1>, OmitIndexSignature<T2>>
>;

export type PartialRecord<K, V> = {
  [key in K as K extends PropertyKey
    ? K
    : K extends Exclude<Primitive, symbol>
    ? `${K}`
    : never]?: V;
};

export type KeyOf<
  T,
  Explicit = OmitIndexSignature<Readonly<UnionToIntersection<T>>>,
  Key = keyof (Explicit extends EmptyObject ? T : Explicit),
> = Key extends keyof (IsUnion<T> extends true ? Explicit : T) ? `${Exclude<Key, symbol>}` : never;

type Type<T> = T;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type SimpleMerge<T1, T2> = {
  [Key in keyof T1 as Key extends keyof T2 ? never : Key]: T1[Key];
} & T2;

type EnforceOptional<T> = Simplify<
  { [Key in keyof T as RequiredFilter<T, Key>]: T[Key] } & {
    [Key in keyof T as OptionalFilter<T, Key>]?: Exclude<T[Key], undefined>;
  }
>;

type RequiredFilter<T, Key extends keyof T> = Type<
  undefined extends T[Key] ? (T[Key] extends undefined ? Key : never) : Key
>;

type OptionalFilter<T, Key extends keyof T> = Type<
  undefined extends T[Key] ? (T[Key] extends undefined ? never : Key) : never
>;

export type Extends<T1, T2> = Type<
  [T1] extends [never] ? false : [T2] extends [never] ? false : T1 extends T2 ? true : false
>;

type Narrow<T> = Type<
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

type IsLiteral<T> = Type<
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
