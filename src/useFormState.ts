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
import useRefState from './useRefState';
import { defaultLocale, getTranslation } from './translations/utils';

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
  error?: boolean;
  errorMessage?: string | undefined;
  label?: string;
};

type FormRawProps<V> = {
  testID: string;
  value: V;
  onChange: (v: V) => void;
  onBlur: TextInputProps['onBlur'];
  onLayout: TextInputProps['onLayout'];
  error: boolean;
  errorMessage: string | undefined;
};

interface BaseCustomizing<T, K extends DotNestedKeys<T>> {
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
interface Customizing<T, K extends DotNestedKeys<T>>
  extends BaseCustomizing<T, K> {
  onChangeText?: TextInputProps['onChangeText'];
  onBlur?: TextInputProps['onBlur'];
  onLayout?: TextInputProps['onLayout'];
}

interface CustomizingRaw<T, K extends DotNestedKeys<T>>
  extends BaseCustomizing<T, K> {
  onChange?: (v: GetFieldType<T, K>) => void;
  onBlur?: TextInputProps['onBlur'];
  onLayout?: TextInputProps['onLayout'];
}

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
  const [lastKey, setLastKey] = useRefState<string | undefined>(undefined);
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
    setLastKey(lKey);
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
        lastKey.current === key
          ? undefined
          : // TODO: handle submit on last onSubmitEditing
            // referencedCallback(`submitEditing.${key}`, () => {
            //   submit();
            // })
            // TODO: blurOrSubmit on last field?
            referencedCallback(`focusNext.${key}`, () => {
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
                const p = f?.element?.props;
                // TODO: fix this with function components
                // skip disabled fields in focus
                if ((p as any)?.disabled === true || p?.editable === false) {
                  return false;
                }
                // already sorted so the first one to hit above current index is the next field
                return f.index > ik[key];
              });

              nextField?.element?.focus?.();
              currentField.blur();
            }),
      blurOnSubmit: lastKey.current === key,
      returnKeyType: lastKey.current === key ? undefined : 'next',
    };
  };

  return { referencer, indexer: indexer(), refForKey };
}

export default function useFormState<T>(
  initialState: T,
  options?: {
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
  }
): [
  {
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
  const locale = options?.locale || defaultLocale;
  const onChange = useLatest(options?.onChange);
  const onSubmit = useLatest(options?.onSubmit);
  const enhance = useLatest(options?.enhance);
  const separationCharacter = React.useMemo(() => {
    const hasIntlSupport = typeof Intl !== undefined;
    if (hasIntlSupport) {
      const formatter = new Intl.NumberFormat();
      const formatted = formatter.format(1.1);
      return formatted.includes(',') ? ',' : '.';
    }
    console.warn(
      '[react-native-use-form] please upgrade React Native to provide Intl support to detect separation character'
    );
    return '.';
  }, []);

  const referencedCallback = useReferencedCallback();
  const ctx = useFormContext();
  const [wasSubmitted, setWasSubmitted] = useRefState<boolean>(false);
  const [touched, sTouched] = useRefState<BooleanUtility<T>>({});
  const [focusedOnce, sFocusedOnce] = useRefState<BooleanUtility<T>>({});
  const initialErrorCache = React.useRef<ErrorUtility<T>>({});
  const [errors, sErrors] = useRefState<ErrorUtility<T>>({});
  const [values, setValues] = useRefState<T>(initialState);
  const [lastCharacters, setLastCharacters] = useRefState<
    FieldsLastCharacters<T>
  >({});

  React.useEffect(() => {
    // render optimization because we don't want to re-render on every field at the beginning of the onLayout calls :)
    const timer = setTimeout(() => {
      sErrors(initialErrorCache.current);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [initialErrorCache, sErrors]);

  const setError = React.useCallback(
    <K extends DotNestedKeys<T>>(
      k: K,
      v: boolean | string | undefined,
      initial?: boolean
    ) => {
      const error = deepGet(errors.current, k);
      if (v !== error) {
        if (initial) {
          initialErrorCache.current = deepSet(
            initialErrorCache.current || {},
            k,
            v
          ) as any;
        } else {
          sErrors((prev) => deepSet(prev, k, v) as any);
        }
      }
    },
    [errors, sErrors, initialErrorCache]
  );

  const clearErrors = React.useCallback(() => {
    sErrors({});
  }, [sErrors]);

  const checkError = React.useCallback(
    <K extends DotNestedKeys<T>>(
      k: K,
      h: Customizing<T, K> | CustomizingRaw<T, K> | undefined,
      v: GetFieldType<T, K>,
      allV: T,
      initial?: boolean
    ) => {
      let err: boolean | string | undefined;

      if (h) {
        if (h?.required === true && !v) {
          err = getTranslation(
            locale,
            'required'
          )({
            fieldKey: k,
            label: h?.label,
          });
        } else if (h.minLength !== undefined && `${v}`.length < h.minLength) {
          err = getTranslation(
            locale,
            'lengtShouldBeLongerThan'
          )({
            fieldKey: k,
            label: h?.label,
            requiredLength: h.minLength,
          });
        } else if (h.maxLength !== undefined && `${v}`.length > h.maxLength) {
          err = getTranslation(
            locale,
            'lengthShouldBeShorterThan'
          )({
            fieldKey: k,
            label: h?.label,
            requiredLength: h.maxLength,
          });
        } else if (h.shouldFollowRegexes) {
          for (let { regex, errorMessage } of h.shouldFollowRegexes) {
            if (!regex.test(`${v}`)) {
              err = getTranslation(
                locale,
                'shouldFollowRegex'
              )({
                fieldKey: k,
                label: h?.label,
                errorMessage,
              });
              break;
            }
          }
        } else if (h.validate) {
          err = h.validate?.(v, allV);
        }
      }
      setError(
        k,
        err === true || err === undefined || err === null ? false : err,
        initial
      );
    },
    [locale, setError]
  );

  const setTouched = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: boolean) => {
      sTouched((p) => deepSet(p, k, v) as any);
    },
    [sTouched]
  );

  const changeValue = React.useCallback(
    <K extends DotNestedKeys<T>>(
      k: K,
      v: GetFieldType<T, K>,
      h: Customizing<T, K> | CustomizingRaw<T, K> | undefined
    ) => {
      // set enhanced value or normal value
      let enhancedV = h?.enhance?.(v, values.current) || v;
      const newValues = deepSet(
        // let enhance function edit form-state of fallback on normal values
        h?.enhanceValues?.(enhancedV, values.current) || values.current,
        k,
        enhancedV
      ) as T;
      const enhancedNewValues = enhance.current
        ? enhance.current(newValues, { previousValues: values.current })
        : newValues;

      (h as Customizing<T, K>)?.onChangeText?.(enhancedV as any);
      (h as CustomizingRaw<T, K>)?.onChange?.(enhancedV as any);

      setValues(enhancedNewValues);
      checkError(k, h, enhancedV!, enhancedNewValues);
      setTouched(k, true);

      onChange.current?.(enhancedNewValues, {
        touched: touched.current,
        focusedOnce: focusedOnce.current,
        errors: errors.current,
      });
    },
    [
      checkError,
      enhance,
      errors,
      focusedOnce,
      onChange,
      setTouched,
      setValues,
      touched,
      values,
    ]
  );

  const submit = React.useCallback(() => {
    setWasSubmitted(true);
    // if it returns an object there are errors
    if (checkErrorObject(errors.current)) {
      return;
    }

    onSubmit.current?.(values.current, {
      touched: touched.current,
      focusedOnce: focusedOnce.current,
    });
  }, [setWasSubmitted, errors, onSubmit, values, touched, focusedOnce]);

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
      const value = deepGet(values.current, k);
      checkError(k as DotNestedKeys<T>, h, value as any, values.current, true);
    });

  const text = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps =>
    removeEmpty({
      ...ctx.referencer(k, ctx.formIndex),
      testID: k,
      onChangeText: referencedCallback(`text.${k}`, (n: GetFieldType<T, K>) =>
        changeValue(k, n, h)
      ),
      onLayout: layout(k, h),
      onBlur: blur(k, h),
      value: deepGet(values.current, k) || '',
      error: hasError(k),
      errorMessage: deepGet(errors.current, k),
      label: h?.label,
    });

  const numberRaw = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => {
    const deepValue = deepGet(values.current, k) as number;
    const value = `${isEmptyNumber(deepValue) ? '' : deepValue}`.replace(
      '.',
      separationCharacter
    );

    return removeEmpty({
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
      value: `${value || ''}${deepGet(lastCharacters.current, k) || ''}`,

      error: hasError(k),
      errorMessage: deepGet(errors.current, k),
      label: h?.label,
    });
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
    label: h?.label,
    errorMessage: deepGet(errors.current, k),
    error: hasError(k),
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

  const setField = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: GetFieldType<T, K>) => {
      changeValue(k, v, undefined);
    },
    [changeValue]
  );

  const setFocusedOnce = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: boolean) => {
      sFocusedOnce((p) => deepSet(p, k, v) as any);
    },
    [sFocusedOnce]
  );

  const hasError = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K): boolean => {
      const isTouched = deepGet(touched.current, k);
      const isFocusedOnce = deepGet(focusedOnce.current, k);
      const error = deepGet(errors.current, k);
      if ((isTouched && isFocusedOnce) || wasSubmitted.current) {
        const noError = error === false || errors.current === undefined;
        return !noError;
      }
      return false;
    },
    [errors, focusedOnce, touched, wasSubmitted]
  );

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
    value: deepGet(values.current, k),
    onLayout: layout(k, h as any),
    onBlur: blur(k, h as any),
    error: hasError(k),
    errorMessage: deepGet(errors.current, k),
  });

  return [
    {
      hasErrors: checkErrorObject(errors.current),
      values: values.current,
      errors: errors.current,
      touched: touched.current,
      focusedOnce: focusedOnce.current,
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

function isEmptyNumber(str: number) {
  return !str && str !== 0;
}

function checkErrorObject(errors: any) {
  const keys = Object.keys(errors);
  for (let key of keys) {
    if (isObject(errors[key])) {
      if (checkErrorObject(errors[key])) {
        return true;
      }
    } else {
      if (!!errors[key]) {
        return true;
      }
    }
  }
  return false;
}

function isObject<T>(val: T) {
  if (val === null) {
    return false;
  }
  return typeof val === 'function' || typeof val === 'object';
}
function removeEmpty<T>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as any;
}
