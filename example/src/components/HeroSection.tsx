import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title, Paragraph, Chip } from 'react-native-paper';

export function HeroSection() {
  return (
    <Surface style={styles.heroSection} elevation={4}>
      <Title style={styles.heroTitle}>⚡ React Native Use Form</Title>
      <Paragraph style={styles.heroSubtitle}>
        Type-safe, powerful, and flexible form library for React Native
      </Paragraph>

      <View style={styles.featuresGrid}>
        <Chip
          icon="fire"
          style={styles.featureChip}
          textStyle={styles.chipText}
        >
          Auto Type Inference
        </Chip>
        <Chip
          icon="shield-check"
          style={styles.featureChip}
          textStyle={styles.chipText}
        >
          Pre-submit Validation
        </Chip>
        <Chip icon="cog" style={styles.featureChip} textStyle={styles.chipText}>
          Dynamic Validation
        </Chip>
        <Chip icon="eye" style={styles.featureChip} textStyle={styles.chipText}>
          Real-time Errors
        </Chip>
        <Chip
          icon="code-braces"
          style={styles.featureChip}
          textStyle={styles.chipText}
        >
          TypeScript
        </Chip>
        <Chip
          icon="translate"
          style={styles.featureChip}
          textStyle={styles.chipText}
        >
          i18n Support
        </Chip>
        <Chip
          icon="keyboard"
          style={styles.featureChip}
          textStyle={styles.chipText}
        >
          Smart Keyboard
        </Chip>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    padding: 32,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#6366f1',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  featureChip: {
    backgroundColor: '#e0e7ff',
    margin: 4,
  },
  chipText: {
    fontSize: 12,
  },
});
