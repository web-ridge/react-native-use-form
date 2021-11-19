import * as React from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  Platform,
} from 'react-native';

import { FormContext, FormContextType } from './FormContext';
import { useLatest, useReferencedCallback } from './utils';
import { deepSet, deepGet } from './objectPath';
import type {
  ErrorUtility,
  DotNestedKeys,
  GetFieldType,
  BooleanUtility,
  DotNestedKeysWithRoot,
} from './types';
import type { SetStateAction } from 'react';

type FormTextInputProps = {
  testID: string;
  value: string;
  onBlur: TextInputProps['onBlur'];
  onLayout: TextInputProps['onLayout'];
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
  testID: string;
  value: V;
  onChange: (v: V) => void;
  onBlur: TextInputProps['onBlur'];
  onLayout: TextInputProps['onLayout'];
};

type Customizing<T, K extends DotNestedKeys<T>> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  validate?: (v: GetFieldType<T, K>, values: T) => boolean | string | undefined;
  enhance?: (v: GetFieldType<T, K>, values: T) => GetFieldType<T, K>;
  onChangeText?: TextInputProps['onChangeText'];
  onBlur?: TextInputProps['onBlur'];
  onLayout?: TextInputProps['onLayout'];
};

type CustomizingRaw<T, K extends DotNestedKeys<T>> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  validate?: (v: GetFieldType<T, K>, values: T) => boolean | string | undefined;
  enhance?: (v: GetFieldType<T, K>, values: T) => GetFieldType<T, K>;
  onChange?: (v: GetFieldType<T, K>) => void;
  onBlur?: TextInputProps['onBlur'];
  onLayout?: TextInputProps['onLayout'];
};

type FormRawType<T> = <K extends DotNestedKeysWithRoot<T>>(
  key: K,
  handlers?: CustomizingRaw<T, K>
) => FormRawProps<GetFieldType<T, K>>;

type FormTextType<T> = <K extends DotNestedKeys<T>>(
  key: K,
  handlers?: Customizing<T, K>
) => FormTextInputProps;

type FieldsLastCharacters<T> = {
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

export function useFormContext(): FormContextType & {
  formIndex: number;
} {
  const px = React.useContext(FormContext);
  const ix = useInnerContext(!!px);
  const ctx = (px || ix)!;
  const idx = React.useRef<number>(px ? px.indexer.add() : ctx.indexer.i);
  return {
    ...ctx,
    formIndex: idx.current,
  };
}

type IndexKeyMap = Record<string, number>;
type RefKeyMap = Record<string, TextInput>;

type FormIndexKeyMap = Record<number, IndexKeyMap>;
export type FormRefKeyMap = Record<number, RefKeyMap>;

export function useInnerContext(skip?: boolean) {
  // const formIndex = React.useRef<number>(0);
  const [lastKey, setLastKey] = React.useState<string | undefined>(undefined);
  const refIndex = React.useRef<number>(0);

  const indexForKey = React.useRef<FormIndexKeyMap>({});
  const refForKey = React.useRef<FormRefKeyMap>({});
  const referencedCallback = useReferencedCallback();

  React.useEffect(() => {
    // we would rather not do this hook at all, but we need to keep amount of hooks the same :)
    if (skip) {
      return;
    }
    const elements = Object.keys(refForKey.current).filter(
      (key, _) => refForKey.current[key as any] !== null
    );
    const lKey = elements[elements.length - 1];

    if (lastKey !== lKey) {
      setLastKey(lKey);
    }
  }, [skip, lastKey, setLastKey, refForKey]);

  // we would rather not do this hook at all, but we need to keep amount of hooks the same :)
  if (skip) {
    return undefined;
  }

  const referencer: ReferencerType = (key, formIndex) => {
    return {
      ref: referencedCallback(`ref.${key}`, (e: TextInput) => {
        if (e === null) {
          return;
        }

        const rk = refForKey.current;
        const ik = indexForKey.current;
        // set default state if undefined
        rk[formIndex] = rk[formIndex] || {};
        ik[formIndex] = ik[formIndex] || {};

        const index = rk[formIndex][key];
        if (index === undefined) {
          refIndex.current = refIndex.current + 1;
          ik[formIndex][key] = refIndex.current;
        }
        rk[formIndex][key] = e;
      }),
      onSubmitEditing:
        lastKey === key
          ? undefined
          : referencedCallback(`focusNext.${key}`, () => {
              const rk = refForKey.current[formIndex] || {};
              const ik = indexForKey.current[formIndex] || {};
              const currentField = rk[key];

              // combine fields of current and next form
              const fields = Object.keys(refForKey.current)
                .map((frmKey) => {
                  const fi = Number(frmKey);
                  const refs = refForKey.current[fi];
                  const ixs = indexForKey.current[fi];
                  return Object.keys(refs)
                    .filter((e) => !!e)
                    .map((k) => ({
                      element: refs[k],
                      index: ixs[k],
                      fi,
                    }))
                    .sort((a, b) => a.fi - b.fi && a.index - b.index);
                })
                .flat();

              const nextField = fields.find((f) => {
                const p = f.element.props;
                // skip disabled fields in focus
                if ((p as any).disabled === true || p.editable === false) {
                  return false;
                }
                // already sorted so the first one to hit above current index is the next field
                return f.index > ik[key];
              });

              nextField?.element?.focus?.();
              currentField.blur();
            }),
      blurOnSubmit: lastKey === key,
      returnKeyType: lastKey === key ? undefined : 'next',
    };
  };

  return { referencer, indexer: indexer(), refForKey };
}

export default function useFormState<T>(
  initialState: T,
  options?: {
    onChange?: (newState: T) => void;
    onSubmit?: (newState: T) => void;
  }
): [
  {
    values: T;
    errors: ErrorUtility<T>;
    touched: BooleanUtility<T>;
    focusedOnce: BooleanUtility<T>;
    setField: <K extends DotNestedKeys<T>>(
      key: K,
      value: GetFieldType<T, K>
    ) => void;
    setTouched: <K extends DotNestedKeys<T>>(key: K, value: boolean) => void;
    setError: <K extends DotNestedKeys<T>>(
      key: K,
      value: boolean | string | undefined
    ) => void;
    clearErrors: () => void;
    submit: () => void;
    formProps: {
      indexer: IndexerType;
      referencer: ReferencerType;
    };
    setValues: React.Dispatch<SetStateAction<T>>;
    hasError: <K extends DotNestedKeys<T>>(key: K) => boolean;
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
  const separationCharacter = React.useMemo(() => {
    const hasIntlSupport = typeof Intl !== undefined;
    if (hasIntlSupport) {
      const formatter = new Intl.NumberFormat();
      const formatted = formatter.format(1.1);
      return formatted === '1,10' ? ',' : '.';
    }
    console.warn(
      '[react-native-use-form] please upgrade React Native to provide Intl support'
    );
    return '.';
  }, []);

  const referencedCallback = useReferencedCallback();
  const ctx = useFormContext();
  const [wasSubmitted, setWasSubmitted] = React.useState<boolean>(false);
  const [touched, sTouched] = React.useState<BooleanUtility<T>>({});
  const [focusedOnce, sFocusedOnce] = React.useState<BooleanUtility<T>>({});
  const [errors, sErrors] = React.useState<ErrorUtility<T>>({});
  const [values, setValues] = React.useState<T>(initialState);
  const [lastCharacters, setLastCharacters] = React.useState<
    FieldsLastCharacters<T>
  >({});

  const valuesRef = useLatest(values);
  const errorsRef = useLatest(errors);

  const setError = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: boolean | string | undefined) => {
      const error = deepGet(errorsRef.current, k);
      if (v !== error) {
        sErrors((prev) => deepSet(prev, k, v) as any);
      }
    },
    [errorsRef, sErrors]
  );

  const clearErrors = React.useCallback(() => {
    sErrors({});
  }, []);

  const checkError = React.useCallback(
    <K extends DotNestedKeys<T>>(
      k: K,
      h: Customizing<T, K> | CustomizingRaw<T, K> | undefined,
      v: GetFieldType<T, K>,
      allV: T
    ) => {
      let err: boolean | string | undefined;

      if (h) {
        // TODO: add locale support
        if (h?.required === true && !v) {
          err = `${k} is required`;
        } else if (h.minLength !== undefined && `${v}`.length < h.minLength) {
          err = `${k} length should be longer than ${h.minLength}`;
        } else if (h.maxLength !== undefined && `${v}`.length > h.maxLength) {
          err = `${k} length should be less than ${h.maxLength}`;
        } else if (h.validate) {
          err = h.validate?.(v, allV);
        }
      }
      setError(
        k,
        err === true || err === undefined || err === null ? false : err
      );
    },
    [setError]
  );

  const changeValue = <K extends DotNestedKeys<T>>(
    k: K,
    v: GetFieldType<T, K>,
    h: Customizing<T, K> | CustomizingRaw<T, K> | undefined
  ) => {
    let enhancedV = h?.enhance ? h?.enhance(v, valuesRef.current) : v;
    const newValues = deepSet(valuesRef.current, k, enhancedV) as T;

    (h as Customizing<T, K>)?.onChangeText?.(enhancedV as any);
    (h as CustomizingRaw<T, K>)?.onChange?.(enhancedV as any);

    setValues(newValues);
    checkError(k, h, enhancedV, valuesRef.current);
    setTouched(k, true);
    // prevent endless re-render if called on nested form
    // TODO: not needed anymore probably test it out
    setTimeout(() => {
      options?.onChange?.(newValues);
    }, 0);
  };

  const onSubmitRef = useLatest(options?.onSubmit);

  const submit = React.useCallback(() => {
    setWasSubmitted(true);
    // if it returns an object there are errors
    const errorCount = Object.keys(errorsRef.current)
      .map((key) => !!errorsRef.current[key as DotNestedKeys<T>])
      .filter((n) => n).length;
    if (errorCount > 0) {
      return;
    }

    onSubmitRef?.current?.(valuesRef.current);
  }, [errorsRef, valuesRef, onSubmitRef]);

  const blur = <K extends DotNestedKeys<T>>(
    k: K,
    h: Customizing<T, K> | undefined
  ): TextInputProps['onBlur'] =>
    referencedCallback(
      `blur.${k}`,
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        h?.onBlur?.(e);
        setFocusedOnce(k, true);
      }
    );

  const layout = <K extends DotNestedKeys<T>>(
    k: K,
    h: Customizing<T, K> | undefined
  ): TextInputProps['onLayout'] =>
    referencedCallback(`layout.${k}`, (e: LayoutChangeEvent) => {
      h?.onLayout?.(e);
      const value = deepGet(valuesRef.current, k);
      checkError(k as DotNestedKeys<T>, h, value as any, valuesRef.current);
    });

  const text = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...ctx.referencer(k, ctx.formIndex),
    testID: k,
    onChangeText: referencedCallback(`text.${k}`, (n: GetFieldType<T, K>) =>
      changeValue(k, n, h)
    ),
    onLayout: layout(k, h),
    onBlur: blur(k, h),
    value: deepGet(values, k),
  });

  const numberRaw = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => {
    const value = `${deepGet(values, k) || ''}`.replace(
      '.',
      separationCharacter
    );

    return {
      ...ctx.referencer(k, ctx.formIndex),
      testID: k,
      onChangeText: referencedCallback(`number.${k}`, (n: string) => {
        // support numbers like 0,02
        const { lastPart, hasLastPart, firstPart } = splitNumberStringInParts(
          n
        );

        if (hasLastPart) {
          setLastCharacters((prev) => deepSet(prev, k, lastPart) as any);
        } else {
          setLastCharacters((prev) => deepSet(prev, k, undefined) as any);
        }

        if (n === '') {
          changeValue(k, null as any, h);
        } else {
          const numberValue = Number(firstPart.replace(',', '.'));
          changeValue(k, numberValue as any, h);
        }
      }),
      onBlur: blur(k, h),
      onLayout: layout(k, h),
      value: `${value || ''}${deepGet(lastCharacters, k) || ''}`,
    };
  };

  const number = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...numberRaw(k, h),
    keyboardType: 'number-pad',
  });

  const decimal = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...numberRaw(k, h),
    keyboardType: 'decimal-pad',
  });

  const numberText = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    keyboardType: 'number-pad',
  });

  const decimalText = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    keyboardType: 'decimal-pad',
  });

  const postalCode = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'characters',
    textContentType: 'postalCode',
    autoCompleteType: 'postal-code',
    autoCorrect: false,
  });

  const streetAddress = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoCompleteType: 'street-address',
    autoCorrect: false,
  });

  const city = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    textContentType: 'addressCity',
    autoCorrect: false,
  });

  const telephone = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'telephoneNumber',
    autoCompleteType: 'tel',
    keyboardType: 'phone-pad',
    autoCorrect: false,
  });

  const name = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoCompleteType: 'name',
    autoCorrect: false,
  });

  const username = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'username',
    autoCompleteType: 'username',
    autoCapitalize: 'none',
    autoCorrect: false,
    selectTextOnFocus: Platform.OS !== 'web',
  });

  const password = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'password',
    autoCompleteType: 'password',
    secureTextEntry: true,
    autoCorrect: false,
    selectTextOnFocus: Platform.OS !== 'web',
  });

  const email = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'emailAddress',
    autoCompleteType: 'email',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoCorrect: false,
  });

  const raw = <K extends DotNestedKeys<T>>(
    k: K,
    h?: CustomizingRaw<T, K>
  ): FormRawProps<GetFieldType<T, K>> => ({
    testID: k,
    onChange: referencedCallback(`raw.${k}`, (n: GetFieldType<T, K>) => {
      setTouched(k, true);
      setFocusedOnce(k, true);
      changeValue(k, n, h);
    }),
    value: deepGet(values, k),
    onLayout: layout(k, h as any),
    onBlur: blur(k, h as any),
  });

  const setField = <K extends DotNestedKeys<T>>(
    k: K,
    v: GetFieldType<T, K>
  ) => {
    if (v !== deepGet(values, k)) {
      changeValue(k, v, undefined);
    }
  };

  const setTouched = <K extends DotNestedKeys<T>>(k: K, v: boolean) => {
    if (v !== deepGet(touched, k)) {
      sTouched((p) => deepSet(p, k, v) as any);
    }
  };

  const setFocusedOnce = <K extends DotNestedKeys<T>>(k: K, v: boolean) => {
    if (v !== deepGet(focusedOnce, k)) {
      sFocusedOnce((p) => deepSet(p, k, v) as any);
    }
  };

  const hasError = <K extends DotNestedKeys<T>>(k: K): boolean => {
    const isTouched = deepGet(touched, k);
    const isFocusedOnce = deepGet(focusedOnce, k);
    const error = deepGet(errors, k);
    if ((isTouched && isFocusedOnce) || wasSubmitted) {
      const noError = error === false || errors === undefined;
      return !noError;
    }
    return false;
  };

  return [
    {
      values,
      errors,
      touched,
      focusedOnce,
      setField,
      setError,
      setTouched,
      submit,
      formProps: { referencer: ctx.referencer, indexer: ctx.indexer },
      hasError,
      clearErrors,
      setValues,
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

function countZeroAtEndOfString(str: string) {
  let count = 0;
  const reversed = reverse(str);
  for (let character of reversed) {
    if (character !== '0') {
      return count;
    } else {
      count++;
    }
  }
  return count;
}

function splitNumberStringInParts(str: string) {
  const lastCommaIndex = str.lastIndexOf(',');
  const lastDotIndex = str.lastIndexOf('.');

  const endsWithComma = str.endsWith(',');
  const endsWithDot = str.endsWith('.');
  const zeroAtEndOfString = countZeroAtEndOfString(str);
  const endsWithZero = zeroAtEndOfString > 0;

  const maxCommaOrDotIndex = Math.max(lastCommaIndex, lastDotIndex);

  if (
    endsWithComma ||
    endsWithDot ||
    (maxCommaOrDotIndex > 0 && zeroAtEndOfString > 0)
  ) {
    const zeroSliceIndex = str.length - zeroAtEndOfString;
    let sliceIndex = endsWithZero ? zeroSliceIndex : maxCommaOrDotIndex;

    // 1,10
    if (zeroSliceIndex - 1 === maxCommaOrDotIndex) {
      sliceIndex = maxCommaOrDotIndex;
    }

    return {
      firstPart: str.slice(0, sliceIndex),
      lastPart: str.slice(sliceIndex, str.length),
      hasLastPart: true,
    };
  }

  return {
    firstPart: str,
    lastPart: '',
    hasLastPart: false,
  };
}

function reverse(str: string) {
  let reversed = '';
  for (let character of str) {
    reversed = character + reversed;
  }
  return reversed;
}
