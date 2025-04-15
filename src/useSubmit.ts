import * as React from 'react';
import { useLatest } from './utils';
import type { FormOptions } from './types';
import type { UseLayoutReturnType } from './useLayout';
import type { UseErrorsReturnType } from './useErrors';
import type { UseWasSubmittedReturnType } from './useWasSubmitted';
import type { UseValuesReturnType } from './useValues';
import type { UseTouchedReturnType } from './useTouched';
import type { UseFocusedOnceReturnType } from './useFocusedOnce';
import { deepGet } from './objectPath';
import { Keyboard } from 'react-native';

export type UseSubmitReturnType<T> = ReturnType<typeof useSubmit<T>>;

export function useSubmit<T>({
  options,
  layout,
  error: { hasErrors, errors },
  wasSubmitted,
  value: { values },
  touch: { touched },
  focusedOnce: { focusedOnce },
}: {
  options: FormOptions<T> | undefined;
  value: UseValuesReturnType<T>;
  wasSubmitted: UseWasSubmittedReturnType;
  layout: UseLayoutReturnType<T>;
  error: UseErrorsReturnType<T>;
  touch: UseTouchedReturnType<T>;
  focusedOnce: UseFocusedOnceReturnType<T>;
}) {
  const scrollViewRef = options?.scrollViewRef;

  const { layoutsRef } = layout;
  const onSubmit = useLatest(options?.onSubmit);

  return {
    wasSubmitted,
    submit: React.useCallback(() => {
      Keyboard.dismiss();
      wasSubmitted.setWasSubmitted(true);
      // if it returns an object there are errors
      if (hasErrors) {
        if (scrollViewRef?.current) {
          const errorKeys = Object.keys(layoutsRef.current).filter(
            (k) => !!deepGet(errors.current, k)
          )!;
          const firstErrorY = Math.min(
            ...errorKeys.map((key) => {
              return layoutsRef.current?.[key]?.y || 0;
            })
          );

          if (firstErrorY && firstErrorY !== Infinity) {
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
      wasSubmitted,
      hasErrors,
      onSubmit,
      values,
      touched,
      focusedOnce,
      scrollViewRef,
      layoutsRef,
      errors,
    ]),
  };
}
