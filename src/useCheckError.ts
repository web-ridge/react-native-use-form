import * as React from 'react';
import type {
  Customizing,
  CustomizingRaw,
  DotNestedKeys,
  GetFieldType,
} from './types';
import { getTranslation } from './translations/utils';

export default function useCheckError<T>({
  locale,
  setError,
}: {
  locale: string;
  setError: any;
}) {
  return React.useCallback(
    <K extends DotNestedKeys<T>>(
      k: K,
      h: Customizing<T, K> | CustomizingRaw<T, K> | undefined,
      v: GetFieldType<T, K>,
      allV: T,
      initial?: boolean
    ) => {
      let err: boolean | string | undefined;

      if (h) {
        if (h?.required === true && !v) {
          err = getTranslation(
            locale,
            'required'
          )({
            fieldKey: k,
            label: h?.label,
          });
        } else if (h.minLength !== undefined && `${v}`.length < h.minLength) {
          err = getTranslation(
            locale,
            'lengtShouldBeLongerThan'
          )({
            fieldKey: k,
            label: h?.label,
            requiredLength: h.minLength,
          });
        } else if (h.maxLength !== undefined && `${v}`.length > h.maxLength) {
          err = getTranslation(
            locale,
            'lengthShouldBeShorterThan'
          )({
            fieldKey: k,
            label: h?.label,
            requiredLength: h.maxLength,
          });
        } else if (h.shouldFollowRegexes) {
          for (let { regex, errorMessage } of h.shouldFollowRegexes) {
            if (!regex.test(`${v}`)) {
              err = getTranslation(
                locale,
                'shouldFollowRegex'
              )({
                fieldKey: k,
                label: h?.label,
                errorMessage,
              });
              break;
            }
          }
        } else if (h.validate) {
          err = h.validate?.(v, allV);
        }
      }
      setError(
        k,
        err === true || err === undefined || err === null ? false : err,
        initial
      );
    },
    [locale, setError]
  );
}
