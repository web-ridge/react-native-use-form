// https://dev.to/tipsy_dev/advanced-typescript-reinventing-lodash-get-4fhe
import type * as React from 'react';
import type { SetStateAction } from 'react';
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import type { TextInput } from 'react-native';
import type { ScrollView, View } from 'react-native';

type GetIndexedField<T, K> = K extends keyof NonNullable<T>
  ? NonNullable<T>[K]
  : K extends `${number}`
  ? '0' extends keyof NonNullable<T>
    ? undefined
    : number extends keyof NonNullable<T>
    ? NonNullable<T>[number]
    : undefined
  : undefined;
type FieldWithPossiblyUndefined<T, Key> =
  | GetFieldType<Exclude<NonNullable<T>, undefined>, Key>
  | Extract<NonNullable<T>, undefined>;
type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<NonNullable<T>, undefined>, Key>
  | Extract<NonNullable<T>, undefined>;
export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof NonNullable<T>
    ? FieldWithPossiblyUndefined<NonNullable<T>[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
    ? FieldKey extends keyof NonNullable<T>
      ? FieldWithPossiblyUndefined<
          IndexedFieldWithPossiblyUndefined<NonNullable<T>[FieldKey], IndexKey>,
          Right
        >
      : undefined
    : undefined
  : P extends keyof T
  ? NonNullable<T>[P]
  : P extends `${infer FieldKey}[${infer IndexKey}]`
  ? FieldKey extends keyof NonNullable<T>
    ? IndexedFieldWithPossiblyUndefined<NonNullable<T>[FieldKey], IndexKey>
    : undefined
  : undefined;

// https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object

export type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
export type DotNestedKeysWithRoot<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]:
          | `${K}${DotPrefix<DotNestedKeysWithRoot<T[K]>>}`
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

export type ScrollViewRefObject = React.RefObject<{
  scrollTo: ScrollView['scrollTo'];
  measure?: View['measure'];
  measureLayout?: View['measureLayout'];
  measureInWindow?: View['measureInWindow'];
}>;
export type ScrollViewRef = ScrollViewRefObject | undefined | null;
export type ReferencedCallback = (
  key: string,
  current: (args: any) => any
) => any;

export type BooleanUtility<T> = {
  [K in keyof T]?: T[K] extends number | string | boolean
    ? boolean
    : BooleanUtility<T[K]>;
};

export type FormOptions<T> = {
  scrollViewRef?: ScrollViewRef;
  locale?: string;
  enhance?: (newValues: T, extra: { previousValues: T }) => T;
  onChange?: (
    newState: T,
    extra: {
      errors: ErrorUtility<T>;
      touched: BooleanUtility<T>;
      focusedOnce: BooleanUtility<T>;
    }
  ) => void;
  onSubmit?: (
    newState: T,
    extra: {
      touched: BooleanUtility<T>;
      focusedOnce: BooleanUtility<T>;
    }
  ) => void;
};

export type FormStateType<T> = {
  wasSubmitted: boolean;
  hasErrors: boolean;
  values: T;
  errors: ErrorUtility<T>;
  touched: BooleanUtility<T>;
  focusedOnce: BooleanUtility<T>;
  setField: <K extends DotNestedKeys<T>>(
    key: K,
    value: GetFieldType<T, K>
  ) => void;
  setTouched: <K extends DotNestedKeys<T>>(key: K, value: boolean) => void;
  // setError: <K extends DotNestedKeys<T>>(
  //   key: K,
  //   value: boolean | string | undefined
  // ) => void;
  // clearErrors: () => void;
  submit: () => void;
  formProps: {
    indexer: IndexerType;
    referencer: ReferencerType;
  };
  setValues: React.Dispatch<SetStateAction<T>>;
  hasError: <K extends DotNestedKeys<T>>(key: K) => boolean;
};

export type FormInputsType<T> = {
  decimalText: FormTextType<T>;
  numberText: FormTextType<T>;
  decimal: FormTextType<T>;
  number: FormTextType<T>;
  text: FormTextType<T>;
  username: FormTextType<T>;
  password: FormTextType<T>;
  email: FormTextType<T>;
  postalCode: FormTextType<T>;
  streetAddress: FormTextType<T>;
  telephone: FormTextType<T>;
  name: FormTextType<T>;
  city: FormTextType<T>;
  raw: FormRawType<T>;
};

export type FormTextInputProps = {
  testID: string;
  value: string;
  onBlur: TextInputProps['onBlur'];
  onLayout: TextInputProps['onLayout'];
  onChangeText: TextInputProps['onChangeText'];
  textContentType?: TextInputProps['textContentType'];
  autoComplete?: TextInputProps['autoComplete'];
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: TextInputProps['secureTextEntry'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: TextInputProps['autoCorrect'];
  selectTextOnFocus?: TextInputProps['selectTextOnFocus'];
  error?: boolean;
  errorMessage?: string | undefined;
  label?: string;
};

export type FormInputBaseProps = {
  testID: string;
  onBlur: TextInputProps['onBlur'];
  onLayout: TextInputProps['onLayout'];
  error: boolean;
  errorMessage: string | undefined;
};

export type FormInputRawProps<V> = {
  value: V;
  onChange: (v: V) => void;
} & FormInputBaseProps;

export interface BaseCustomizing<T, K extends DotNestedKeys<T>> {
  label?: string;
  required?: boolean;
  shouldFollowRegexes?: {
    regex: RegExp;
    errorMessage: string;
  }[];
  minLength?: number;
  maxLength?: number;
  validate?: (v: GetFieldType<T, K>, values: T) => boolean | string | undefined;
  enhanceValues?: (v: GetFieldType<T, K>, values: T) => T;
  enhance?: (v: GetFieldType<T, K>, values: T) => GetFieldType<T, K>;
}
export interface Customizing<T, K extends DotNestedKeys<T>>
  extends BaseCustomizing<T, K> {
  onChangeText?: TextInputProps['onChangeText'];
  onBlur?: TextInputProps['onBlur'];
  onLayout?: TextInputProps['onLayout'];
}

export interface CustomizingRaw<T, K extends DotNestedKeys<T>>
  extends BaseCustomizing<T, K> {
  onChange?: (v: GetFieldType<T, K>) => void;
  onBlur?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}
export type FormRawProps<V> = {
  testID: string;
  value: V;
  onChange: (v: V) => void;
  onBlur: TextInputProps['onBlur'];
  onLayout: TextInputProps['onLayout'];
  error: boolean;
  errorMessage: string | undefined;
};

type FormRawType<T> = <K extends DotNestedKeysWithRoot<T>>(
  key: K,
  //@ts-ignore
  handlers?: CustomizingRaw<T, K>
) => FormRawProps<GetFieldType<T, K>>;

type FormTextType<T> = <K extends DotNestedKeys<T>>(
  key: K,
  handlers?: Customizing<T, K>
) => FormTextInputProps;

export type FieldsLastCharacters<T> = {
  [key in keyof T]?: string | undefined;
};

type ReferencerReturns = TextInputProps & { ref: React.Ref<TextInput> };
export type ReferencerType = (
  key: string,
  formIndex: number
) => ReferencerReturns;

export type IndexerType = {
  add: () => number;
  i: number;
};
