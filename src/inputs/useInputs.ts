import {
  BooleanUtility,
  Customizing,
  CustomizingRaw,
  DotNestedKeys,
  FormInputBaseProps,
  FormInputRawProps,
  FormInputsType,
  FormOptions,
  FormTextInputProps,
  GetFieldType,
} from '../types';
import { removeEmpty, useReferencedCallback } from '../utils';
import { deepGet, deepSet } from '../objectPath';
import { useNumberRaw } from './numberRaw';
import {
  NativeSyntheticEvent,
  Platform,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import * as React from 'react';
import useRefState from '../useRefState';
import useErrors from '../useErrors';

function useTouched<T>() {
  const [touched, sTouched] = useRefState<BooleanUtility<T>>({});
  const setTouched = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: boolean) => {
      sTouched((p) => deepSet(p, k, v) as any);
    },
    [sTouched]
  );
  return { touched, setTouched };
}
export function useInputs<T>(options: FormOptions<T> | undefined): {
  inputs: FormInputsType<T>;
  focusedOnce: BooleanUtility<T>;
} {
  const referencedCallback = useReferencedCallback();
  const { touched, setTouched } = useTouched<T>();
  const [values, setValues] = useRefState<T>(initialState);
  const { errors, setError, checkError, setErrors } = useErrors<T>({ locale });

  type InputT<ReturnType> = <K extends DotNestedKeys<T>>(
    k: K,
    h: Customizing<T, K> | undefined
  ) => ReturnType;

  const [focusedOnce, sFocusedOnce] = useRefState<BooleanUtility<T>>({});
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

  const blur: InputT<TextInputProps['onBlur']> = (k, h) =>
    referencedCallback(
      `blur.${k}`,
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        h?.onBlur?.(e);
        setFocusedOnce(k, true);
      }
    );
  const baseProps: InputT<FormInputBaseProps> = (k, h) =>
    removeEmpty({
      ...ctx.referencer(k, ctx.formIndex),
      testID: k,
      onLayout: layout(k, h),
      onBlur: blur(k, h),
      error: hasError(k),
      errorMessage: deepGet(errors.current, k),
      label: h?.label,
    });

  const text: InputT<FormTextInputProps> = (k, h) => ({
    ...baseProps(k, h),
    value: deepGet(values.current, k) || '',
    onChangeText: referencedCallback(
      `text.${k}`,
      (n: GetFieldType<T, typeof k>) => changeValue(k, n, h)
    ),
  });

  const numberRawCreator = useNumberRaw<T>();
  const numberRaw: InputT<FormTextInputProps> = (k, h) => ({
    ...baseProps(k, h),
    ...numberRawCreator(k, h, values.current, changeValue),
  });

  const number: InputT<FormTextInputProps> = (k, h) => ({
    ...numberRaw(k, h),
    keyboardType: 'number-pad',
  });

  const decimal: InputT<FormTextInputProps> = (k, h) => ({
    ...numberRaw(k, h),
    keyboardType: 'decimal-pad',
  });

  const numberText: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    keyboardType: 'number-pad',
  });

  const decimalText: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    keyboardType: 'decimal-pad',
  });

  const postalCode: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    autoCapitalize: 'characters',
    textContentType: 'postalCode',
    autoComplete: 'postal-code',
    autoCorrect: false,
  });

  const streetAddress: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoComplete: 'street-address',
    autoCorrect: false,
  });

  const city: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    autoCapitalize: 'words',
    textContentType: 'addressCity',
    autoCorrect: false,
  });

  const telephone: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    textContentType: 'telephoneNumber',
    autoComplete: 'tel',
    keyboardType: 'phone-pad',
    autoCorrect: false,
  });

  const name: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    autoCapitalize: 'words',
    autoComplete: 'name',
    autoCorrect: false,
  });

  const username: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    textContentType: 'username',
    autoComplete: 'username',
    autoCapitalize: 'none',
    autoCorrect: false,
    selectTextOnFocus: Platform.OS !== 'web',
  });

  const password: InputT<FormTextInputProps> = (k, h) => ({
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

  const email: InputT<FormTextInputProps> = (k, h) => ({
    ...text(k, h),
    textContentType: 'emailAddress',
    autoComplete: 'email',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoCorrect: false,
  });

  const raw = <K extends DotNestedKeys<T>>(
    k: K,
    h?: CustomizingRaw<T, K>
  ): FormInputRawProps<GetFieldType<T, K>> => ({
    ...baseProps(k, h),
    onChange: referencedCallback(`raw.${k}`, (n: GetFieldType<T, K>) => {
      setTouched(k, true);
      setFocusedOnce(k, true);
      changeValue(k, n, h);
    }),
    value: deepGet(values.current, k),
  });

  const setField = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: GetFieldType<T, K>) => {
      changeValue(k, v, undefined);
    },
    [changeValue]
  );

  return {
    inputs: {
      text,
      number,
      decimal,
      numberText,
      decimalText,
      postalCode,
      streetAddress,
      city,
      telephone,
      name,
      username,
      password,
      email,
      raw,
    },
    setField,
    focusedOnce: focusedOnce.current,
  };
}
