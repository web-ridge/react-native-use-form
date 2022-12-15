
<h1 align="center">
  <img src="https://user-images.githubusercontent.com/6492229/120776507-9c7f1200-c524-11eb-905e-5ad46f2c2709.png" width="128">
  <br>
  react-native-use-form
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

Simple form library for React Native with great UX for developer and end-user api and some code inspired by [wsmd/react-native-use-form](https://github.com/wsmd/react-native-use-form)


- Autoscroll to next fields with keyboard
- Validation (we will add more in built features)
- Automatically adds a lot of props e.g. when you use the telephone('telNumber') it will open up the right keyboard + autocomplete
- Email, username, password, number, numberText, decimal, decimalText,
- Great typescript support!
- Nested object with dot notation
- Nested forms
- Great decimal support with support for , notation and automatically convert it to a Number object

See a demo: https://twitter.com/RichardLindhout/status/1344009881863516165

## Installation

```sh
yarn add react-native-use-form
```
or
```sh
npm install react-native-use-form
```



## Import some localized strings
Ideally you do this somewhere in your `index.js` before `react-native-paper-dates` is used.
Currently we have en/nl/de/pl/pt/ar/ko/fr translations but it's really easy to add one extra since it are only some labels and error messages.

```tsx
// e.g in your index.js
import {
  en,
  registerTranslation,
  registerDefaultLocale
} from 'react-native-use-form'
registerTranslation('en', en)
// you can override the locale per form
registerDefaultLocale('en') // optional (default = en)
// registerTranslation('nl', nl)
```

### or register your own
Please send a PR with your language to make sure all locales are there next time
```tsx
import {
  registerTranslation,
} from 'react-native-use-form'
registerTranslation("en", {
  required: (params) => `${params.fieldKey || params.fieldKey} is required`,
  lengtShouldBeLongerThan: (params) =>
    `${params.fieldKey || params.fieldKey} length should be longer than ${
      params.requiredLength
    }`,
  lengthShouldBeShorterThan: (params) =>
    `${params.fieldKey || params.fieldKey} length should be shorter than ${
      params.requiredLength
    }`,
  shouldFollowRegex: (params) =>
    params.errorMessage ||
    `${params.fieldKey || params.fieldKey} is not in the right format`,
})
```

## Usage
```tsx

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
      locale: 'en', // optional override
      onChange: (latestValues) => {
        // optional: do something with latestValues
      },
      onSubmit: (submittedValues) => {
        // do something with submittedValues
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
        <TextInputWithError
          mode="outlined"
          {...email('email', {

            validate: (v) => {
              return looksLikeMail(v) ? true : 'Email-address is invalid';
            },
            label: "E-mail"
          })}
        />
        <TextInputWithError
          mode="outlined"
          {...telephone('telephone', {
            required: true,
            minLength: 3,
            maxLength: 10,
            shouldFollowRegexes: [telephoneRegex],
            label: "Telefoon"
          })}
        />
        <TextInputWithError
          mode="outlined"
          {...password('password', {
            required: true,
            minLength: 3,
            maxLength: 10,
            label: "Wachtwoord"
          })}
        />
        <Button mode="contained" onPress={submit}>
          Save
        </Button>
      </Form>
    </View>
  );
}



function TextInputWithError({ errorMessage, ...rest }: React.ComponentProps<typeof TextInput> & { errorMessage?: string }) {
  return (
    <>
      <TextInput {...rest} />
      <HelperText type="error" visible={rest.error}>
        {errorMessage || ' '}
      </HelperText>
    </>
  );
}


const telephoneRegex = {
  regex: new RegExp(/^\d+$/),
  errorMessage: 'Telephone is invalid',
};

// you can add your own validate functions
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

### Checkout our other libraries
- Smooth and fast cross platform Material Design date and time picker for React Native Paper: [react-native-paper-dates](https://github.com/web-ridge/react-native-paper-dates)
- Smooth and fast cross platform Material Design Tabs for React Native Paper: [react-native-paper-tabs](https://github.com/web-ridge/react-native-paper-tabs)
- Simple translations in React (Native): [react-ridge-translations](https://github.com/web-ridge/react-ridge-translations)
- Simple global state management in React (Native): [react-ridge-state](https://github.com/web-ridge/react-ridge-state)
- 1 command utility for React Native (Web) project: [create-react-native-web-application](https://github.com/web-ridge/create-react-native-web-application)

