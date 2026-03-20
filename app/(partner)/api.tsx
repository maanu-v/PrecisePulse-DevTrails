import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ApiAccessScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>API & Data Sharing Controls</Text>

      <View style={styles.keyCard}>
        <View style={styles.keyHeader}>
          <Text style={styles.keyTitle}>Production API Key</Text>
          <Text style={styles.rollBtn}>Roll Key</Text>
        </View>
        <View style={styles.keyValueBox}>
          <Text style={styles.keyValue}>pk_live_8f92j3b4vbxz9812nmxm0...</Text>
          <Ionicons name="copy-outline" size={20} color="#64748B" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Shared Endpoints</Text>
      
      <View style={styles.endpointsList}>
        <EndpointRow method="GET" path="/v1/workers/:id/earnings" desc="Share weekly earnings data for premium logic." active={true} />
        <EndpointRow method="POST" path="/v1/webhooks/location" desc="Real-time geo-coordinates for claim verification." active={true} />
        <EndpointRow method="GET" path="/v1/workers/:id/identity" desc="KYC & Identity Verification matching." active={true} />
        <EndpointRow method="GET" path="/v1/workers/:id/strikes" desc="Platform penalty integration." active={false} />
      </View>

      <View style={styles.auditCard}>
        <Text style={styles.auditTitle}>Compliance & Consents</Text>
        <Text style={styles.auditDesc}>All active workers have digitally signed the PrecisePulse parametric insurance consent terms. Data is only shared for insured workers via hashed platform IDs.</Text>
      </View>
    </ScrollView>
  );
}

const EndpointRow = ({ method, path, desc, active }: any) => (
  <View style={styles.endpointCard}>
    <View style={styles.endpointHead}>
      <View style={styles.methodBox}><Text style={styles.methodText}>{method}</Text></View>
      <Text style={styles.pathText}>{path}</Text>
      <View style={{ flex: 1 }} />
      <Switch value={active} trackColor={{ true: '#10B981', false: '#E2E8F0' }} />
    </View>
    <Text style={styles.descText}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 32 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 32 },

  keyCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 32 },
  keyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  keyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  rollBtn: { color: '#2563EB', fontWeight: '700', fontSize: 14 },
  keyValueBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  keyValue: { fontFamily: 'monospace', color: '#334155', fontSize: 14 },
  
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  endpointsList: { gap: 16, marginBottom: 32 },
  endpointCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  endpointHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  methodBox: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 12 },
  methodText: { color: '#2563EB', fontWeight: '800', fontSize: 12 },
  pathText: { fontFamily: 'monospace', fontSize: 15, color: '#0F172A', fontWeight: '600' },
  descText: { fontSize: 13, color: '#64748B' },

  auditCard: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1' },
  auditTitle: { fontSize: 15, fontWeight: '800', color: '#334155', marginBottom: 8 },
  auditDesc: { fontSize: 14, color: '#475569', lineHeight: 22 }
});
