import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/mockDataStore';

export default function InsurerOverviewScreen() {
  const claims = useAppStore(state => state.claims);
  const pendingClaims = claims.filter(c => c.status === 'Pending').length;
  const approvedClaims = claims.filter(c => c.status === 'Approved').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Insurer Overview</Text>
      
      {/* KPI Cards */}
      <View style={styles.kpiGrid}>
        <KpiCard title="Active Workers" value="1,240" trend="+12%" icon="people" color="#3B82F6" />
        <KpiCard title="Pending Claims" value={pendingClaims.toString()} trend="Action Required" icon="document-text" color="#F59E0B" />
        <KpiCard title="Approved Payouts" value={approvedClaims.toString()} trend="This Week" icon="cash" color="#10B981" />
        <KpiCard title="Loss Ratio" value="42%" trend="-3% MoM" icon="pie-chart" color="#8B5CF6" />
      </View>

      {/* Charts & Lists Area */}
      <View style={styles.contentGrid}>
        <View style={styles.mainPanel}>
          <Text style={styles.sectionTitle}>High-Risk Zones (Current)</Text>
          <View style={styles.listCard}>
            <View style={styles.listItem}>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>Koramangala 4th Block</Text>
                <Text style={styles.listSub}>Severe Flooding • 6h Expected</Text>
              </View>
              <View style={styles.listMetric}>
                <Text style={styles.metricValRed}>14</Text>
                <Text style={styles.metricLabel}>Workers In Zone</Text>
              </View>
            </View>
            <View style={styles.listItem}>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>Whitefield</Text>
                <Text style={styles.listSub}>Local Strike • 24h Expected</Text>
              </View>
              <View style={styles.listMetric}>
                <Text style={styles.metricValRed}>22</Text>
                <Text style={styles.metricLabel}>Workers In Zone</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sidePanel}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <ActivityItem time="10m ago" text="Auto-claim CLM-8921-A approved for ₹850" dot="#10B981" />
            <ActivityItem time="1h ago" text="Zone Z-KOR upgraded to SEVERE (Red)" dot="#EF4444" />
            <ActivityItem time="2h ago" text="Manual review CLM-8921-B escalated" dot="#F59E0B" />
            <ActivityItem time="4h ago" text="Swiggy platform sync completed" dot="#3B82F6" />
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const KpiCard = ({ title, value, trend, icon, color }: any) => (
  <View style={styles.kpiCard}>
    <View style={styles.kpiHeader}>
      <Text style={styles.kpiTitle}>{title}</Text>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={styles.kpiTrend}>{trend}</Text>
  </View>
);

const ActivityItem = ({ time, text, dot }: any) => (
  <View style={styles.activityItem}>
    <View style={styles.activityTimeCol}>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
    <View style={[styles.activityDot, { backgroundColor: dot }]} />
    <Text style={styles.activityText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 32 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 24 },
  
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginBottom: 32 },
  kpiCard: { flex: 1, minWidth: 200, backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  kpiTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  kpiValue: { fontSize: 32, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  kpiTrend: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },

  contentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  mainPanel: { flex: 2, minWidth: 300 },
  sidePanel: { flex: 1, minWidth: 250 },
  
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listInfo: { flex: 1 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  listSub: { fontSize: 13, color: '#64748B' },
  listMetric: { alignItems: 'flex-end' },
  metricValRed: { fontSize: 20, fontWeight: '900', color: '#EF4444' },
  metricLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },

  activityCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  activityTimeCol: { width: 50 },
  activityTime: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 12, marginTop: 4 },
  activityText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 18 }
});
