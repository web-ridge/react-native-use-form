import useRefState from './useRefState';

export type UseWasSubmittedReturnType = ReturnType<typeof useWasSubmitted>;

export default function useWasSubmitted() {
  const [wasSubmitted, setWasSubmitted] = useRefState<boolean>(false);
  return { wasSubmitted, setWasSubmitted };
}
