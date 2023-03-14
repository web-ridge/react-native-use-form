import { checkErrorObject, useLatest } from './utils';
import type { FormStateType, FormInputsType, FormOptions } from './types';
import { defaultLocale } from './translations/utils';
import { useFormContext } from './useFormContext';
import { useSubmit } from './useSubmit';
import { useInputs } from './inputs/useInputs';

export default function useFormState<T>(
  initialState: T,
  options?: FormOptions<T>
): [formState: FormStateType<T>, inputs: FormInputsType<T>] {
  const locale = options?.locale || defaultLocale;
  const onChange = useLatest(options?.onChange);
  const enhance = useLatest(options?.enhance);

  const ctx = useFormContext();

  const { submit, wasSubmitted } = useSubmit(options);
  const {
    inputs,
    focusedOnce,
    values,
    touched,
    setField,
    setError,
    setTouched,
    hasError,
    clearError,
    setValues,
  } = useInputs<T>(options, initialState);

  const formState: FormStateType<T> = {
    wasSubmitted: wasSubmitted.current,
    hasErrors: checkErrorObject(errors.current),
    values: values.current,
    errors: errors.current,
    touched: touched.current,
    focusedOnce,
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

  return [formState, inputs];
}
