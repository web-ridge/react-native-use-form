import * as React from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  ScrollViewProps,
  ScrollView as ScrollViewNative,
  StyleSheet,
} from 'react-native';

export default function ScrollView({
  children,
  ...rest
}: ScrollViewProps & { children: any }) {
  if (Platform.OS === 'android') {
    return <ScrollViewNative {...rest}>{children}</ScrollViewNative>;
  }
  return (
    <KeyboardAvoidingView style={styles.full} behavior={'padding'}>
      <ScrollViewNative {...rest}>{children}</ScrollViewNative>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
});
