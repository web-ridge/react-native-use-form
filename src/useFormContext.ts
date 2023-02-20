import { FormContext, FormContextType } from './FormContext';
import * as React from 'react';
import useInnerContext from './useInnerContext';

export function useFormContext(): FormContextType & {
  formIndex: number;
} {
  const px = React.useContext(FormContext);
  const ix = useInnerContext(!!px);
  const ctx = (px || ix)!;
  const idx = React.useRef<number>(px ? px.indexer.add() : ctx.indexer.i);
  return {
    ...ctx,
    formIndex: idx.current,
  };
}
