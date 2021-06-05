
<h1 align="center">
  <img src="https://user-images.githubusercontent.com/6492229/120776507-9c7f1200-c524-11eb-905e-5ad46f2c2709.png" width="128">
  <br>
  react-native-use-form (⚠️ still in beta)
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-use-form">
    <img src="https://img.shields.io/npm/v/react-native-use-form.svg" alt="Current Release" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-use-form">
    <img src="https://badgen.net/npm/dt/react-native-use-form" alt="Downloads" />
  </a>

  <a href="https://github.com/web-ridge/react-native-use-form/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/web-ridge/react-native-use-form.svg" alt="Licence">
  </a>
</p>

Simple form library for React Native with great UX for developer and end-user api and some code based on the amazing library [wsmd/react-native-use-form](https://github.com/wsmd/react-native-use-form)


- Autoscroll to next fields with keyboard
- Validation (we will add more in built features)
- Automatically adds a lot of props e.g. when you use the telephone('telNumber') it will open up the right keyboard + autocomplete
- Email, username, password, number, numberText, decimal, decimalText,
- Typescript

See a demo: https://twitter.com/RichardLindhout/status/1344009881863516165

## Installation

```sh
yarn add react-native-use-form
```
or
```sh
npm install react-native-use-form
```

## Usage
```tsx

import * as React from 'react';

import { View } from 'react-native';
import { useFormState, Form } from '../../src/index';
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
          {...password('password', {
            required: true,
            minLength: 3,
            maxLength: 10,
          })}
          label="Wachtwoord"
          error={hasError('password')}
        />
        <HelperText type="error" visible={hasError('password')}>
          {errors.password}
        </HelperText>
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


```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
