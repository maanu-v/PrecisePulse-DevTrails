import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={styles.header} entering={FadeInDown.delay(200).springify()}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>PrecisePulse</Text>
        </View>
        <Text style={styles.title}>Dynamic Risk{'\n'}Protection</Text>
        <Text style={styles.subtitle}>Smart real-time coverage tailored for your routes and environment.</Text>
      </Animated.View>

      <Animated.View style={styles.card} entering={FadeInUp.delay(500).springify()}>
        <Text style={styles.cardTitle}>Ready to begin?</Text>
        <Text style={styles.cardSubtitle}>
          Secure your income from heavy rains, floods, traffic closures, and disruptions.
        </Text>
        
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', // Slate 50
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: '#E2E8F0', // Slate 200
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#0F172A', // Slate 900
    fontWeight: '700',
    fontSize: 14,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B', // Slate 500
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF', // White
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9', // Slate 100
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#0F172A', // Navy Blue
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
