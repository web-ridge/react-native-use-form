import * as React from 'react';
import type { IndexerType, ReferencerType } from './useFormState';
// import { MutableRefObject } from 'react';

export type FormContextType = {
  indexer: IndexerType;
  referencer: ReferencerType;

  // refForKey: MutableRefObject<FormRefKeyMap>;
};

export const FormContext = React.createContext<FormContextType | undefined>(
  undefined
);
