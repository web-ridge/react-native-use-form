import useRefState from './useRefState';
import type { BooleanUtility, DotNestedKeys } from './types';
import * as React from 'react';
import { deepSet } from './objectPath';

export type UseTouchedReturnType<T> = ReturnType<typeof useTouched<T>>;
export default function useTouched<T>() {
  const [touched, sTouched] = useRefState<BooleanUtility<T>>({});
  const setTouchedField = React.useCallback(
    <K extends DotNestedKeys<T>>(k: K, v: boolean) => {
      sTouched((p) => deepSet(p, k, v) as any);
    },
    [sTouched]
  );
  return { touched, setTouchedField };
}
