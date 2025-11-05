import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Divider } from 'react-native-paper';

export function SEOArticle() {
  return (
    <Card style={styles.articleCard} elevation={1}>
      <Card.Content>
        <Text style={styles.mainTitle}>
          The Ultimate React Native Form Library: Type-Safe, Dynamic Validation,
          and Developer-Friendly
        </Text>

        <Text style={styles.intro}>
          Building forms in React Native can be challenging. Between managing
          form state, implementing validation logic, handling keyboard
          interactions, and ensuring type safety with TypeScript, developers
          often spend countless hours reinventing the wheel.{' '}
          <Text style={styles.bold}>react-native-use-form</Text> is here to
          change that.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🎯 Why Choose react-native-use-form Over Other Form Libraries?
          </Text>
          <Text style={styles.paragraph}>
            Unlike other React Native form libraries like Formik, React Hook
            Form (which is primarily web-focused), or react-native-form-builder,
            our library is specifically designed for React Native with
            mobile-first features:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              ✨{' '}
              <Text style={styles.bulletBold}>Automatic Type Inference:</Text>{' '}
              No need to define explicit TypeScript types for your forms. The
              library intelligently infers all field types from your initial
              values, reducing boilerplate code by up to 60%.
            </Text>

            <Text style={styles.bullet}>
              🔄{' '}
              <Text style={styles.bulletBold}>Dynamic Validation Rules:</Text>{' '}
              Change validation requirements based on user actions (like "Save
              Draft" vs "Publish"). Perfect for multi-step forms, conditional
              fields, and complex business logic.
            </Text>

            <Text style={styles.bullet}>
              🛡️ <Text style={styles.bulletBold}>Pre-Submit Validation:</Text>{' '}
              All fields are re-validated immediately before submission,
              ensuring no stale validation states slip through - a common bug in
              many form libraries.
            </Text>

            <Text style={styles.bullet}>
              ⌨️{' '}
              <Text style={styles.bulletBold}>Smart Keyboard Management:</Text>{' '}
              Automatic keyboard dismissal, scroll-to-error functionality, and
              next/submit button handling built-in - no manual ScrollView
              configuration needed.
            </Text>

            <Text style={styles.bullet}>
              🌍 <Text style={styles.bulletBold}>Built-in i18n Support:</Text>{' '}
              Multi-language error messages out of the box (English, Dutch, and
              easily extensible). Unlike other libraries where you need
              third-party plugins for internationalization.
            </Text>

            <Text style={styles.bullet}>
              🎨 <Text style={styles.bulletBold}>UI Framework Agnostic:</Text>{' '}
              Works seamlessly with React Native Paper, Native Base, UI Kitten,
              or your custom components. No vendor lock-in.
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📱 Perfect for Mobile-First Applications
          </Text>
          <Text style={styles.paragraph}>
            Mobile forms have unique challenges: limited screen space, touch
            inputs, virtual keyboards, and varying screen sizes.
            react-native-use-form addresses all of these:
          </Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>📐 Nested Object Support</Text>
              <Text style={styles.featureText}>
                Handle complex data structures like billing addresses, user
                profiles, and settings with dot-notation paths:{' '}
                <Text style={styles.code}>billingAddress.street</Text>
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>⚡ Performance Optimized</Text>
              <Text style={styles.featureText}>
                Minimal re-renders using ref-based state management. Forms with
                50+ fields remain buttery smooth.
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>🎯 Auto-Formatting</Text>
              <Text style={styles.featureText}>
                Built-in formatters for credit cards, phone numbers, postal
                codes - apply formatting as users type.
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>🔍 Cross-Field Validation</Text>
              <Text style={styles.featureText}>
                Validate fields based on other field values (password
                confirmation, date ranges, conditional requirements).
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Real-World Use Cases</Text>

          <Text style={styles.useCaseTitle}>E-commerce Checkout Forms</Text>
          <Text style={styles.paragraph}>
            Perfect for multi-step checkout flows with shipping address, billing
            details, and payment information. Dynamic validation ensures users
            provide correct information based on their selections (e.g.,
            different validation rules for business vs. personal shipping).
          </Text>

          <Text style={styles.useCaseTitle}>
            User Registration & Onboarding
          </Text>
          <Text style={styles.paragraph}>
            Create smooth registration experiences with password strength
            validation, email verification, phone number formatting, and profile
            photo uploads. Pre-submit validation prevents frustrating "fix these
            errors" moments after submission.
          </Text>

          <Text style={styles.useCaseTitle}>Content Management Systems</Text>
          <Text style={styles.paragraph}>
            Build admin panels and CMS interfaces with draft/publish workflows.
            The ref-based dynamic validation feature shines here - relaxed
            validation for drafts, strict validation for publishing.
          </Text>

          <Text style={styles.useCaseTitle}>Financial Applications</Text>
          <Text style={styles.paragraph}>
            Handle sensitive data with confidence. Built-in formatters for
            currency, account numbers, and routing numbers. Validation ensures
            compliance with financial data standards.
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Getting Started is Simple</Text>
          <Text style={styles.paragraph}>
            Unlike complex form libraries with steep learning curves,
            react-native-use-form has an intuitive API:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {`// No explicit types needed!\nconst [formState, fh] = useFormState({\n  email: '',\n  password: '',\n});\n\n// Full TypeScript autocomplete works automatically!`}
            </Text>
          </View>

          <Text style={styles.paragraph}>
            That's it! You get full TypeScript support, validation, error
            handling, and keyboard management with just a few lines of code.
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🏆 Comparison with Popular Alternatives
          </Text>

          <View style={styles.comparisonTable}>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>
                Automatic Type Inference
              </Text>
              <Text style={styles.comparisonYes}>✅ react-native-use-form</Text>
              <Text style={styles.comparisonNo}>
                ❌ Formik, React Hook Form
              </Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>
                Pre-Submit Validation
              </Text>
              <Text style={styles.comparisonYes}>✅ react-native-use-form</Text>
              <Text style={styles.comparisonPartial}>⚠️ Formik (manual)</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>
                Mobile Keyboard Handling
              </Text>
              <Text style={styles.comparisonYes}>✅ Built-in</Text>
              <Text style={styles.comparisonNo}>
                ❌ Manual implementation needed
              </Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>
                Ref-Based Dynamic Validation
              </Text>
              <Text style={styles.comparisonYes}>✅ First-class support</Text>
              <Text style={styles.comparisonNo}>❌ Not available</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>
                Bundle Size (minified)
              </Text>
              <Text style={styles.comparisonYes}>
                ~12KB react-native-use-form
              </Text>
              <Text style={styles.comparisonPartial}>
                ~40KB+ React Hook Form
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🎓 Developer Experience Matters
          </Text>
          <Text style={styles.paragraph}>
            We believe great tools should feel invisible. That's why
            react-native-use-form focuses on:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              📚{' '}
              <Text style={styles.bulletBold}>
                Comprehensive Documentation:
              </Text>{' '}
              Every feature is documented with real-world examples, not just API
              references.
            </Text>

            <Text style={styles.bullet}>
              💻 <Text style={styles.bulletBold}>TypeScript-First Design:</Text>{' '}
              Full type safety with intelligent autocomplete. Catch errors at
              compile-time, not runtime.
            </Text>

            <Text style={styles.bullet}>
              🧪 <Text style={styles.bulletBold}>Battle-Tested:</Text> Used in
              production apps with millions of users. We've solved the edge
              cases you haven't encountered yet.
            </Text>

            <Text style={styles.bullet}>
              🔄 <Text style={styles.bulletBold}>Active Maintenance:</Text>{' '}
              Regular updates, bug fixes, and new features. We listen to
              community feedback.
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Community & Support</Text>
          <Text style={styles.paragraph}>
            Join thousands of React Native developers who have simplified their
            form handling. Whether you're building a startup MVP, enterprise
            application, or side project, react-native-use-form scales with your
            needs.
          </Text>

          <Text style={styles.paragraph}>
            Visit our GitHub repository for installation instructions, browse
            the interactive demos above to see the library in action, and join
            our community to share your experiences and get help when needed.
          </Text>
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>
            Ready to Transform Your Form Development?
          </Text>
          <Text style={styles.ctaText}>
            Explore the interactive demos above to see features like dynamic
            validation, automatic type inference, and mobile-optimized keyboard
            handling in action. Start building better forms today!
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  articleCard: {
    marginTop: 20,
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 36,
    marginBottom: 20,
  },
  intro: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 26,
    marginBottom: 24,
  },
  bold: {
    fontWeight: '700',
    color: '#1f2937',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 30,
  },
  paragraph: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletList: {
    marginTop: 12,
    gap: 14,
  },
  bullet: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
    paddingLeft: 8,
  },
  bulletBold: {
    fontWeight: '700',
    color: '#1f2937',
  },
  divider: {
    marginVertical: 28,
    backgroundColor: '#e5e7eb',
  },
  featureGrid: {
    gap: 16,
    marginTop: 16,
  },
  featureItem: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#6366f1',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  useCaseTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#e5e7eb',
    lineHeight: 20,
  },
  comparisonTable: {
    marginTop: 16,
    gap: 12,
  },
  comparisonRow: {
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 8,
    gap: 6,
  },
  comparisonFeature: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  comparisonYes: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  comparisonNo: {
    fontSize: 14,
    color: '#dc2626',
  },
  comparisonPartial: {
    fontSize: 14,
    color: '#d97706',
  },
  cta: {
    backgroundColor: '#eff6ff',
    padding: 24,
    borderRadius: 12,
    marginTop: 28,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 15,
    color: '#1e40af',
    lineHeight: 24,
  },
});
