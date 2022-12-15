import { HelperText, TextInput } from 'react-native-paper';
import * as React from 'react';

export default function TextInputWithError({
  errorMessage,
  ...rest
}: React.ComponentProps<typeof TextInput> & { errorMessage?: string }) {
  return (
    <>
      <TextInput {...rest} />
      <HelperText type="error" visible={rest.error}>
        {errorMessage || ' '}
      </HelperText>
    </>
  );
}
