import * as React from 'react';

/**
 * Determines if the given param is an object. {}
 * @param obj
 */
export const isObject = (obj: any): obj is object =>
  Object.prototype.toString.call(obj) === '[object Object]';

const useMounted = () => {
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
};

export function useRefState<S>(
  initialState: S | (() => S),
  blockIfUnmounted: boolean = true
): [React.MutableRefObject<S>, React.Dispatch<React.SetStateAction<S>>] {
  const mounted = useMounted();
  const [reactState, setReactState] = React.useState(initialState);
  const state = React.useRef(reactState);
  const setState = React.useCallback(
    (arg: any) => {
      if (!mounted.current && blockIfUnmounted) return;
      state.current = typeof arg === 'function' ? arg(state.current) : arg;
      setReactState(state.current);
    },
    [blockIfUnmounted, mounted]
  );
  return [state, setState];
}

export default useRefState;
