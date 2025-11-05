import * as React from 'react';
import type { BaseCustomizing, DotNestedKeys, ErrorUtility } from './types';
import type { UseValuesReturnType } from './useValues';
import type { UseFocusedOnceReturnType } from './useFocusedOnce';
import type { UseTouchedReturnType } from './useTouched';
import { deepGet, deepSet } from './objectPath';
import type { UseWasSubmittedReturnType } from './useWasSubmitted';
import useRefState from './useRefState';
import { deepEqual } from 'fast-equals';
import checkError from './checkError';
import { checkErrorObject } from './utils';

export type UseErrorsReturnType<T> = ReturnType<typeof useErrors<T>>;

export default function useErrors<T>({
  // options,
  locale,
  touch: { touched },
  value: { values },
  focusedOnce: { focusedOnce },
  wasSubmitted: { wasSubmitted },
}: {
  locale: string;
  value: UseValuesReturnType<T>;
  focusedOnce: UseFocusedOnceReturnType<T>;
  touch: UseTouchedReturnType<T>;
  wasSubmitted: UseWasSubmittedReturnType;
}) {
  const handlers = React.useRef<Record<string, BaseCustomizing<T, any>>>({});
  handlers.current = {};

  const [errors, setErrors] = useRefState<ErrorUtility<T>>({});

  const updateHandler = React.useCallback(
    <K extends DotNestedKeys<T>>(
      k: K,
      v: BaseCustomizing<T, K> | undefined
    ) => {
      if (v) {
        handlers.current[k] = v;
      }
    },
    []
  );

  const checkAndSetError = React.useCallback(
    <K extends DotNestedKeys<T>>(
      key: K,
      handler: BaseCustomizing<T, K>,
      _oldValues: T,
      newValues: T
    ) => {
      const err = checkError(
        locale,
        key,
        handler,
        deepGet(newValues, key),
        newValues
      );
      const currentError = deepGet(errors.current, key);
      if (currentError !== err) {
        setErrors((prev) => {
          return deepSet(prev, key, err) as any;
        });
      }
    },
    [errors, locale, setErrors]
  );

  const validateAllFields = React.useCallback(() => {
    const errorsObject = Object.keys(handlers.current).reduce((acc, k) => {
      const key = k as DotNestedKeys<T>;
      const handler = handlers.current[key];
      const value = deepGet(values.current, key);
      const allValues = values.current;
      const err = checkError(
        locale,
        key,
        handler as any,
        value as any,
        allValues
      );

      acc = deepSet(acc, key, err);
      return acc;
    }, {} as any);

    setErrors(errorsObject);
    return checkErrorObject(errorsObject);
  }, [locale, values, setErrors]);

  const hasError = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K): boolean => {
      const isTouched = deepGet(touched.current, k);
      const isFocusedOnce = deepGet(focusedOnce.current, k);
      const error = deepGet(errors.current, k);

      if ((isTouched && isFocusedOnce) || wasSubmitted.current) {
        const noError =
          error === false || error === undefined || error === null;
        return !noError;
      }
      return false;
    },
    [errors, focusedOnce, touched, wasSubmitted]
  );

  React.useEffect(() => {
    // loop trough object and if value is not a function but object loop through object
    const errorsObject = Object.keys(handlers.current).reduce((acc, k) => {
      const key = k as DotNestedKeys<T>;
      const handler = handlers.current[key];
      const value = deepGet(values.current, key);
      const allValues = values.current;
      const err = checkError(
        locale,
        key,
        handler as any,
        value as any,
        allValues
      );

      acc = deepSet(acc, key, err);
      return acc;
    }, {} as any);

    // prevent endless re-render loop
    if (!deepEqual(errorsObject, errors.current)) {
      setErrors(errorsObject);
    }
  });

  return {
    hasError,
    hasErrors: checkErrorObject(errors.current),
    updateHandler,
    errors,
    checkAndSetError,
    validateAllFields,
  };
}
