import * as React from 'react';
import { useReferencedCallback } from './utils';
import type { TextInput } from 'react-native';
import hasVirtualKeyboard from './hasVirtualKeyboard';
import useRefState from './useRefState';
import { UseSubmitReturnType } from './useSubmit';

export type UseNextAndSubmitRefReturnType = ReturnType<
  typeof useNextAndSubmitRef
>;

export default function useNextAndSubmitRef<T>({
  submit,
}: {
  submit: UseSubmitReturnType<T>;
}) {
  const index = React.useRef<number>(0);
  const [lastKey, setLastKey] = useRefState<string | undefined>(undefined);
  const inputPerKey = React.useRef<Record<string, TextInput | null>>({});
  const indexForKey = React.useRef<Record<string, number>>({});
  const keyForIndex = React.useRef<Record<number, string>>({});
  index.current = 0;
  indexForKey.current = {};
  keyForIndex.current = {};

  const referencedCallback = useReferencedCallback();

  React.useEffect(() => {
    const allIndexes = Object.keys(indexForKey.current).map((k) =>
      Number(indexForKey.current[k])
    );
    const maxIndex = Math.max(...allIndexes);
    setLastKey(keyForIndex.current[maxIndex]);
  }, [setLastKey, inputPerKey]);

  const inputReferencer = (key: string) => {
    indexForKey.current[key] = index.current;
    keyForIndex.current[index.current] = key;
    index.current = index.current + 1;

    return {
      ref: referencedCallback(`ref.${key}`, (e: TextInput) => {
        inputPerKey.current[key] = e;
      }),
      onSubmitEditing: referencedCallback(`onSubmitEditing.${key}`, () => {
        // check if is the last key or !virtualKeyboard
        const allIndexes = Object.keys(indexForKey.current).map((k) =>
          Number(indexForKey.current[k])
        );
        const inputPerIndex: Record<number, TextInput> = Object.keys(
          inputPerKey.current
        ).reduce(
          (acc, k) => ({
            ...acc,
            [indexForKey.current[k]!]: inputPerKey.current[k],
          }),
          {}
        );
        const sortedIndexes = allIndexes.sort((a, b) => a - b);
        const maxIndex = sortedIndexes[sortedIndexes.length - 1];
        const currentIndex = indexForKey.current[key] || 0;
        const currentInput = inputPerIndex[currentIndex];
        const lastInput = maxIndex && inputPerIndex?.[maxIndex];
        const isLastInput = lastInput === currentInput;
        const hasPhysicalKeyboard = !hasVirtualKeyboard;
        const shouldSubmit = isLastInput || hasPhysicalKeyboard;

        if (shouldSubmit) {
          submit.submit();
          return;
        }

        const nextInputs = sortedIndexes
          .filter((i) => i > currentIndex)
          .map((higherIndex) => inputPerIndex[higherIndex])
          .filter(Boolean);

        const nextField = nextInputs.find((input) => {
          const p = input?.props;

          if ((p as any)?.disabled === true || p?.editable === false) {
            return false;
          }
          // already sorted so the first one to hit above current index is the next field
          return input;
        });

        nextField?.focus?.();
        currentInput?.blur?.();
      }),
      blurOnSubmit: lastKey.current === key,
      returnKeyType: lastKey.current === key ? 'send' : 'next',
    };
  };

  return { inputReferencer };
}
