import type {
  BaseCustomizing,
  Customizing,
  CustomizingRaw,
  DotNestedKeys,
  FormInputBaseProps,
  FormInputRawProps,
  FormInputsType,
  FormOptions,
  FormTextInputProps,
  GetFieldType,
  ReferencedCallback,
} from './types';
import { removeEmpty, useLatest } from './utils';
import { deepGet, deepSet } from './objectPath';
import { useNumberRaw } from './numberRaw';
import {
  NativeSyntheticEvent,
  Platform,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import * as React from 'react';
import type { UseErrorsReturnType } from './useErrors';
import type { UseLayoutReturnType } from './useLayout';
import type { UseValuesReturnType } from './useValues';
import type { UseTouchedReturnType } from './useTouched';
import type { UseFocusedOnceReturnType } from './useFocusedOnce';
import { UseNextAndSubmitRefReturnType } from './useNextAndSubmitRef';

export type UseInputsReturnType<T> = ReturnType<typeof useInputs<T>>;

export function useInputs<T>({
  options,
  locale,

  referencedCallback,
  error: {
    errors,
    updateHandler: updateErrorHandler,
    hasError,
    checkAndSetError,
  },
  layout: { onLayoutKey },
  value: { values, setValues },
  touch: { touched, setTouched },
  focusedOnce: { focusedOnce, setFocusedOnce },
  nextAndSubmit: { inputReferencer },
}: {
  options: FormOptions<T> | undefined;
  locale: string;
  referencedCallback: ReferencedCallback;
  error: UseErrorsReturnType<T>;
  layout: UseLayoutReturnType<T>;
  value: UseValuesReturnType<T>;
  touch: UseTouchedReturnType<T>;
  focusedOnce: UseFocusedOnceReturnType<T>;
  nextAndSubmit: UseNextAndSubmitRefReturnType;
}) {
  const onChange = useLatest(options?.onChange);
  const enhance = useLatest(options?.enhance);

  type InputT<ReturnType> = <K extends DotNestedKeys<T>>(
    k: K,
    h: Customizing<T, K> | undefined
  ) => ReturnType;

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
      checkAndSetError(
        k,
        h as BaseCustomizing<T, K>,
        enhancedV as any,
        enhancedNewValues
      );
      setTouched(k, true);

      onChange.current?.(enhancedNewValues, {
        touched: touched.current,
        focusedOnce: focusedOnce.current,
        errors: errors.current,
      });
    },
    [
      values,
      enhance,
      setValues,
      checkAndSetError,
      setTouched,
      onChange,
      touched,
      focusedOnce,
      errors,
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
  const baseProps: InputT<FormInputBaseProps> = (k, h) => {
    updateErrorHandler(k, h);
    return removeEmpty({
      testID: k,
      onLayout: onLayoutKey(k),
      onBlur: blur(k, h),
      error: hasError(k),
      errorMessage: deepGet(errors.current, k),
      label: h?.label,
    });
  };

  const text: InputT<FormTextInputProps> = (k, h) => ({
    ...inputReferencer(k),
    ...baseProps(k, h),
    value: deepGet(values.current, k) || '',
    onChangeText: referencedCallback(
      `text.${k}`,
      (n: GetFieldType<T, typeof k>) => changeValue(k, n, h)
    ),
  });

  const numberRawCreator = useNumberRaw<T>({ locale, referencedCallback });
  const numberRaw: InputT<FormTextInputProps> = (k, h) => ({
    ...inputReferencer(k),
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

  const firstName = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...name(k, h),
    autoComplete: 'given-name' as any, // https://reactnative.dev/docs/next/textinput#inputmode
  });
  const middleName = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...name(k, h),
    autoComplete: 'name-middle\n' as any, // https://reactnative.dev/docs/next/textinput#inputmode
  });

  const lastName = <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => ({
    ...name(k, h),
    autoComplete: 'family-name' as any, // https://reactnative.dev/docs/next/textinput#inputmode
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

  // @ts-expect-error
  const inputs: FormInputsType<T> = {
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
    firstName,
    middleName,
    lastName,
    username,
    password,
    email,
    raw,
  };
  return {
    inputs: inputs as any, // any for infinite error loop typescript
    setField,
  };
}
