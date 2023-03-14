import type { LayoutChangeEvent } from 'react-native';
import type { View } from 'react-native';
import type { ScrollViewRefObject } from './types';

export function measure(
  e: LayoutChangeEvent,
  scrollViewRef: ScrollViewRefObject,
  callback: (v: { x: number; y: number }) => void
) {
  (e.target as any as View)?.measure?.(
    (_x, y, _width, _height, pageX, pageY) => {
      scrollViewRef.current?.measure?.(
        (
          _scrollX,
          _scrollY,
          _scrollWidth,
          _scrollHeight,
          _scrollPageX,
          scrollPageY
        ) => {
          callback({
            x: pageX,
            y: pageY + y - scrollPageY,
          });
        }
      );
    }
  );
}
