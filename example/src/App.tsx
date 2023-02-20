import * as React from 'react';

import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
  registerTranslation,
  en,
  Form,
  useFormState,
} from 'react-native-use-form';
import { Appbar, Button, Surface, Title } from 'react-native-paper';
import TextInputWithError from './TextInputWithError';
import { useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

registerTranslation('en', en);
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
  const scrollViewRef = useRef<ScrollView>(null);
  const [{ submit, formProps, hasError }, fh] = useFormState<FormType>(
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
      scrollViewRef: scrollViewRef,
      onChange: () => {
        // TODO: fix enum in backend
      },
      onSubmit: (v, extra) => {
        console.log('no errors, submit!', { v, extra });
        // alert('no errors we can submit');
      },
    }
  );

  // console.log({ values, errors });
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <Appbar.Header>
          <Appbar.Content title="Form" />
        </Appbar.Header>
        <ScrollView style={styles.scrollView} ref={scrollViewRef}>
          <View style={styles.inner}>
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
                  required: true,
                  minLength: 3,
                  maxLength: 10,
                  shouldFollowRegexes: [telephoneRegex],
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
                  shouldFollowRegexes: [telephoneRegex],
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
              <Button
                mode="contained"
                onPress={submit}
                style={{ marginTop: 24 }}
              >
                Save
              </Button>
            </Form>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
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
        <TextInputWithError
          mode="outlined"
          label="Street"
          {...fh.streetAddress('street', { required: true })}
        />
        <TextInputWithError
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
        <TextInputWithError
          mode="outlined"
          label="Street"
          {...fh.text('name')}
        />
      </Form>
    </Surface>
  );
}

const telephoneRegex = {
  regex: new RegExp(/^\d+$/),
  errorMessage: 'Telephone is invalid',
};

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
  root: { flex: 1, maxHeight: Platform.OS === 'web' ? '100vh' : undefined },
  scrollView: {
    flex: 1,
  },
  inner: {
    marginTop: 100,
    marginLeft: 12,
    marginRight: 12,
    alignSelf: 'center',
    width: 300,
    paddingBottom: 500,
  },
});
