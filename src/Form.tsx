import * as React from 'react';
import { FormContext } from './FormContext';
import type { IndexerType, ReferencerType } from './useFormState';

export default function Form({
  children,
  referencer,
  indexer,
}: {
  children: any;
  indexer: IndexerType;
  referencer: ReferencerType;
}) {
  return (
    <FormContext.Provider
      value={{
        indexer,
        referencer,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
