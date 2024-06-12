import type * as tf from 'type-fest';
import type { Spreadable } from 'type-fest/source/spread';

export type Fn<T = any> = (...args: any[]) => T;

export type Primitive = Exclude<tf.Primitive, symbol>;

export type JsonObject = { [key in string]: tf.JsonValue };

export type Composite<T> = tf.Simplify<tf.OmitIndexSignature<tf.UnionToIntersection<Spread<T>>>>;

export type JsObject<T extends Value = any> = {
  [key in Exclude<PropertyKey, symbol> as `${key}`]: T;
};

export type KeyOf<T, K = keyof (Composite<T> extends tf.EmptyObject ? T : Composite<T>)> = Exclude<
  K extends keyof T ? (`${Exclude<K, symbol>}` extends keyof T ? `${Exclude<K, symbol>}` : never) :
    (`${Exclude<keyof T, symbol>}` extends keyof T ? `${Exclude<keyof T, symbol>}` : never),
  number
>;

export type Union<T> = [T] extends [never] ? unknown :
  T extends never[] ? any[] :
  T extends tf.EmptyObject ? JsObject :
  IsLiteral<T> extends true ? T extends Primitive ? T | (Narrow<T> & Any) : T & JsObject :
  T;

interface Any {}

type Value = Primitive | object;

type Spread<T1, T2 = T1> = T1 extends Spreadable ? T2 extends Spreadable ? tf.Spread<T1, T2> : T1 & T2 : T1 & T2;

type Extends<T1, T2> = [T1] extends [never] ? false : [T2] extends [never] ? false : T1 extends T2 ? true : false;

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

type IsLiteral<T> = [T] extends [never] ? false :
  boolean extends T ? false :
  bigint extends T ? false :
  number extends T ? false :
  string extends T ? false :
  object extends T ? false :
  T extends readonly (infer Item)[] ? IsLiteral<Item> :
  T extends JsObject ? Extends<tf.PickIndexSignature<T>, tf.EmptyObject> :
  Function extends T ? false :
  Extends<T, tf.Primitive>;
