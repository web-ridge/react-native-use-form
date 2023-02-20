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

export function reverse(str: string) {
  let reversed = '';
  for (let character of str) {
    reversed = character + reversed;
  }
  return reversed;
}

export function isEmptyNumber(str: number) {
  return !str && str !== 0;
}

export function checkErrorObject(errors: any) {
  const keys = Object.keys(errors);
  for (let key of keys) {
    if (isObject(errors[key])) {
      if (checkErrorObject(errors[key])) {
        return true;
      }
    } else {
      if (errors[key]) {
        return true;
      }
    }
  }
  return false;
}

function isObject<T>(val: T) {
  if (val === null) {
    return false;
  }
  return typeof val === 'function' || typeof val === 'object';
}
export function removeEmpty<
  T extends { [s: string]: unknown } | ArrayLike<unknown>
>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as any;
}
