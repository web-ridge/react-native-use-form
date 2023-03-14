import { deepGet } from './objectPath';
import type {
  Customizing,
  DotNestedKeys,
  ReferencedCallback,
  ScrollViewRef,
} from './types';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import * as React from 'react';
import { measure } from './layoutUtil';

export default function useLayout<T>({
  referencedCallback,
  scrollViewRef,
}: {
  referencedCallback: ReferencedCallback;
  scrollViewRef: ScrollViewRef;
}) {
  const layoutsRef = React.useRef<Record<string, LayoutRectangle>>({});
  return <K extends DotNestedKeys<T>>(k: K, h?: Customizing<T, K>) =>
    referencedCallback(`layout.${k}`, (e: LayoutChangeEvent) => {
      h?.onLayout?.(e);

      // we need to know the layouts of the fields to scroll to them (if there is an error)
      if (scrollViewRef?.current) {
        measure(e, scrollViewRef, (v) => {
          layoutsRef.current = {
            ...layoutsRef.current,
            [k]: v,
          };
        });
      }

      const value = deepGet(values.current, k);
      // this is not ideal, but we need to check the error after the layout is
      // calculated  because it's the only way to check if the value has an
      // error since we don't have the handlers at mount time
      checkError(k, h, value as any, values.current, true);
    });
}
