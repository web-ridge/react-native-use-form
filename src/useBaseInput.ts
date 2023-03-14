import { deepGet } from './objectPath';
import { Customizing, DotNestedKeys } from './types';

export function useBaseInput<T, K extends DotNestedKeys<T>>(
  k: K,
  h?: Customizing<T, K>
) {
  return {
    inputProps: {
      ...ctx.referencer(k, ctx.formIndex),
      testID: k,
      onLayout: layout(k, h),
      onBlur: blur(k, h),
      error: hasError(k),
      errorMessage: deepGet(errors.current, k),
      label: h?.label,
    },
  };
}
