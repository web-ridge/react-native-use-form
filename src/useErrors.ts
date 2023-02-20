import * as React from 'react';
import type { DotNestedKeys, ErrorUtility } from './types';
import useRefState from './useRefState';
import { deepGet, deepSet } from './objectPath';
import useCheckError from './useCheckError';
import { checkErrorObject } from './utils';

export default function useErrors<T>({ locale }: { locale: string }) {
  const initialErrorCache = React.useRef<ErrorUtility<T>>({});
  const [errors, sErrors] = useRefState<ErrorUtility<T>>(initialErrorCache);
  React.useEffect(() => {
    // render optimization because we don't want to re-render on every field at the beginning of the onLayout calls :)
    if (checkErrorObject(initialErrorCache.current)) {
      const timer = setTimeout(() => {
        sErrors(initialErrorCache.current);
      }, 100);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
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

  const checkError = useCheckError<T>(locale, sErrors);
  return { errors, setErrors: sErrors, checkError, clearErrors, setError };
}
