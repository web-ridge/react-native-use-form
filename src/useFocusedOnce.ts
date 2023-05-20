import useRefState from './useRefState';
import type { BooleanUtility, DotNestedKeys } from './types';
import * as React from 'react';
import { deepSet } from './objectPath';

export type UseFocusedOnceReturnType<T> = ReturnType<typeof useFocusedOnce<T>>;
export default function useFocusedOnce<T>() {
  const [focusedOnce, sFocusedOnce] = useRefState<BooleanUtility<T>>({});
  const setFocusedOnce = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: boolean) => {
      sFocusedOnce((p) => deepSet(p, k, v) as any);
    },
    [sFocusedOnce]
  );
  return { focusedOnce, setFocusedOnce };
}
