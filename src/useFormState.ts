import { useReferencedCallback } from './utils';
import type { FormStateType, FormOptions } from './types';
import { defaultLocale } from './translations/utils';
import { useFormContext } from './useFormContext';
import { useInputs } from './useInputs';
import { useSubmit } from './useSubmit';
import useLayout from './useLayout';
import useErrors from './useErrors';
import useTouched from './useTouched';
import useValues from './useValues';
import useFocusedOnce from './useFocusedOnce';
import useWasSubmitted from './useWasSubmitted';
import { FormInputsType } from './types';

export default function useFormState<T>(
  initialState: T,
  options?: FormOptions<T>
) {
  const locale = options?.locale || defaultLocale;
  const touch = useTouched<T>();
  const value = useValues<T>(initialState);
  const focusedOnce = useFocusedOnce<T>();
  const wasSubmitted = useWasSubmitted();
  const referencedCallback = useReferencedCallback();
  const ctx = useFormContext();

  const layout = useLayout<T>({
    referencedCallback,
    scrollViewRef: options?.scrollViewRef,
  });

  const error = useErrors<T>({
    locale,
    touch,
    value,
    focusedOnce,
    wasSubmitted,
  });
  const input = useInputs<T>({
    options,
    locale,
    context: ctx,
    error,
    layout,
    value,
    touch,
    focusedOnce,
    referencedCallback,
  });
  const submit = useSubmit<T>({
    options,
    layout,
    error,
    touch,
    wasSubmitted,
    value,
    focusedOnce,
  });

  const formState: FormStateType<T> = {
    wasSubmitted: wasSubmitted.wasSubmitted.current,
    hasErrors: error.hasErrors,
    errors: error.errors.current,
    hasError: error.hasError,

    values: value.values.current,
    setValues: value.setValues,

    touched: touch.touched.current,
    setTouched: touch.setTouched,

    focusedOnce: focusedOnce.focusedOnce.current,

    setField: input.setField,

    submit: submit.submit,

    formProps: {
      referencer: ctx.referencer,
      indexer: ctx.indexer,
    },
  };

  return [
    formState as FormStateType<T>,
    input.inputs as FormInputsType<T>,
  ] as const;
}
