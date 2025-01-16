import { HelperText, TextInput } from 'react-native-paper';
import type { TextInputProps } from 'react-native';
import * as React from 'react';

function TextInputWithError(
  {
    errorMessage,
    ...rest
  }: TextInputProps & {
    errorMessage?: string;
    mode?: any;
    label?: string;
    error?: boolean;
  },
  ref: any
) {
  return (
    <>
      {/*// @ts-ignore*/}
      <TextInput {...rest} ref={ref} />
      {/*// @ts-ignore*/}
      <HelperText type="error" visible={rest.error}>
        {errorMessage || ' '}
      </HelperText>
    </>
  );
}
export default React.memo(React.forwardRef(TextInputWithError));
