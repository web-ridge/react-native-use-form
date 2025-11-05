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

interface ArticleDemoProps {
  locale: Language;
}

export function ArticleDemo({ locale }: ArticleDemoProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const submitModeRef = useRef<'draft' | 'publish' | null>(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;

  // ✨ No explicit type needed! TypeScript infers types from initial values
  const [formState, fh] = useFormState(
    {
      title: '',
      content: '',
      category: '',
      tags: '',
    },
    {
      scrollViewRef,
      locale,
      onSubmit: (values, extra) => {
        const mode = submitModeRef.current;
        console.log(`✅ Article ${mode}ed:`, { values, extra, mode });
        alert(
          `✅ Article ${
            mode === 'publish' ? 'published' : 'saved as draft'
          } successfully!`
        );
        submitModeRef.current = null;
      },
    }
  );

  const formContent = (
    <View style={isLargeScreen ? styles.formColumn : styles.formFullWidth}>
      <View style={styles.formHeader}>
        <View>
          <Title style={styles.formTitle}>📝 Article Form</Title>
          <Text style={styles.formSubtitle}>Dynamic Validation Demo</Text>
        </View>
        <Badge style={styles.badge}>Ref-Based Validation</Badge>
      </View>

      <Surface style={styles.infoBox} elevation={1}>
        <Text style={styles.infoText}>
          💡 <Text style={styles.infoBold}>Try this:</Text> Toggle between "Save
          Draft" and "Publish". The validation rules change based on which
          button you press!
        </Text>
      </Surface>

      <Form {...formState.formProps}>
        <TextInputWithError
          mode="outlined"
          label="Article Title"
          {...fh.text('title', {
            validate: (v) => {
              const submitMode = submitModeRef.current;

              if (submitMode === 'publish') {
                if (!v || v.trim().length === 0) {
                  return 'Title is required for publishing';
                }
                if (v.length < 10) {
                  return 'Title must be at least 10 characters for publishing';
                }
                if (!/^[A-Z]/.test(v)) {
                  return 'Title must start with uppercase letter for publishing';
                }
              } else if (submitMode === 'draft') {
                if (v && v.length > 100) {
                  return 'Title too long (max 100 characters)';
                }
              }

              return true;
            },
            label: 'Article Title',
          })}
          style={styles.input}
        />

        <TextInputWithError
          mode="outlined"
          label="Content"
          multiline
          numberOfLines={4}
          {...fh.text('content', {
            validate: (v) => {
              const submitMode = submitModeRef.current;

              if (submitMode === 'publish') {
                if (!v || v.trim().length === 0) {
                  return 'Content is required for publishing';
                }
                if (v.length < 50) {
                  return 'Content must be at least 50 characters for publishing';
                }
              }

              return true;
            },
            label: 'Content',
          })}
          style={styles.input}
        />

        <TextInputWithError
          mode="outlined"
          label="Category"
          {...fh.text('category', {
            validate: (v) => {
              const submitMode = submitModeRef.current;

              if (submitMode === 'publish' && (!v || v.trim().length === 0)) {
                return 'Category is required for publishing';
              }

              return true;
            },
            label: 'Category',
          })}
          style={styles.input}
        />

        <TextInputWithError
          mode="outlined"
          label="Tags (comma separated)"
          {...fh.text('tags', {
            label: 'Tags',
          })}
          style={styles.input}
        />

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={() => {
              console.log('💾 Save as Draft pressed');
              submitModeRef.current = 'draft';
              formState.submit();
            }}
            style={styles.draftButton}
            icon="content-save"
          >
            💾 Save Draft
          </Button>

          <Button
            mode="contained"
            onPress={() => {
              console.log('🚀 Publish pressed');
              submitModeRef.current = 'publish';
              formState.submit();
            }}
            style={styles.publishButton}
            icon="publish"
          >
            🚀 Publish
          </Button>
        </View>

        <Surface style={styles.validationHintBox} elevation={0}>
          <Text style={styles.validationHint}>
            📋 <Text style={styles.hintBold}>Draft:</Text> Minimal validation,
            allows partial data
          </Text>
          <Text style={styles.validationHint}>
            🚀 <Text style={styles.hintBold}>Publish:</Text> Strict validation,
            requires complete data
          </Text>
        </Surface>
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  draftButton: {
    flex: 1,
  },
  publishButton: {
    flex: 1,
  },
  validationHintBox: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  validationHint: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 4,
  },
  hintBold: {
    fontWeight: '600',
  },
});
