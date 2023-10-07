import type * as tf from 'type-fest';
import type { Spreadable } from 'type-fest/source/spread';

export type primitive = tf.Primitive;
export type value = primitive | object;
export type Maybe<T> = T | undefined;
export type Fn<T = any> = (...args: any[]) => T;
export type SetEntry<T> = T extends ReadonlySet<infer Entry> ? Entry : never;
export type Composite<T> = tf.OmitIndexSignature<tf.UnionToIntersection<Spread<T>>>;
export type JsObject<T extends value = any> = { [key in Exclude<PropertyKey, symbol> as `${key}`]: T };
export type JsonObject = { [key in string]?: tf.JsonValue };
export type KeyOf<T, resolved = keyof (Composite<T> extends tf.EmptyObject ? T : Composite<T>)> = resolved extends keyof T ? (`${Exclude<resolved, symbol>}` extends keyof T ? `${Exclude<resolved, symbol>}` : never) : `${Exclude<keyof T, symbol>}`;
export type ValueOf<T extends object, source = Composite<T>> = source[keyof source];
export type Union<T> = [T] extends [never] ? unknown : T extends never[] ? any[] : T extends tf.EmptyObject ? JsObject : IsLiteral<T> extends true ? (T | (Narrow<T> & _)) : T;
export type Spread<T1, T2 = T1> = T1 extends Spreadable ? tf.Spread<T1, T2 extends Spreadable ? T2 : _> : _;

interface _ {}

type Extends<T1, T2> = [T1] extends [never] ? false :
  [T2] extends [never] ? false :
  T1 extends T2 ? true :
  false;

type Narrow<T> = T extends readonly (infer Item)[] ? Narrow<Item>[] :
  T extends (..._: readonly any[]) => infer Return ? Fn<Narrow<Return>> :
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
  _;

type IsLiteral<T> = [T] extends [never] ? false :
  boolean extends T ? false :
  bigint extends T ? false :
  number extends T ? false :
  string extends T ? false :
  object extends T ? false :
  T extends readonly (infer Item)[] ? IsLiteral<Item> :
  T extends JsObject ? Extends<tf.PickIndexSignature<T>, tf.EmptyObject> :
  Function extends T ? false :
  Extends<T, primitive>;
