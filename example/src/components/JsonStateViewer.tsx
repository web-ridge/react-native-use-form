import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { Surface } from 'react-native-paper';

interface JsonStateViewerProps {
  state: any;
}

export function JsonStateViewer({ state }: JsonStateViewerProps) {
  return (
    <Surface style={styles.jsonViewer} elevation={1}>
      <View style={styles.jsonHeader}>
        <Text style={styles.jsonTitle}>📊 Form State (Live JSON)</Text>
      </View>
      <ScrollView style={styles.jsonContent} nestedScrollEnabled>
        <Text style={styles.jsonText}>
          {JSON.stringify(
            {
              values: state.values,
              errors: state.errors,
              touched: state.touched,
              hasErrors: state.hasErrors,
              wasSubmitted: state.wasSubmitted,
            },
            null,
            2
          )}
        </Text>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  jsonViewer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1f2937',
  },
  jsonHeader: {
    marginBottom: 12,
  },
  jsonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  jsonContent: {
    maxHeight: 300,
  },
  jsonText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: '#e5e7eb',
    lineHeight: 16,
  },
});
