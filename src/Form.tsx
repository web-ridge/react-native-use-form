import * as React from 'react';
import { FormContext } from './FormContext';

const empty = {};
export default function Form({ children }: { children: any }) {
  return <FormContext.Provider value={empty}>{children}</FormContext.Provider>;
}
