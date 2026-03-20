import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PartnerOverviewScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Swiggy Partner Overview</Text>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Synced Workers</Text>
          <Text style={styles.kpiVal}>142,501</Text>
          <Text style={styles.kpiSub}>+1,200 this week</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>API Accuracy</Text>
          <Text style={styles.kpiVal}>99.9%</Text>
          <Text style={styles.kpiSub}>Earnings & Location</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Workers Protected</Text>
          <Text style={styles.kpiVal}>84%</Text>
          <Text style={styles.kpiSub}>Of Active Fleet</Text>
        </View>
      </View>

      <View style={styles.graphPanel}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>API Synchronization Status</Text>
          <View style={styles.statusPill}>
            <Ionicons name="ellipse" size={8} color="#10B981" />
            <Text style={styles.statusText}>ALL SYSTEMS OPERATIONAL</Text>
          </View>
        </View>
        
        <View style={styles.endpointRow}>
          <Text style={styles.endpointName}>GET /workers/earnings</Text>
          <Text style={styles.endpointUptime}>100% Uptime</Text>
          <Text style={styles.endpointLatency}>42ms</Text>
        </View>
        <View style={styles.endpointRow}>
          <Text style={styles.endpointName}>POST /webhook/location-update</Text>
          <Text style={styles.endpointUptime}>99.9% Uptime</Text>
          <Text style={styles.endpointLatency}>18ms</Text>
        </View>
        <View style={styles.endpointRow}>
          <Text style={styles.endpointName}>GET /workers/auth-verify</Text>
          <Text style={styles.endpointUptime}>100% Uptime</Text>
          <Text style={styles.endpointLatency}>25ms</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 32 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 24 },
  
  kpiGrid: { flexDirection: 'row', gap: 24, marginBottom: 32, flexWrap: 'wrap' },
  kpiCard: { flex: 1, minWidth: 200, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  kpiLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 8 },
  kpiVal: { fontSize: 36, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  kpiSub: { fontSize: 14, color: '#10B981', fontWeight: '600' },

  graphPanel: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  graphHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  graphTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0' },
  statusText: { fontSize: 11, fontWeight: '800', color: '#065F46', marginLeft: 6 },
  
  endpointRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  endpointName: { flex: 2, fontSize: 14, fontWeight: '700', color: '#334155', fontFamily: 'monospace' },
  endpointUptime: { flex: 1, fontSize: 14, color: '#10B981', fontWeight: '600' },
  endpointLatency: { flex: 1, fontSize: 14, color: '#64748B', textAlign: 'right' }
});
