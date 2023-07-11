/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Spreadable } from 'type-fest/source/spread.js';
import type {
  ConditionalExcept,
  ConditionalKeys,
  EmptyObject,
  OmitIndexSignature,
  PickIndexSignature,
  Primitive,
  Spread as DefaultSpread,
  UnionToIntersection,
} from 'type-fest';

export interface NonNullish {}
export type Nullish = null | undefined;
export type NullishOrFalse = null | undefined | false;
export type Maybe<T> = T | undefined;
export type Nullable<T> = T | null;
export type Multi<T> = T | T[];
export type Numeric = number | bigint;
export type NumberLike = number | `${number}`;
export type Value = Primitive | object;
export type JsObject<value = Value> = { [key: string]: value };
export type AsyncFunction = (...args: any[]) => Promise<any>;
export type Fn<
  T extends { args?: readonly Value[]; returns?: Value } = { args: any[]; returns: any },
> = (
  ...args: T['args'] extends any[] ? T['args'] : any[]
) => T extends { returns: infer R } ? R : void;

export type KeyOf<
  T,
  Explicit = OmitIndexSignature<Readonly<UnionToIntersection<T>>>,
  Key = keyof (Explicit extends EmptyObject ? T : Explicit),
> = Key extends keyof (IsUnion<T> extends true ? Explicit : T) ? `${Exclude<Key, symbol>}` : never;

export type KeyOfDeep<
  T,
  current = OmitIndexSignature<Readonly<T>>,
  nested extends keyof current = ConditionalKeys<current, JsObject<any>>,
> = KeyOf<current> | (nested extends never ? never : KeyOfDeep<current[nested]>);

export type ValueOf<T, Key = KeyOf<T>> = Key extends keyof T ? T[Key] : {};

export type ValueOfDeep<
  T,
  current = OmitIndexSignature<Readonly<T>>,
  nested extends keyof current = ConditionalKeys<current, JsObject<any>>,
> =
  | current[KeysExcept<current, JsObject<any>>]
  | (nested extends never ? never : ValueOfDeep<current[nested]>);

export type KeysExcept<T, ExcludedTypes> = keyof ConditionalExcept<T, ExcludedTypes>;

export type Union<T> = IsLiteral<T> extends true ? T | (Narrow<T> & NonNullish) : T;

export type Spread<
  T1,
  T2,
  Fallback extends Spreadable = EmptyOf<T1> extends Spreadable
    ? EmptyOf<T1>
    : EmptyOf<T2> extends Spreadable
    ? EmptyOf<T2>
    : {},
> = DefaultSpread<T1 extends Spreadable ? T1 : Fallback, T2 extends Spreadable ? T2 : Fallback>;

export type Narrow<T> = T extends string
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

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type IsLiteral<T> = string extends T
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

export type Extends<T1, T2> = [T1] extends [never]
  ? false
  : [T2] extends [never]
  ? false
  : T1 extends T2
  ? true
  : false;

export type SimplifyDeep<T> = T extends Function | Iterable<unknown>
  ? T
  : T extends object
  ? { [key in keyof T]: SimplifyDeep<T[key]> }
  : T;

export type EmptyOf<T> = T extends string
  ? ''
  : T extends number
  ? 0
  : T extends readonly any[]
  ? []
  : {};

export type HTMLTag = keyof HTMLElementTagNameMap;

export type HTMLElementProps<T extends HTMLTag = 'div'> = ConditionalExcept<
  HTMLElementTagNameMap[T],
  Function
>;
