import type { LayoutChangeEvent } from 'react-native';
import type { ScrollViewRefObject } from './types';

export function measure(
  e: LayoutChangeEvent,
  scrollViewRef: ScrollViewRefObject,
  callback: (v: { x: number; y: number }) => void
) {
  const target = (e.nativeEvent as any).target;
  const rect = target.getBoundingClientRect();
  const scrollRect = (scrollViewRef.current as any)?.getBoundingClientRect?.();
  callback({ x: rect.x, y: rect.y - scrollRect.y });
}
