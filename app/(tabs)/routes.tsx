import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RoutesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safe Routes</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.placeholderCard}>
          <Ionicons name="navigate" size={64} color="#CBD5E1" />
          <Text style={styles.placeholderText}>Route Guidance</Text>
          <Text style={styles.placeholderSubtext}>Feature coming soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 15,
    color: '#64748B',
  },
});
