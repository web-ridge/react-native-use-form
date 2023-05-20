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
export default function App() {
  const scrollViewRef = useRef(null);
  const [{ submit, formProps, hasError }, fh] = useFormState(
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
  return React.createElement(
    SafeAreaProvider,
    null,
    React.createElement(
      View,
      { style: styles.root },
      React.createElement(
        Appbar.Header,
        null,
        React.createElement(Appbar.Content, { title: 'Form' })
      ),
      React.createElement(
        ScrollView,
        { style: styles.scrollView, ref: scrollViewRef },
        React.createElement(
          View,
          { style: styles.inner },
          React.createElement(
            Form,
            Object.assign({}, formProps),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined', error: hasError('email') },
                fh.email('email', {
                  validate: (v) => {
                    return looksLikeMail(v) ? true : 'Email-address is invalid';
                  },
                  label: 'Email',
                })
              )
            ),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined' },
                fh.telephone('telephone', {
                  required: true,
                  minLength: 3,
                  maxLength: 10,
                  shouldFollowRegexes: [telephoneRegex],
                  label: 'Telephone',
                })
              )
            ),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined' },
                fh.text('postalCode', {
                  enhance: (v) => {
                    return (v || '').toUpperCase();
                  },
                  label: 'Postalcode',
                })
              )
            ),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined' },
                fh.password('password', {
                  required: true,
                  minLength: 3,
                  maxLength: 10,
                  label: 'Password',
                })
              )
            ),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined' },
                fh.number('age', {
                  required: true,
                  minLength: 3,
                  maxLength: 10,
                  label: 'Age',
                })
              )
            ),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined' },
                fh.decimal('money', {
                  required: true,
                  minLength: 3,
                  maxLength: 10,
                  label: 'Money bank account',
                })
              )
            ),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined' },
                fh.text('organization.telephone', {
                  required: true,
                  minLength: 3,
                  maxLength: 10,
                  shouldFollowRegexes: [telephoneRegex],
                  label: 'Organization telephone',
                })
              )
            ),
            React.createElement(
              TextInputWithError,
              Object.assign(
                { mode: 'outlined' },
                fh.number('organization.revenue', {
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
                })
              )
            ),
            React.createElement(
              AddressEdit,
              Object.assign({}, fh.raw('address'))
            ),
            React.createElement(
              AddressCompanyEdit,
              Object.assign({}, fh.raw('address.company'))
            ),
            React.createElement(
              Button,
              { mode: 'contained', onPress: submit, style: { marginTop: 24 } },
              'Save'
            )
          )
        )
      )
    )
  );
}
function AddressEdit({ value, onChange, ...rest }) {
  const [{ formProps }, fh] = useFormState(
    value || { street: '', houseNumber: '', company: { name: '' } },
    {
      onChange,
    }
  );
  return React.createElement(
    Surface,
    Object.assign({}, rest),
    React.createElement(Title, null, 'Nested form'),
    React.createElement(
      Form,
      Object.assign({}, formProps),
      React.createElement(
        TextInputWithError,
        Object.assign(
          { mode: 'outlined', label: 'Street' },
          fh.streetAddress('street', { required: true })
        )
      ),
      React.createElement(
        TextInputWithError,
        Object.assign(
          { mode: 'outlined', label: 'House number' },
          fh.streetAddress('houseNumber')
        )
      )
    )
  );
}
function AddressCompanyEdit({ value, onChange, ...rest }) {
  const [{ formProps }, fh] = useFormState(value || { name: '' }, {
    onChange,
  });
  return React.createElement(
    Surface,
    Object.assign({}, rest, { style: { padding: 12 } }),
    React.createElement(Title, null, 'Nested form'),
    React.createElement(
      Form,
      Object.assign({}, formProps),
      React.createElement(
        TextInputWithError,
        Object.assign({ mode: 'outlined', label: 'Street' }, fh.text('name'))
      )
    )
  );
}
const telephoneRegex = {
  regex: new RegExp(/^\d+$/),
  errorMessage: 'Telephone is invalid',
};
function looksLikeMail(str) {
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
