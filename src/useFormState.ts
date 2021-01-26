import * as React from 'react';
import type {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';

import { useFormContext } from './FormContext';
import { useReferencedCallback } from './utils';

type FormTextInputProps = {
  value: string;
  onBlur: TextInputProps['onBlur'];
  onChangeText: TextInputProps['onChangeText'];
  textContentType?: TextInputProps['textContentType'];
  autoCompleteType?: TextInputProps['autoCompleteType'];
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: TextInputProps['secureTextEntry'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: TextInputProps['autoCorrect'];
  selectTextOnFocus?: TextInputProps['selectTextOnFocus'];
};

type FormRawProps<V> = {
  value: V;
  onChange: (v: V) => void;
};

type Customizing<T, Key extends keyof T> = {
  validate?: (v: T[Key], values: T) => boolean | string | undefined;
  onChangeText?: TextInputProps['onChangeText'];
  onBlur?: TextInputProps['onBlur'];
};

type CustomizingRaw<V, T> = {
  validate?: (v: V, values: T) => void;
};

type FormRawType<T> = <K extends keyof T>(
  key: K,
  handlers?: CustomizingRaw<T[K], T>
) => FormRawProps<T[K]>;

type FormTextType<T> = (
  key: keyof T,
  handlers?: Customizing<T, keyof T>
) => FormTextInputProps;

type FieldsBoolean<T> = {
  [key in keyof T]?: boolean;
};
type FieldsError<T> = {
  [key in keyof T]?: boolean | string | undefined;
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

// we need something to keep track of nested forms
export function indexer(): IndexerType {
  let i: number = 0;
  function add() {
    i++;
    return i;
  }
  return {
    add,
    i,
  };
}

export default function useFormState<T>(
  initialState: T,
  options?: {
    onChange: (newState: T) => void;
  }
): [
  {
    values: T;
    errors: FieldsError<T>;
    touched: FieldsBoolean<T>;
    setField: <K extends keyof T>(key: K, value: T[K]) => void;
    setTouched: <K extends keyof T>(key: K, value: boolean) => void;
    setError: <K extends keyof T>(
      key: K,
      value: boolean | string | undefined
    ) => void;
    formProps: {
      indexer: IndexerType;
      referencer: ReferencerType;
    };
    validate: () => boolean;
  },
  {
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
  }
] {
  const referencedCallback = useReferencedCallback();
  const ctx = useFormContext();
  const [touched, sTouched] = React.useState<FieldsBoolean<T>>({});
  const [errors, sErrors] = React.useState<FieldsError<T>>({});
  const [values, setValues] = React.useState<T>(initialState);

  const c = options?.onChange;

  const changeValue = React.useCallback(
    <K extends keyof T>(
      key: K,
      value: T[K],
      handlers: Customizing<T, keyof T> | undefined
    ) => {
      handlers?.onChangeText?.((value as any) as string);
      setValues((prev) => {
        const newValue = {
          ...prev,
          [key]: value,
        };

        // prevent endless re-render if called on nested form
        setTimeout(() => {
          c && c(newValue);
        }, 0);

        return newValue;
      });
    },
    [setValues, c]
  );

  const validate = () => {
    // has error = false by default
    // let he = false;

    // TODO: check all keys
    return false;
  };

  const blur = <K extends keyof T>(
    k: K,
    h: Customizing<T, keyof T> | undefined
  ): TextInputProps['onBlur'] =>
    referencedCallback(
      `blur.${k}`,
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        h?.onBlur?.(e);
        // TODO: closure?
        const err = h?.validate?.(values[k], values);
        setError(k, err);
        setTouched(k, true);
      }
    );

  const text = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...ctx.referencer(k as any, ctx.formIndex),
    onChangeText: referencedCallback(`text.${k}`, (n: T[K]) =>
      changeValue(k, n, h)
    ),
    onBlur: blur(k, h),
    value: (values?.[k] || '') as string,
  });

  const numberRaw = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...ctx.referencer(k as any, ctx.formIndex),
    onChangeText: referencedCallback(`number.${k}`, (n: string) => {
      if (n !== '') {
        changeValue(k, Number(n) as any, h);
      }
    }),
    onBlur: blur(k, h),
    value: `${(values?.[k] || '') as string}`,
  });

  const number = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...numberRaw(k, h),
    keyboardType: 'number-pad',
  });

  const decimal = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...numberRaw(k, h),
    keyboardType: 'decimal-pad',
  });

  const numberText = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    keyboardType: 'number-pad',
  });

  const decimalText = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    keyboardType: 'decimal-pad',
  });

  const postalCode = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'characters',
    textContentType: 'postalCode',
    autoCompleteType: 'postal-code',
    autoCorrect: false,
  });

  const streetAddress = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoCompleteType: 'street-address',
    autoCorrect: false,
  });

  const city = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    textContentType: 'addressCity',
    autoCorrect: false,
  });

  const telephone = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'telephoneNumber',
    autoCompleteType: 'tel',
    keyboardType: 'phone-pad',
    autoCorrect: false,
  });

  const name = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoCompleteType: 'name',
    autoCorrect: false,
  });

  const username = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'username',
    autoCompleteType: 'username',
    autoCapitalize: 'none',
    autoCorrect: false,
    selectTextOnFocus: true,
  });

  const password = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'password',
    autoCompleteType: 'password',
    secureTextEntry: true,
    autoCorrect: false,
    selectTextOnFocus: true,
  });

  const email = <K extends keyof T>(
    k: K,
    h?: Customizing<T, keyof T>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'emailAddress',
    autoCompleteType: 'email',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoCorrect: false,
  });

  const raw = <K extends keyof T>(
    k: K,
    h?: CustomizingRaw<T[K], T>
  ): FormRawProps<T[K]> => ({
    onChange: referencedCallback(`raw.${k}`, (n: T[K]) => {
      setTouched(k, true);
      changeValue(k, n, h as any);
    }),
    value: values?.[k] as T[K],
  });

  const setField = <K extends keyof T>(k: K, v: T[K]) => {
    if (v !== values[k]) {
      changeValue(k, v, undefined);
    }
  };

  const setError = <K extends keyof T>(
    k: K,
    v: boolean | string | undefined
  ) => {
    if (v !== errors[k]) {
      sErrors((prev) => ({
        ...prev,
        [k]: v,
      }));
    }
  };

  const setTouched = <K extends keyof T>(k: K, v: boolean) => {
    if (v !== touched[k]) {
      sTouched((p) => ({
        ...p,
        [k]: v,
      }));
    }
  };

  return [
    {
      values,
      errors,
      touched,
      setField,
      setError,
      setTouched,
      validate,
      formProps: { referencer: ctx.referencer, indexer: ctx.indexer },
    },
    {
      text,
      username,
      number,
      decimal,
      numberText,
      decimalText,
      password,
      email,
      raw,
      postalCode,
      streetAddress,
      name,
      telephone,
      city,
    },
  ];
}
