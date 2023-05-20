import { HelperText, TextInput } from 'react-native-paper';
import * as React from 'react';
function TextInputWithError({ errorMessage, ...rest }, ref) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(TextInput, Object.assign({}, rest, { ref: ref })),
    React.createElement(
      HelperText,
      { type: 'error', visible: rest.error },
      errorMessage || ' '
    )
  );
}
export default React.forwardRef(TextInputWithError);
