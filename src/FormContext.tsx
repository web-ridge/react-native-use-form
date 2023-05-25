import * as React from 'react';

export type FormContextType = {};
const empty = {};

export const FormContext = React.createContext<FormContextType>(empty);
