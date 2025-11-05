import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Title, Badge, Surface, Button } from 'react-native-paper';
import TextInputWithError from '../TextInputWithError';
import { JsonStateViewer } from '../components/JsonStateViewer';
import { Language } from '../types';
import { Form, useFormState } from 'react-native-use-form';

interface UserProfileDemoProps {
  locale: Language;
}

export function UserProfileDemo({ locale }: UserProfileDemoProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;

  // ✨ No explicit type needed! TypeScript infers types from initial values
  const [formState, fh] = useFormState(
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
    },
    {
      scrollViewRef,
      locale,
      onSubmit: (values) => {
        console.log('✅ Profile submitted:', values);
        alert('✅ Profile saved successfully!');
      },
    }
  );

  const formContent = (
    <View style={isLargeScreen ? styles.formColumn : styles.formFullWidth}>
      <View style={styles.formHeader}>
        <View>
          <Title style={styles.formTitle}>👤 User Profile</Title>
          <Text style={styles.formSubtitle}>Basic Validation Demo</Text>
        </View>
        <Badge style={styles.badge}>Required Fields</Badge>
      </View>

      <Surface style={styles.infoBox} elevation={1}>
        <Text style={styles.infoText}>
          💡 <Text style={styles.infoBold}>Features:</Text> Required fields,
          email validation, phone format, max length
        </Text>
      </Surface>

      <Form {...formState.formProps}>
        <TextInputWithError
          mode="outlined"
          label="First Name *"
          {...fh.firstName('firstName', {
            required: true,
            minLength: 2,
            label: 'First Name',
          })}
          style={styles.input}
        />

        <TextInputWithError
          mode="outlined"
          label="Last Name *"
          {...fh.lastName('lastName', {
            required: true,
            minLength: 2,
            label: 'Last Name',
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
              return emailRegex.test(v) || 'Please enter a valid email address';
            },
            label: 'Email',
          })}
          style={styles.input}
        />

        <TextInputWithError
          mode="outlined"
          label="Phone *"
          {...fh.telephone('phone', {
            required: true,
            validate: (v) => {
              const phoneRegex = /^\+?[\d\s\-()]+$/;
              return phoneRegex.test(v) || 'Please enter a valid phone number';
            },
            label: 'Phone',
          })}
          style={styles.input}
        />

        <TextInputWithError
          mode="outlined"
          label="Bio (optional)"
          multiline
          numberOfLines={3}
          {...fh.text('bio', {
            maxLength: 200,
            label: 'Bio',
          })}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={formState.submit}
          style={styles.submitButton}
          icon="content-save"
        >
          💾 Save Profile
        </Button>
      </Form>
    </View>
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={isLargeScreen ? styles.responsiveContainer : undefined}>
        {formContent}
        {isLargeScreen && (
          <View style={styles.jsonColumn}>
            <JsonStateViewer state={formState} />
          </View>
        )}
      </View>
      {!isLargeScreen && <JsonStateViewer state={formState} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  responsiveContainer: {
    flexDirection: 'row',
    gap: 20,
    padding: 20,
  },
  formColumn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formFullWidth: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jsonColumn: {
    width: 400,
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
