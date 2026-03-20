import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/mockDataStore';

export default function LandingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const setRole = useAppStore(state => state.setCurrentRole);

  const navigateToRole = (role: 'worker' | 'insurer' | 'partner') => {
    setRole(role);
    if (role === 'worker') {
      router.push('/(worker)/dashboard' as any);
    } else {
      router.push(`/(${role})` as any);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.logoContainer}>
          <Ionicons name="shield-checkmark" size={28} color="#0F172A" />
          <Text style={styles.logoText}>PrecisePulse</Text>
        </View>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>System Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.mainWrapper, { maxWidth: isDesktop ? 1200 : '100%' }]}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Parametric Insurance for Gig Workers</Text>
          </View>
          <Text style={styles.heroTitle}>Protecting Gig Worker Income with AI-Powered Insurance</Text>
          <Text style={styles.heroSubtitle}>
            Our parametric platform covers delivery partners from income loss caused by uncontrollable external disruptions like extreme heat, heavy rain, floods, and curfews.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigateToRole('worker')}>
              <Text style={styles.primaryButtonText}>Explore Worker App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigateToRole('insurer')}>
              <Text style={styles.secondaryButtonText}>Insurer Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigateToRole('partner')}>
              <Text style={styles.secondaryButtonText}>Platform Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Value Proposition Cards */}
        <View style={styles.valuePropsGrid}>
          <ValueCard 
            icon="calendar" 
            title="Weekly Insurance Plans" 
            desc="Dynamic premiums calculated weekly based on work slots, zones, and risk history." 
          />
          <ValueCard 
            icon="flash" 
            title="Automatic Claims" 
            desc="No complex paperwork. We trigger compensation automatically when severe disruptions hit." 
          />
          <ValueCard 
            icon="map" 
            title="Hyperlocal Risk Intel" 
            desc="Green/Orange/Red grid mapping ensures route safety and accurate disruption forecasting." 
          />
          <ValueCard 
            icon="shield" 
            title="AI Fraud Detection" 
            desc="Prevents double-dipping by correlating delivery data, GPS, and risk zones." 
          />
        </View>

        {/* 3 Step Process */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={[styles.stepsContainer, { flexDirection: isDesktop ? 'row' : 'column' }]}>
            <StepCard number="1" title="Connect Data" desc="Integrate worker schedules, delivery platform APIs, and ID verification." />
            <StepCard number="2" title="Monitor Risk" desc="AI continuously monitors local weather, traffic, and social events via hexagonal grid mapping." />
            <StepCard number="3" title="Trigger Payout" desc="If an eligible safe-route worker gets caught in a severe (Red) disruption, payouts trigger immediately." />
          </View>
        </View>

      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 PrecisePulse. Built for DEVTrails Challenge.</Text>
      </View>
    </ScrollView>
  );
}

const ValueCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <View style={styles.valueCard}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={28} color="#0F172A" />
    </View>
    <Text style={styles.valueTitle}>{title}</Text>
    <Text style={styles.valueDesc}>{desc}</Text>
  </View>
);

const StepCard = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <View style={styles.stepCard}>
    <View style={styles.stepNumberContainer}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <Text style={styles.stepTitle}>{title}</Text>
    <Text style={styles.stepDesc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  navBar: {
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },
  mainWrapper: {
    width: '100%',
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 80,
    paddingHorizontal: 20,
  },
  badgeContainer: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: '#1E3A8A',
    fontWeight: '700',
    fontSize: 14,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 56 : 40,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -1.5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 28,
    marginBottom: 40,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  valuePropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
    marginBottom: 80,
  },
  valueCard: {
    width: 260,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  valueDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  stepsSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 40,
  },
  stepsContainer: {
    width: '100%',
    gap: 24,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  }
});
