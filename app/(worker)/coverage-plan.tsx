import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StickyHeader } from '../../components/StickyHeader';

export default function CoveragePlanScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'Slot-based' | 'Flexible'>('Slot-based');
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <View style={styles.container}>
      <StickyHeader title="Coverage Plan" showBackButton backHref="/(worker)/profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.modeToggle}>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'Flexible' && styles.toggleBtnActive]}
            onPress={() => setMode('Flexible')}
          >
            <Text style={[styles.toggleText, mode === 'Flexible' && styles.toggleTextActive]}>Flexible Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'Slot-based' && styles.toggleBtnActive]}
            onPress={() => setMode('Slot-based')}
          >
            <Text style={[styles.toggleText, mode === 'Slot-based' && styles.toggleTextActive]}>Slot-based</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.estimateCard}>
          <Text style={styles.estimateLabel}>ESTIMATED WEEKLY PREMIUM</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>₹180</Text>
            <Text style={styles.priceUnit}>/week</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Base Rate</Text>
            <Text style={styles.breakdownValue}>₹120</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Risk Adjustment</Text>
            <Text style={styles.breakdownValueRed}>+ ₹60</Text>
          </View>
        </View>

        {mode === 'Slot-based' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Select Working Slots</Text>
            <Text style={styles.descText}>Select your intended operational days to pre-calculate your lowest possible premium.</Text>
            <View style={styles.daysGrid}>
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                <View key={day} style={[styles.dayBox, i === 0 || i === 2 || i === 3 || i === 4 ? styles.dayBoxActive : {}]}>
                  <Text style={[styles.dayText, i === 0 || i === 2 || i === 3 || i === 4 ? styles.dayTextActive : {}]}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferred Zones</Text>
          <Text style={styles.descText}>Where do you primarily operate?</Text>
          
          <View style={styles.zoneRow}>
            <Ionicons name="location" size={20} color="#10B981" />
            <View style={styles.zoneTextCont}>
              <Text style={styles.zoneName}>Indiranagar</Text>
              <Text style={styles.zoneRiskGreen}>LOW RISK ZONE</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#0F172A" />
          </View>

          <View style={styles.zoneRow}>
            <Ionicons name="warning" size={20} color="#F59E0B" />
            <View style={styles.zoneTextCont}>
              <Text style={styles.zoneName}>Whitefield</Text>
              <Text style={styles.zoneRiskOrange}>MODERATE RISK ZONE</Text>
            </View>
            <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
          </View>
        </View>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsentGiven(!consentGiven)}>
          <Ionicons name={consentGiven ? "checkbox" : "square-outline"} size={24} color={consentGiven ? "#2563EB" : "#94A3B8"} />
          <Text style={styles.checkboxText}>
            I understand that entering known Severe Risk (Red) zones without following safe route guidance may void my active coverage.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.primaryBtn, !consentGiven && styles.primaryBtnDisabled]} 
          disabled={!consentGiven}
          onPress={() => {
            Alert.alert("Success", "Coverage plan saved for next week.");
            router.push('/(worker)/profile');
          }}
        >
          <Text style={styles.primaryBtnText}>Save Coverage Plan</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 60 },

  modeToggle: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  toggleText: { fontWeight: '600', color: '#64748B' },
  toggleTextActive: { color: '#0F172A', fontWeight: '800' },

  estimateCard: { backgroundColor: '#0F172A', borderRadius: 20, padding: 24, marginBottom: 24 },
  estimateLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  priceValue: { color: '#FFFFFF', fontSize: 40, fontWeight: '900' },
  priceUnit: { color: '#94A3B8', fontSize: 16, marginLeft: 4 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  breakdownLabel: { color: '#CBD5E1', fontSize: 14 },
  breakdownValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  breakdownValueRed: { color: '#F87171', fontSize: 14, fontWeight: '700' },

  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  descText: { fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 22 },
  
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dayBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  dayBoxActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  dayText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  dayTextActive: { color: '#FFFFFF' },

  zoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 12 },
  zoneTextCont: { flex: 1, marginLeft: 16 },
  zoneName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  zoneRiskGreen: { fontSize: 11, fontWeight: '800', color: '#10B981', marginTop: 4 },
  zoneRiskOrange: { fontSize: 11, fontWeight: '800', color: '#F59E0B', marginTop: 4 },

  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, paddingHorizontal: 4 },
  checkboxText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#475569', lineHeight: 20 },

  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  primaryBtnDisabled: { backgroundColor: '#93C5FD' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});
