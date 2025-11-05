import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Title,
  Badge,
  Surface,
  Button,
  Divider,
} from 'react-native-paper';
import TextInputWithError from '../TextInputWithError';
import { JsonStateViewer } from '../components/JsonStateViewer';
import { Language } from '../types';
import { Form, useFormState } from 'react-native-use-form';

interface PaymentDemoProps {
  locale: Language;
}

export function PaymentDemo({ locale }: PaymentDemoProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // ✨ No explicit type needed! TypeScript infers nested object structure from initial values
  const [formState, fh] = useFormState(
    {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      amount: undefined as number | undefined,
      billingAddress: {
        street: '',
        city: '',
        zipCode: '',
      },
    },
    {
      scrollViewRef,
      locale,
      onSubmit: (values) => {
        console.log('✅ Payment processed:', values);
        alert(`✅ Payment of $${values.amount} processed successfully!`);
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
              <Title style={styles.formTitle}>💳 Payment Form</Title>
              <Text style={styles.formSubtitle}>
                Nested Objects & Auto-Format
              </Text>
            </View>
            <Badge style={styles.badge}>Nested Validation</Badge>
          </View>

          <Surface style={styles.infoBox} elevation={1}>
            <Text style={styles.infoText}>
              💡 <Text style={styles.infoBold}>Features:</Text> Nested objects
              (billingAddress.*), auto-formatting, complex validation
            </Text>
          </Surface>

          <Form {...formState.formProps}>
            <TextInputWithError
              mode="outlined"
              label="Card Number *"
              {...fh.text('cardNumber', {
                required: true,
                validate: (v) => {
                  const cleaned = v.replace(/\s/g, '');
                  if (!/^\d{16}$/.test(cleaned)) {
                    return 'Card number must be 16 digits';
                  }
                  return true;
                },
                enhance: (v) => {
                  return v
                    .replace(/\s/g, '')
                    .replace(/(\d{4})/g, '$1 ')
                    .trim();
                },
                label: 'Card Number',
              })}
              style={styles.input}
            />

            <View style={styles.cardDetailsRow}>
              <TextInputWithError
                mode="outlined"
                label="MM/YY *"
                {...fh.text('expiryDate', {
                  required: true,
                  validate: (v) => {
                    if (!/^\d{2}\/\d{2}$/.test(v)) {
                      return 'Format: MM/YY';
                    }
                    const parts = v.split('/').map(Number);
                    const month = parts[0];
                    const year = parts[1];
                    if (!month || !year || month < 1 || month > 12) {
                      return 'Invalid month';
                    }
                    const currentYear = new Date().getFullYear() % 100;
                    if (year < currentYear) {
                      return 'Card expired';
                    }
                    return true;
                  },
                  enhance: (v) => {
                    const cleaned = v.replace(/\D/g, '');
                    if (cleaned.length >= 2) {
                      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
                    }
                    return cleaned;
                  },
                  label: 'Expiry Date',
                })}
                style={[styles.input, styles.halfWidth]}
              />

              <TextInputWithError
                mode="outlined"
                label="CVV *"
                {...fh.text('cvv', {
                  required: true,
                  validate: (v) => {
                    if (!/^\d{3,4}$/.test(v)) {
                      return 'CVV must be 3-4 digits';
                    }
                    return true;
                  },
                  label: 'CVV',
                })}
                style={[styles.input, styles.halfWidth]}
                secureTextEntry
              />
            </View>

            <TextInputWithError
              mode="outlined"
              label="Amount *"
              {...fh.decimal('amount', {
                required: true,
                validate: (v) => {
                  if (!v || v <= 0) {
                    return 'Amount must be greater than 0';
                  }
                  if (v > 10000) {
                    return 'Amount too large (max $10,000)';
                  }
                  return true;
                },
                label: 'Amount',
              })}
              style={styles.input}
            />

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Billing Address</Text>

            <TextInputWithError
              mode="outlined"
              label="Street Address *"
              {...fh.streetAddress('billingAddress.street', {
                required: true,
                label: 'Street Address',
              })}
              style={styles.input}
            />

            <View style={styles.addressRow}>
              <TextInputWithError
                mode="outlined"
                label="City *"
                {...fh.city('billingAddress.city', {
                  required: true,
                  label: 'City',
                })}
                style={[styles.input, styles.halfWidth]}
              />

              <TextInputWithError
                mode="outlined"
                label="ZIP Code *"
                {...fh.postalCode('billingAddress.zipCode', {
                  required: true,
                  validate: (v) => {
                    if (!/^\d{5}(-\d{4})?$/.test(v)) {
                      return 'Invalid ZIP code (use 12345 or 12345-6789)';
                    }
                    return true;
                  },
                  label: 'ZIP Code',
                })}
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <Button
              mode="contained"
              onPress={formState.submit}
              style={styles.submitButton}
              icon="credit-card"
            >
              💳 Process Payment
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
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  divider: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});
