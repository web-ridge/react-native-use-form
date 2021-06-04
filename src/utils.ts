// Copied from https://github.com/wsmd/react-use-form-state

// MIT License
//
// Copyright (c) 2018 Waseem Dahman

import * as React from 'react';

export function useMap() {
  const map = React.useRef(new Map());
  return {
    set: (key: string, value: (...args: any) => any) =>
      map.current.set(key, value),
    has: (key: string) => map.current.has(key),
    get: (key: string) => map.current.get(key),
  };
}

export function useReferencedCallback() {
  const callbacks = useMap();
  return (key: string, current: (args: any) => any) => {
    if (!callbacks.has(key)) {
      // @ts-ignore
      const callback = (...args) => callback.current(...args);
      callbacks.set(key, callback);
    }
    callbacks.get(key).current = current;
    return callbacks.get(key);
  };
}

export function useLatest<T>(value: T): { readonly current: T } {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}
