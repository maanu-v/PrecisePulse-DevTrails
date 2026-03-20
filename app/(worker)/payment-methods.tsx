import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StickyHeader } from '../../components/StickyHeader';
import { useAppStore } from '../../store/mockDataStore';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const paymentMethods = useAppStore(state => state.paymentMethods);
  const setPrimary = useAppStore(state => state.setPrimaryPaymentMethod);
  const removePaymentMethod = useAppStore(state => state.removePaymentMethod);

  return (
    <View style={styles.container}>
      <StickyHeader title="Payment Methods" showBackButton backHref="/(worker)/profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Manage your payout accounts</Text>

        <TouchableOpacity 
          style={styles.addCard}
          onPress={() => router.push('/(worker)/add-payment')}
        >
          <View style={styles.addIconBg}>
            <Ionicons name="add" size={24} color="#2563EB" />
          </View>
          <Text style={styles.addText}>Add New Payment Method</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Accounts</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={[styles.methodCard, method.isPrimary && styles.methodCardPrimary]}
            onPress={() => setPrimary(method.id)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, method.isPrimary ? styles.typeBadgePrimary : styles.typeBadgeSecondary]}>
                <Ionicons 
                  name={method.type === 'UPI' ? 'phone-portrait' : 'briefcase'} // Using briefcase for Bank as placeholder
                  size={14} 
                  color={method.isPrimary ? '#2563EB' : '#64748B'} 
                />
                <Text style={[styles.typeText, method.isPrimary ? styles.typeTextPrimary : styles.typeTextSecondary]}>
                  {method.type}
                </Text>
              </View>
              {method.isPrimary && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryText}>PRIMARY</Text>
                </View>
              )}
            </View>

            <Text style={styles.detailsText}>{method.details}</Text>

            <View style={styles.cardFooter}>
              {!method.isPrimary && (
                <TouchableOpacity onPress={() => removePaymentMethod(method.id)} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>Remove</Text>
                </TouchableOpacity>
              )}
              {method.isPrimary ? (
                 <View style={styles.verifiedRow}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verified for Payouts</Text>
                 </View>
              ) : (
                <Text style={styles.setPrimaryPrompt}>Tap to set as primary</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#64748B" />
          <Text style={styles.infoText}>
            Payouts are automatically processed to your primary payment method every Monday.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 4, marginBottom: 24 },
  
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  addIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  methodCardPrimary: {
    borderColor: '#3B82F6',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  typeBadgePrimary: { backgroundColor: '#EFF6FF' },
  typeBadgeSecondary: { backgroundColor: '#F1F5F9' },
  typeText: { fontSize: 12, fontWeight: '700' },
  typeTextPrimary: { color: '#2563EB' },
  typeTextSecondary: { color: '#64748B' },
  
  primaryBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  detailsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  deleteBtn: {},
  deleteText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  setPrimaryPrompt: { color: '#64748B', fontSize: 13, fontStyle: 'italic' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verifiedText: { color: '#059669', fontSize: 13, fontWeight: '600' },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 12,
  },
  infoText: { flex: 1, fontSize: 13, color: '#64748B', lineHeight: 20 },
});
