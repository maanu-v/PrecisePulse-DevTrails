import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore, Role } from '../store/mockDataStore';

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const setRole = useAppStore(state => state.setCurrentRole);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('worker');

  const isDesktop = width > 768;

  const handleDemoLogin = (role: Role) => {
    setRole(role);
    if (role === 'worker') {
      router.replace('/(worker)/dashboard' as any);
    } else {
      router.replace(`/(${role})` as any);
    }
  };

  const handleStandardLogin = () => {
    handleDemoLogin(selectedRole);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>System Access</Text>
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
            {(['worker', 'insurer', 'partner'] as Role[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleChip, selectedRole === r && styles.roleChipActive]}
                onPress={() => setSelectedRole(r)}
              >
                <Text style={[styles.roleChipText, selectedRole === r && styles.roleChipTextActive]}>
                  {r!.charAt(0).toUpperCase() + r!.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleStandardLogin}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR DEMO ACCESS</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.demoButtonsContainer}>
            <TouchableOpacity style={styles.demoButtonWorker} onPress={() => handleDemoLogin('worker')}>
              <Ionicons name="bicycle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.demoButtonTextWorker}>Login as Delivery Partner</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoButtonInsurer} onPress={() => handleDemoLogin('insurer')}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.demoButtonTextInsurer}>Login as Insurer Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoButtonPartner} onPress={() => handleDemoLogin('partner')}>
              <Ionicons name="business" size={20} color="#0F172A" style={styles.buttonIcon} />
              <Text style={styles.demoButtonTextPartner}>Login as Platform Admin</Text>
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
    marginBottom: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
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
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roleChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  roleChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  roleChipTextActive: {
    color: '#1D4ED8',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  demoButtonsContainer: {
    gap: 12,
  },
  demoButtonWorker: {
    flexDirection: 'row',
    backgroundColor: '#2563EB', // Blue
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonTextWorker: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoButtonInsurer: {
    flexDirection: 'row',
    backgroundColor: '#059669', // Green
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonTextInsurer: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoButtonPartner: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9', // Gray/White
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonTextPartner: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 8,
  }
});
