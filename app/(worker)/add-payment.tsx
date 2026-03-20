import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StickyHeader } from '../../components/StickyHeader';
import { useAppStore } from '../../store/mockDataStore';

export default function AddPaymentScreen() {
  const router = useRouter();
  const addPaymentMethod = useAppStore(state => state.addPaymentMethod);

  const [type, setType] = useState<'UPI' | 'Bank Account'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleSave = () => {
    let details = '';
    if (type === 'UPI') {
      if (!upiId) return; // Add validation
      details = upiId;
    } else {
      if (!bankAccount || !ifsc) return;
      details = `${bankAccount} | ${ifsc}`;
    }

    addPaymentMethod({
      type,
      details,
      isPrimary,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <StickyHeader showBackButton title="Add Payment Method" />
      <View style={styles.content}>
        
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[styles.typeBtn, type === 'UPI' && styles.typeBtnActive]} 
            onPress={() => setType('UPI')}
          >
            <Ionicons name="phone-portrait" size={20} color={type === 'UPI' ? '#FFF' : '#64748B'} />
            <Text style={[styles.typeBtnText, type === 'UPI' && styles.typeBtnTextActive]}>UPI ID</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeBtn, type === 'Bank Account' && styles.typeBtnActive]} 
            onPress={() => setType('Bank Account')}
          >
            <Ionicons name="briefcase" size={20} color={type === 'Bank Account' ? '#FFF' : '#64748B'} />
            <Text style={[styles.typeBtnText, type === 'Bank Account' && styles.typeBtnTextActive]}>Bank Account</Text>
          </TouchableOpacity>
        </View>

        {type === 'UPI' ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>UPI ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. user@oksbi"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
          </View>
        ) : (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                value={bankAccount}
                onChangeText={setBankAccount}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="SBIN0000000"
                value={ifsc}
                onChangeText={setIfsc}
                autoCapitalize="characters"
              />
            </View>
          </>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Set as Primary</Text>
          <Switch
            value={isPrimary}
            onValueChange={setIsPrimary}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isPrimary ? '#2563EB' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Payment Method</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24 },
  
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  typeBtnActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeBtnText: {
    fontWeight: '600',
    color: '#64748B',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },

  formGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },

  saveBtn: {
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
