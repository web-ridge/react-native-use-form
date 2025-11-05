import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';

interface AdvantageItemProps {
  icon: string;
  title: string;
  description: string;
}

function AdvantageItem({ icon, title, description }: AdvantageItemProps) {
  return (
    <View style={styles.advantageItem}>
      <View style={styles.advantageIcon}>
        <Text style={styles.advantageIconText}>{icon}</Text>
      </View>
      <View style={styles.advantageContent}>
        <Text style={styles.advantageTitle}>{title}</Text>
        <Text style={styles.advantageDescription}>{description}</Text>
      </View>
    </View>
  );
}

export function LibraryAdvantages() {
  return (
    <Card style={styles.advantagesCard} elevation={2}>
      <Card.Content>
        <Title style={styles.sectionTitle}>✨ Why Choose This Library?</Title>

        <View style={styles.advantagesList}>
          <AdvantageItem
            icon="💎"
            title="Automatic Type Inference"
            description="No explicit types needed! TypeScript automatically infers all field types from your initial values"
          />
          <AdvantageItem
            icon="✅"
            title="Pre-Submit Validation"
            description="All fields are re-validated before submission, ensuring dynamic rules are applied correctly"
          />
          <AdvantageItem
            icon="🔄"
            title="Ref-Based Dynamic Validation"
            description="Change validation rules based on which button is pressed or other external factors"
          />
          <AdvantageItem
            icon="⌨️"
            title="Smart Keyboard Management"
            description="Automatic keyboard handling, scroll-to-error, and field focus management"
          />
          <AdvantageItem
            icon="🌍"
            title="Built-in i18n"
            description="Multi-language support with customizable error messages (EN, NL, and extensible)"
          />
          <AdvantageItem
            icon="⚡"
            title="Performance Optimized"
            description="Minimal re-renders with intelligent ref-based state management"
          />
          <AdvantageItem
            icon="🏷️"
            title="TypeScript First"
            description="Full type safety with dot-notation nested paths and auto-complete"
          />
          <AdvantageItem
            icon="🎯"
            title="Nested Forms"
            description="Support for deeply nested objects with validation at any level"
          />
          <AdvantageItem
            icon="🎨"
            title="Framework Agnostic"
            description="Works with any UI library - Material, Native Base, custom components"
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  advantagesCard: {
    marginTop: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  advantagesList: {
    marginTop: 16,
  },
  advantageItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  advantageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  advantageIconText: {
    fontSize: 24,
  },
  advantageContent: {
    flex: 1,
  },
  advantageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  advantageDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
