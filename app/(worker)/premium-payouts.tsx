import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/mockDataStore';

export default function PremiumPayoutsScreen() {
  const router = useRouter();
  const workerProfile = useAppStore(state => state.workerProfile);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Economics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Weekly Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCardDark}>
            <Text style={styles.summaryLabelDark}>PREMIUM PAID</Text>
            <Text style={styles.summaryValueLight}>₹{workerProfile.activePlan.premiumPaid}</Text>
            <Text style={styles.summarySubLight}>This Week</Text>
          </View>
          <View style={styles.summaryCardLight}>
            <Text style={styles.summaryLabelLight}>TOTAL PAYOUTS</Text>
            <Text style={styles.summaryValueDark}>₹{workerProfile.totalPayoutReceived}</Text>
            <Text style={styles.summarySubDark}>All Time</Text>
          </View>
        </View>

        {/* Premium Formula Breakdown */}
        <View style={styles.formulaCard}>
          <Text style={styles.formulaTitle}>Weekly Premium Formula</Text>
          <Text style={styles.formulaDesc}>
            Your dynamic premium is calculated based on your requested coverage mode, requested zones, and the real-time AI exposure score.
          </Text>
          
          <View style={styles.mathRow}>
            <Text style={styles.mathText}>Base Rate (Slot Mode)</Text>
            <Text style={styles.mathValue}>₹120</Text>
          </View>
          <View style={styles.mathRow}>
            <Text style={styles.mathText}>Risk Multiplier (1.5x)</Text>
            <Text style={styles.mathValueRed}>+ ₹60</Text>
          </View>
          <View style={[styles.mathRow, styles.mathTotalRow]}>
            <Text style={styles.mathTotalText}>Final Premium</Text>
            <Text style={styles.mathTotalValue}>₹180</Text>
          </View>

          <TouchableOpacity style={styles.updateBtn} onPress={() => router.push('/(worker)/coverage-plan')}>
            <Text style={styles.updateBtnText}>Update Coverage Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
          <Text style={styles.downloadBtnText}>Download Statement</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  scrollContent: { padding: 20 },

  summaryGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  summaryCardDark: { flex: 1, backgroundColor: '#0F172A', padding: 24, borderRadius: 16, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  summaryLabelDark: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginBottom: 8 },
  summaryValueLight: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  summarySubLight: { fontSize: 13, color: '#64748B', fontWeight: '600' },

  summaryCardLight: { flex: 1, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  summaryLabelLight: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 1, marginBottom: 8 },
  summaryValueDark: { fontSize: 32, fontWeight: '900', color: '#10B981', marginBottom: 4 },
  summarySubDark: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },

  formulaCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  formulaTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  formulaDesc: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24 },
  
  mathRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  mathText: { fontSize: 15, color: '#475569', fontWeight: '500' },
  mathValue: { fontSize: 15, color: '#0F172A', fontWeight: '700' },
  mathValueRed: { fontSize: 15, color: '#EF4444', fontWeight: '700' },
  
  mathTotalRow: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 16, marginTop: 16, marginBottom: 24 },
  mathTotalText: { fontSize: 16, color: '#0F172A', fontWeight: '800' },
  mathTotalValue: { fontSize: 24, color: '#0F172A', fontWeight: '900' },
  
  updateBtn: { backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  updateBtnText: { color: '#0F172A', fontSize: 14, fontWeight: '700' },
  
  downloadBtn: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  downloadBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '700' }
});
