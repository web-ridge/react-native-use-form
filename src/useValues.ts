import useRefState from './useRefState';

export type UseValuesReturnType<T> = ReturnType<typeof useValues<T>>;
export default function useValues<T>(initialState: T) {
  const [values, setValues] = useRefState<T>(initialState);
  return { values, setValues };
}
