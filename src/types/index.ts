import type { EmptyObject, JsonValue, OmitIndexSignature, PickIndexSignature, Primitive, UnionToIntersection } from 'type-fest';

export interface NonNullish {}
export type JsonObject = { [key in string]?: JsonValue };
export type JsObject<value = unknown> = { [key: string]: value };
export type SetEntry<T> = T extends ReadonlySet<infer Entry> ? Entry : never;
export type Union<T> = IsLiteral<T> extends true ? T | (Narrow<T> & NonNullish) : T;

export type PartialRecord<K, V> = {
  [key in K as K extends PropertyKey ? K : K extends Exclude<Primitive, symbol> ? `${K}` : never]?: V;
};

export type KeyOf<T, Explicit = OmitIndexSignature<Readonly<UnionToIntersection<T>>>, Key = keyof (Explicit extends EmptyObject ? T : Explicit)> = Key extends keyof (IsUnion<T> extends true
  ? Explicit
  : T)
  ? `${Exclude<Key, symbol>}`
  : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type Extends<T1, T2> = [T1] extends [never] ? false : [T2] extends [never] ? false : T1 extends T2 ? true : false;

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
