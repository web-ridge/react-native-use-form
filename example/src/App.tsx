import * as React from 'react';

import { View } from 'react-native';
import { useFormState, Form } from '../../src/index';
import { Button, HelperText, TextInput } from 'react-native-paper';

type FormType = {
  email: string;
  telephone: string;
  password: string;
  age: number | undefined;
  money: number | undefined;
  postalCode: string | undefined;
};
export default function App() {
  const [
    { values, errors, submit, formProps, hasError },
    fh,
  ] = useFormState<FormType>(
    {
      email: '',
      telephone: '',
      password: '',
      age: 0,
      money: 0,
      postalCode: '',
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

  console.log({ values });
  return (
    <View
      style={{
        flex: 1,
        marginTop: 100,
        marginLeft: 12,
        marginRight: 12,
        // alignSelf: 'center',
      }}
    >
      <Form {...formProps}>
        <TextInput
          mode="outlined"
          error={hasError('email')}
          {...fh.email('email', {
            validate: (v) => {
              //@ts-ignore
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
          {...fh.telephone('telephone', {
            validate: (v) => {
              console.log({ v });
              //@ts-ignore
              return looksLikeTelephone(v) ? true : 'Telephone is invalid';
            },
          })}
          label="Telephone"
          error={hasError('telephone')}
        />
        <TextInput
          mode="outlined"
          {...fh.text('postalCode', {
            enhance: (v) => {
              return (v as string)?.toUpperCase();
            },
            validate: (v) => {
              console.log({ v });
              //@ts-ignore
              return looksLikeTelephone(v) ? true : 'Telephone is invalid';
            },
          })}
          label="Postalcode"
          error={hasError('postalCode')}
        />
        <HelperText type="error" visible={hasError('telephone')}>
          {errors.telephone}
        </HelperText>

        <TextInput
          mode="outlined"
          {...fh.password('password', {
            required: true,
            minLength: 3,
            maxLength: 10,
          })}
          label="Password"
          error={hasError('password')}
        />
        <HelperText type="error" visible={hasError('password')}>
          {errors.password}
        </HelperText>

        <TextInput
          mode="outlined"
          {...fh.number('age', {
            required: true,
            minLength: 3,
            maxLength: 10,
          })}
          label="Age"
          error={hasError('password')}
        />
        <TextInput
          mode="outlined"
          {...fh.decimal('money', {
            required: true,
            minLength: 3,
            maxLength: 10,
          })}
          label="Money bank account"
          error={hasError('password')}
        />
        <Button mode="contained" onPress={submit} style={{ marginTop: 24 }}>
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
