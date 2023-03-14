import type {
  Customizing,
  DotNestedKeys,
  FormTextInputProps,
  FieldsLastCharacters,
} from '../types';
import { deepGet, deepSet } from '../objectPath';
import { isEmptyNumber, reverse } from '../utils';
import * as React from 'react';
import useRefState from '../useRefState';

export function useNumberRaw<T>({ locale }: { locale: string }) {
  const [lastCharacters, setLastCharacters] = useRefState<
    FieldsLastCharacters<T>
  >({});
  const separationCharacter = React.useMemo(() => {
    const hasIntlSupport = typeof Intl !== undefined;
    if (hasIntlSupport) {
      const formatter = new Intl.NumberFormat(locale);
      const formatted = formatter.format(1.1);
      return formatted.includes(',') ? ',' : '.';
    }
    console.warn(
      '[react-native-use-form] please upgrade React Native to provide Intl support to detect separation character'
    );
    return '.';
  }, [locale]);
  return <K extends DotNestedKeys<T>>(
    k: K,
    h?: Customizing<T, K>
  ): FormTextInputProps => {
    const deepValue = deepGet(values.current, k) as number;
    const value = `${isEmptyNumber(deepValue) ? '' : deepValue}`.replace(
      '.',
      separationCharacter
    );

    return {
      onChangeText: referencedCallback(`number.${k}`, (n: string) => {
        // support numbers like 0,02
        const { lastPart, hasLastPart, firstPart } =
          splitNumberStringInParts(n);

        if (hasLastPart) {
          setLastCharacters((prev) => deepSet(prev, k, lastPart) as any);
        } else {
          setLastCharacters((prev) => deepSet(prev, k, undefined) as any);
        }

        if (n === '') {
          changeValue(k, null as any, h);
        } else {
          const numberValue = Number(firstPart.replace(',', '.'));
          changeValue(k, numberValue as any, h);
        }
      }),
      value: `${value || ''}${deepGet(lastCharacters.current, k) || ''}`,
    };
  };
}

function splitNumberStringInParts(str: string) {
  const lastCommaIndex = str.lastIndexOf(',');
  const lastDotIndex = str.lastIndexOf('.');

  const endsWithComma = str.endsWith(',');
  const endsWithDot = str.endsWith('.');
  const zeroAtEndOfString = countZeroAtEndOfString(str);
  const endsWithZero = zeroAtEndOfString > 0;

  const maxCommaOrDotIndex = Math.max(lastCommaIndex, lastDotIndex);

  if (
    endsWithComma ||
    endsWithDot ||
    (maxCommaOrDotIndex > 0 && zeroAtEndOfString > 0)
  ) {
    const zeroSliceIndex = str.length - zeroAtEndOfString;
    let sliceIndex = endsWithZero ? zeroSliceIndex : maxCommaOrDotIndex;

    // 1,10
    if (zeroSliceIndex - 1 === maxCommaOrDotIndex) {
      sliceIndex = maxCommaOrDotIndex;
    }

    return {
      firstPart: str.slice(0, sliceIndex),
      lastPart: str.slice(sliceIndex, str.length),
      hasLastPart: true,
    };
  }

  return {
    firstPart: str,
    lastPart: '',
    hasLastPart: false,
  };
}

function countZeroAtEndOfString(str: string) {
  let count = 0;
  const reversed = reverse(str);
  for (let character of reversed) {
    if (character !== '0') {
      return count;
    } else {
      count++;
    }
  }
  return count;
}
