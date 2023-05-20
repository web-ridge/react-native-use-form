import * as React from 'react';
import type { BaseCustomizing, DotNestedKeys, ErrorUtility } from './types';
import useCheckError from './useCheckError';
import { Customizing, CustomizingRaw, GetFieldType } from './types';
import type { UseValuesReturnType } from './useValues';
import type { UseFocusedOnceReturnType } from './useFocusedOnce';
import type { UseTouchedReturnType } from './useTouched';
import { deepGet } from './objectPath';
import type { UseWasSubmittedReturnType } from './useWasSubmitted';

export type UseErrorsReturnType<T> = ReturnType<typeof useErrors<T>>;

export default function useErrors<T>({
  // options,
  locale,
  touch: { touched },
  value: { values },
  focusedOnce: { focusedOnce },
  wasSubmitted: { wasSubmitted },
}: {
  // options: FormOptions<T> | undefined;
  locale: string;
  value: UseValuesReturnType<T>;
  focusedOnce: UseFocusedOnceReturnType<T>;
  touch: UseTouchedReturnType<T>;
  wasSubmitted: UseWasSubmittedReturnType;
}) {
  // TODO: detect if this is a render
  const renderIndex = React.useRef(0);
  React.useEffect(() => {
    renderIndex.current += 1;
  });

  const renderIndexPerKey = React.useRef<Record<string, number>>({});
  const handlers = React.useRef<Record<string, BaseCustomizing<T, any>>>({});

  const updateHandler = React.useCallback(
    (k: string, v: BaseCustomizing<T, any>) => {
      renderIndexPerKey.current[k] = renderIndex.current;
      if (k === 'telephone') {
        console.log(renderIndex.current, 'updateHandler YES!!', k);
      } else {
        console.log(renderIndex.current, 'updateHandler', k);
      }

      handlers.current[k] = v;
    },
    []
  );

  const checkError = useCheckError<T>({ locale });

  const hasError = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K): boolean => {
      if (renderIndexPerKey.current[k] !== renderIndex.current) {
        console.log(renderIndex.current, 'hasError NO!!', k);
        return false;
      }
      const isTouched = deepGet(touched.current, k);
      const isFocusedOnce = deepGet(focusedOnce.current, k);
      const error = checkError(
        k,
        handlers.current[k],
        values.current[k],
        values.current
      );

      if ((isTouched && isFocusedOnce) || wasSubmitted.current) {
        const noError = error === false;
        return !noError;
      }
      return false;
    },
    []
  );

  const checkErrors = React.useCallback(() => {
    // TODO:
    return false as boolean;
  }, []);

  React.useEffect(() => {
    const errors = Object.keys(handlers.current).reduce((acc, k) => {
      const key = k as DotNestedKeys<T>;
      const handler = handlers.current[key];
      const value = deepGet(values.current, key) as GetFieldType<T, typeof key>;
      const allValues = values.current;
      const err = checkError(k as any, handler, value, allValues);
      if (err) {
        acc[key] = err as any;
      }
      return acc;
    }, {});
    console.log('errors', { errors, handlers });
  });

  return {
    checkError,
    hasError,
    checkErrors,
    updateHandler,

    errors: {
      // TODO: this is stupid
      current: {},
    },
  };
}
