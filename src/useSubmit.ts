import * as React from 'react';
import { checkErrorObject, useLatest } from './utils';
import { deepGet } from './objectPath';
import type { FormOptions } from './types';
import useRefState from './useRefState';

export function useSubmit<T>(options: FormOptions<T> | undefined) {
  const onSubmit = useLatest(options?.onSubmit);
  const [wasSubmitted, setWasSubmitted] = useRefState<boolean>(false);
  const scrollViewRef = options?.scrollViewRef?.current;
  return {
    wasSubmitted,
    submit: React.useCallback(() => {
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
    ]),
  };
}
