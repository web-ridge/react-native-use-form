// https://dev.to/tipsy_dev/advanced-typescript-reinventing-lodash-get-4fhe
type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
  ? '0' extends keyof T
    ? undefined
    : number extends keyof T
    ? T[number]
    : undefined
  : undefined;
type FieldWithPossiblyUndefined<T, Key> =
  | GetFieldType<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;
type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;
export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? FieldWithPossiblyUndefined<T[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
    ? FieldKey extends keyof T
      ? FieldWithPossiblyUndefined<
          IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
          Right
        >
      : undefined
    : undefined
  : P extends keyof T
  ? T[P]
  : P extends `${infer FieldKey}[${infer IndexKey}]`
  ? FieldKey extends keyof T
    ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
    : undefined
  : undefined;

// https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object

export type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
// export type DotNestedKeysAndRoot<T> = (
//   T extends object
//     ? {
//         [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<
//           DotNestedKeys<T[K]>
//         >}`;
//       }[Exclude<keyof T, symbol>]
//     : ''
// ) extends infer D
//   ? Extract<D, string>
//   : never;

export type DotNestedKeysWithRoot<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]:
          | `${K}${DotPrefix<DotNestedKeys<T[K]>>}`
          | `${K}`;
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;

export type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<
          DotNestedKeys<T[K]>
        >}`;
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;

export type ErrorUtility<T> = {
  [K in keyof T]?: T[K] extends number | string | boolean
    ? boolean | string | undefined
    : ErrorUtility<T[K]>;
};

export type TouchedUtility<T> = {
  [K in keyof T]?: T[K] extends number | string | boolean
    ? boolean
    : ErrorUtility<T[K]>;
};
