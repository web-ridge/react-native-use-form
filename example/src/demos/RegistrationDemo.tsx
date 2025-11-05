import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Badge, Surface, Button } from 'react-native-paper';
import TextInputWithError from '../TextInputWithError';
import { JsonStateViewer } from '../components/JsonStateViewer';
import { Language } from '../types';
import { Form, useFormState } from 'react-native-use-form';

interface RegistrationDemoProps {
  locale: Language;
}

export function RegistrationDemo({ locale }: RegistrationDemoProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // ✨ No explicit type needed! TypeScript infers types from initial values
  const [formState, fh] = useFormState(
    {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: undefined as number | undefined,
      acceptTerms: '',
    },
    {
      scrollViewRef,
      locale,
      onSubmit: (values) => {
        console.log('✅ Registration successful:', values);
        alert(`✅ Welcome ${values.username}! Registration complete.`);
      },
    }
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.formCard} elevation={3}>
        <Card.Content>
          <View style={styles.formHeader}>
            <View>
              <Title style={styles.formTitle}>🔐 Registration Form</Title>
              <Text style={styles.formSubtitle}>
                Cross-field Validation Demo
              </Text>
            </View>
            <Badge style={styles.badge}>Advanced Validation</Badge>
          </View>

          <Surface style={styles.infoBox} elevation={1}>
            <Text style={styles.infoText}>
              💡 <Text style={styles.infoBold}>Features:</Text> Password
              matching, regex patterns, cross-field validation
            </Text>
          </Surface>

          <Form {...formState.formProps}>
            <TextInputWithError
              mode="outlined"
              label="Username *"
              {...fh.username('username', {
                required: true,
                minLength: 3,
                maxLength: 20,
                shouldFollowRegexes: [
                  {
                    regex: /^[a-zA-Z0-9_]+$/,
                    errorMessage:
                      'Username can only contain letters, numbers, and underscores',
                  },
                ],
                label: 'Username',
              })}
              style={styles.input}
            />

            <TextInputWithError
              mode="outlined"
              label="Email *"
              {...fh.email('email', {
                required: true,
                validate: (v) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return emailRegex.test(v) || 'Invalid email format';
                },
                label: 'Email',
              })}
              style={styles.input}
            />

            <TextInputWithError
              mode="outlined"
              label="Password *"
              {...fh.password('password', {
                required: true,
                minLength: 8,
                validate: (v) => {
                  if (!/[A-Z]/.test(v)) {
                    return 'Password must contain at least one uppercase letter';
                  }
                  if (!/[a-z]/.test(v)) {
                    return 'Password must contain at least one lowercase letter';
                  }
                  if (!/[0-9]/.test(v)) {
                    return 'Password must contain at least one number';
                  }
                  return true;
                },
                label: 'Password',
              })}
              style={styles.input}
            />

            <TextInputWithError
              mode="outlined"
              label="Confirm Password *"
              {...fh.password('confirmPassword', {
                required: true,
                validate: (v, allValues) => {
                  if (v !== allValues.password) {
                    return 'Passwords do not match';
                  }
                  return true;
                },
                label: 'Confirm Password',
              })}
              style={styles.input}
            />

            <TextInputWithError
              mode="outlined"
              label="Age *"
              {...fh.number('age', {
                required: true,
                validate: (v) => {
                  if (!v || v < 13) {
                    return 'You must be at least 13 years old';
                  }
                  if (v > 120) {
                    return 'Please enter a valid age';
                  }
                  return true;
                },
                label: 'Age',
              })}
              style={styles.input}
            />

            <TextInputWithError
              mode="outlined"
              label="Type 'I ACCEPT' to agree to terms *"
              {...fh.text('acceptTerms', {
                required: true,
                validate: (v) => {
                  if (v.toUpperCase() !== 'I ACCEPT') {
                    return 'You must type "I ACCEPT" to continue';
                  }
                  return true;
                },
                label: 'Terms Acceptance',
              })}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={formState.submit}
              style={styles.submitButton}
              icon="account-plus"
            >
              🔐 Register Account
            </Button>

            <JsonStateViewer state={formState} />
          </Form>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  formCard: {
    marginBottom: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  badge: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});
