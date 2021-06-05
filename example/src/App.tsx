import * as React from 'react';

import { View } from 'react-native';
import { useFormState, Form } from 'react-native-use-form';
import { Button, HelperText, TextInput } from 'react-native-paper';

export default function App() {
  const [
    { errors, submit, formProps, hasError },
    { email, telephone, password },
  ] = useFormState(
    {
      email: '',
      telephone: '',
      password: '',
    },
    {
      onChange: () => {
        // TODO: fix enum in backend
      },
      onSubmit: () => {
        console.log('no errors, submit!');
        // alert('no errors we can submit');
      },
    }
  );
  return (
    <View
      style={{
        flex: 1,
        maxWidth: 500,
        alignSelf: 'center',
      }}
    >
      <Form {...formProps}>
        <TextInput
          mode="outlined"
          error={hasError('email')}
          {...email('email', {
            validate: (v) => {
              return looksLikeMail(v) ? true : 'Email-address is invalid';
            },
          })}
          label="E-mail"
        />
        <HelperText type="error" visible={hasError('email')}>
          {errors.email}
        </HelperText>
        <TextInput
          mode="outlined"
          {...telephone('telephone', {
            validate: (v) => {
              console.log({ v });
              return looksLikeTelephone(v) ? true : 'Telephone is invalid';
            },
          })}
          label="Telefoon"
          error={hasError('telephone')}
        />
        <HelperText type="error" visible={hasError('telephone')}>
          {errors.telephone}
        </HelperText>

        <TextInput
          mode="outlined"
          {...password('password')}
          label="Wachtwoord"
          error={hasError('password')}
        />
        <Button mode="contained" onPress={submit}>
          Save
        </Button>
      </Form>
    </View>
  );
}

function looksLikeTelephone(str: string): boolean {
  if (str.length !== 10) {
    return false;
  }
  let isNum = /^\d+$/.test(str);
  if (!isNum) {
    return false;
  }
  return true;
}

function looksLikeMail(str: string): boolean {
  let lastAtPos = str.lastIndexOf('@');
  let lastDotPos = str.lastIndexOf('.');
  return (
    lastAtPos < lastDotPos &&
    lastAtPos > 0 &&
    str.indexOf('@@') === -1 &&
    lastDotPos > 2 &&
    str.length - lastDotPos > 2
  );
}
