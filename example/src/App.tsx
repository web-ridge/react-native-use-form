import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Form, useFormState } from '../../src/index';
import { Button, Surface, TextInput, Title } from 'react-native-paper';
import TextInputWithError from './TextInputWithError';

type AddressCompany = {
  name: string;
};
type AddressType = {
  street: string;
  houseNumber: string;
  company?: AddressCompany | null;
};
type FormType = {
  email: string;
  telephone: string;
  password: string;
  age: number | undefined;
  money: number | undefined;
  postalCode: string | undefined;
  organization: {
    name: string;
    telephone: string;
    revenue: number;
  };
  address?: AddressType | null;
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
      organization: {
        name: '',
        telephone: '',
        revenue: 0,
      },
    },
    {
      onChange: () => {
        // TODO: fix enum in backend
      },
      onSubmit: (v, extra) => {
        console.log('no errors, submit!', { v, extra });
        // alert('no errors we can submit');
      },
    }
  );

  console.log({ values, errors });
  return (
    <View style={styles.root}>
      <Form {...formProps}>
        <TextInputWithError
          mode="outlined"
          error={hasError('email')}
          {...fh.email('email', {
            validate: (v) => {
              return looksLikeMail(v) ? true : 'Email-address is invalid';
            },
            label: 'Email',
          })}
        />
        <TextInputWithError
          mode="outlined"
          {...fh.telephone('telephone', {
            validate: (v) => {
              return looksLikeTelephone(v) ? true : 'Telephone is invalid';
            },
            label: 'Telephone',
          })}
        />
        <TextInputWithError
          mode="outlined"
          {...fh.text('postalCode', {
            enhance: (v) => {
              return (v || '').toUpperCase();
            },
            label: 'Postalcode',
          })}
        />

        <TextInputWithError
          mode="outlined"
          {...fh.password('password', {
            required: true,
            minLength: 3,
            maxLength: 10,
            label: 'Password',
          })}
        />

        <TextInputWithError
          mode="outlined"
          {...fh.number('age', {
            required: true,
            minLength: 3,
            maxLength: 10,
            label: 'Age',
          })}
        />
        <TextInputWithError
          mode="outlined"
          {...fh.decimal('money', {
            required: true,
            minLength: 3,
            maxLength: 10,
            label: 'Money bank account',
          })}
        />
        <TextInputWithError
          mode="outlined"
          {...fh.text('organization.telephone', {
            required: true,
            minLength: 3,
            maxLength: 10,
            validate: (v) => {
              return looksLikeTelephone(v || '')
                ? true
                : 'Telephone is invalid';
            },
            label: 'Organization telephone',
          })}
        />
        <TextInputWithError
          mode="outlined"
          {...fh.number('organization.revenue', {
            required: true,
            minLength: 3,
            maxLength: 10,
            validate: (v) => {
              if (v < 10) {
                return 'revenue too low';
              }
              return undefined;
            },
            label: 'Organization revenue',
          })}
        />
        <AddressEdit {...fh.raw('address')} />
        <AddressCompanyEdit {...fh.raw('address.company')} />
        <Button mode="contained" onPress={submit} style={{ marginTop: 24 }}>
          Save
        </Button>
      </Form>
    </View>
  );
}

function AddressEdit({
  value,
  onChange,
  ...rest
}: {
  value: AddressType | null | undefined;
  onChange: (v: AddressType | null | undefined) => void;
}) {
  const [{ formProps }, fh] = useFormState<AddressType>(
    value || { street: '', houseNumber: '', company: { name: '' } },
    {
      onChange,
    }
  );
  return (
    <Surface {...rest}>
      <Title>Nested form</Title>
      <Form {...formProps}>
        <TextInput
          mode="outlined"
          label="Street"
          {...fh.streetAddress('street')}
        />
        <TextInput
          mode="outlined"
          label="House number"
          {...fh.streetAddress('houseNumber')}
        />
      </Form>
    </Surface>
  );
}

function AddressCompanyEdit({
  value,
  onChange,
  ...rest
}: {
  value: AddressCompany | undefined | null;
  onChange: (v: AddressCompany | undefined | null) => void;
}) {
  const [{ formProps }, fh] = useFormState<AddressCompany>(
    value || { name: '' },
    {
      onChange,
    }
  );
  return (
    <Surface {...rest} style={{ padding: 12 }}>
      <Title>Nested form</Title>
      <Form {...formProps}>
        <TextInput mode="outlined" label="Street" {...fh.text('name')} />
      </Form>
    </Surface>
  );
}

function looksLikeTelephone(str: string): boolean {
  if (str.length !== 10) {
    return false;
  }
  return /^\d+$/.test(str);
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 100,
    marginLeft: 12,
    marginRight: 12,
    alignSelf: 'center',
    width: 300,
    paddingBottom: 500,
  },
});
