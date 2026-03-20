import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { StickyHeader } from '../components/StickyHeader';
import { Role, useAppStore } from '../store/mockDataStore';

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const setRole = useAppStore(state => state.setCurrentRole);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('worker');

  const isDesktop = width > 768;

  const handleRoleLogin = (role: Role) => {
    setRole(role);
    if (role === 'worker') {
      router.replace('/(worker)/dashboard' as any);
    } else {
      router.replace(`/(${role})` as any);
    }
  };

  const handleStandardLogin = () => {
    handleRoleLogin(selectedRole);
  };

  const roleLabelMap: Record<Exclude<Role, null>, string> = {
    worker: 'Delivery Partner',
    insurer: 'Insurer Admin',
    partner: 'Platform Admin',
  };

  const roleStyles: Record<Exclude<Role, null>, { bg: string, border: string, text: string, icon: any }> = {
    worker: { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8', icon: 'bicycle' },
    insurer: { bg: '#ECFDF5', border: '#10B981', text: '#047857', icon: 'shield-checkmark' },
    partner: { bg: '#F5F3FF', border: '#8B5CF6', text: '#6D28D9', icon: 'business' }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StickyHeader showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Removed local back button */}

        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to manage your parametric coverage</Text>
        </View>

        <View style={[styles.mainCard, { width: isDesktop ? 480 : '100%' }]}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="partner@example.com"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Select Role</Text>
          <View style={styles.roleSelector}>
            {(['worker', 'insurer', 'partner'] as const).map((r) => {
              const isSelected = selectedRole === r;
              const config = roleStyles[r];
              
              return (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roleChip, 
                    isSelected && { 
                      backgroundColor: config.bg, 
                      borderColor: config.border,
                      ...Platform.select({
                        ios: {
                          shadowColor: config.border,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 6,
                        },
                        android: {
                          elevation: 4,
                        },
                        web: {
                          boxShadow: `0 4px 6px -1px ${config.border}33`,
                        }
                      })
                    }
                  ]}
                  onPress={() => setSelectedRole(r)}
                >
                  <Ionicons 
                    name={config.icon} 
                    size={24} 
                    color={isSelected ? config.text : '#94A3B8'} 
                    style={{ marginBottom: 6 }}
                  />
                  <Text style={[
                      styles.roleChipText, 
                      isSelected && { color: config.text, fontWeight: '800' }
                    ]}>
                    {roleLabelMap[r]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleStandardLogin}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup' as any)}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A8A',
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 24,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 15,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 15,
  },
});
