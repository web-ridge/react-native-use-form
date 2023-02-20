import * as React from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  Platform,
  ScrollView,
  LayoutRectangle,
  View,
} from 'react-native';

import {
  checkErrorObject,
  isEmptyNumber,
  removeEmpty,
  useLatest,
  useReferencedCallback,
} from './utils';
import { deepSet, deepGet } from './objectPath';
import type {
  ErrorUtility,
  DotNestedKeys,
  GetFieldType,
  BooleanUtility,
  FormStateType,
  FormInputsType,
  FieldsLastCharacters,
  CustomizingRaw,
  Customizing,
  FormTextInputProps,
} from './types';
import useRefState from './useRefState';
import { defaultLocale } from './translations/utils';
import useCheckError from './useCheckError';
import { useFormContext } from './useFormContext';
import useErrors from './useErrors';

export default function useFormState<T>(
  initialState: T,
  options?: {
    scrollViewRef?:
      | React.RefObject<{
          scrollTo: ScrollView['scrollTo'];
          measure?: View['measure'];
          measureLayout?: View['measureLayout'];
          measureInWindow?: View['measureInWindow'];
        }>
      | undefined
      | null;
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
): [formState: FormStateType<T>, inputs: FormInputsType<T>] {
  const layoutsRef = React.useRef<Record<string, LayoutRectangle>>({});
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

  const [values, setValues] = useRefState<T>(initialState);
  const [lastCharacters, setLastCharacters] = useRefState<
    FieldsLastCharacters<T>
  >({});
  const { errors, setError, checkError, setErrors } = useErrors<T>();

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

  const scrollViewRef = options?.scrollViewRef;
  const submit = React.useCallback(() => {
    setWasSubmitted(true);
    // if it returns an object there are errors
    if (checkErrorObject(errors.current)) {
      if (scrollViewRef?.current) {
        const errorKeys = Object.keys(layoutsRef.current).filter(
          (k) => !!deepGet(errors.current, k)
        )!;
        const firstErrorY = Math.min(
          ...errorKeys.map((key) => {
            return layoutsRef.current?.[key]?.y || 0;
          })
        );

        if (firstErrorY) {
          const extraPaddingTop = 24;
          scrollViewRef.current.scrollTo({
            y: firstErrorY - extraPaddingTop,
            animated: true,
          });
        }
      }
      return;
    }

    onSubmit.current?.(values.current, {
      touched: touched.current,
      focusedOnce: focusedOnce.current,
    });
  }, [
    setWasSubmitted,
    scrollViewRef,
    errors,
    onSubmit,
    values,
    touched,
    focusedOnce,
  ]);

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

      if (scrollViewRef?.current) {
        if (Platform.OS === 'web') {
          const target = (e.nativeEvent as any).target as any;
          let rect = target.getBoundingClientRect();
          let scrollRect = (
            scrollViewRef.current as any
          ).getBoundingClientRect();

          layoutsRef.current = {
            ...layoutsRef.current,
            [k]: { x: rect.x, y: rect.y - scrollRect.y },
          };
        } else {
          ((e as any).target as View).measure(
            (_x, y, _width, _height, pageX, pageY) => {
              scrollViewRef.current!.measure!(
                (
                  _scrollX,
                  _scrollY,
                  _scrollWidth,
                  _scrollHeight,
                  _scrollPageX,
                  scrollPageY
                ) => {
                  layoutsRef.current = {
                    ...layoutsRef.current,
                    [k]: {
                      x: pageX,
                      y: pageY + y - scrollPageY,
                    },
                  };
                }
              );
            }
          );
        }
      }

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
        const { lastPart, hasLastPart, firstPart } =
          splitNumberStringInParts(n);

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
    autoComplete: 'postal-code',
    autoCorrect: false,
  });

  const streetAddress = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoComplete: 'street-address',
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
    autoComplete: 'tel',
    keyboardType: 'phone-pad',
    autoCorrect: false,
  });

  const name = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoComplete: 'name',
    autoCorrect: false,
  });

  const username = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...text(k, h),
    textContentType: 'username',
    autoComplete: 'username',
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
    autoComplete: 'password',
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
    autoComplete: 'email',
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
  const formState: FormStateType<T> = {
    wasSubmitted: wasSubmitted.current,
    hasErrors: checkErrorObject(errors.current),
    values: values.current,
    errors: errors.current,
    touched: touched.current,
    focusedOnce: focusedOnce.current,
    setField,
    setError,
    setTouched,
    submit,
    formProps: {
      referencer: ctx.referencer,
      indexer: ctx.indexer,
    },
    hasError,
    clearErrors,
    setValues,
  };
  //@ts-ignore
  const inputs: FormInputsType<T> = {
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
  };
  return [formState, inputs];
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
