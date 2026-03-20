import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/mockDataStore';

export default function FraudDetectionScreen() {
  const claims = useAppStore(state => state.claims);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>AI Fraud Detection</Text>

      <View style={styles.alertBanner}>
        <Ionicons name="warning" size={24} color="#B91C1C" />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>3 Suspicious Anomalies Detected</Text>
          <Text style={styles.alertDesc}>Automated route matching indicates GPS spoofing or location deviations.</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Daily Fraud Checks</Text>
          <Text style={styles.metricVal}>14,204</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Flagged Claims</Text>
          <Text style={styles.metricVal}>12</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Auto-Frozen Accs</Text>
          <Text style={styles.metricVal}>3</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Highest Risk Scores (Leaderboard)</Text>
        {claims.map((claim) => (
          <View key={claim.id} style={styles.investigationRow}>
            <View style={styles.invInfo}>
              <Text style={styles.invTitle}>{claim.id}</Text>
              <Text style={styles.invSub}>Worker claims presence in {claim.zoneName} but no Swiggy orders originated there.</Text>
            </View>
            <View style={styles.invScoreBox}>
              <Text style={[styles.scoreText, { color: claim.fraudScore! > 30 ? '#EF4444' : '#10B981' }]}>
                {claim.fraudScore}/100
              </Text>
              <Text style={styles.scoreLabel}>Risk Score</Text>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 32 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 24 },

  alertBanner: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', marginBottom: 32, alignItems: 'center' },
  alertContent: { marginLeft: 16, flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: '800', color: '#991B1B', marginBottom: 4 },
  alertDesc: { fontSize: 14, color: '#B91C1C' },

  metricsRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  metricCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  metricLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 8 },
  metricVal: { fontSize: 28, fontWeight: '900', color: '#0F172A' },

  panel: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  panelTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 24 },
  
  investigationRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  invInfo: { flex: 1, paddingRight: 24 },
  invTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  invSub: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  invScoreBox: { alignItems: 'flex-end' },
  scoreText: { fontSize: 24, fontWeight: '900' },
  scoreLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4 }
});
