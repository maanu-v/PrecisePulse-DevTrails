import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/mockDataStore';

const BANGALORE_CITY = 'Bengaluru';

export default function WorkerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const workerProfile = useAppStore(state => state.workerProfile);
  const notifications = useAppStore(state => state.notifications);
  const zones = useAppStore(state => state.zones);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const activeRedZone = zones.find(z => z.color === 'red');

  const moderateOrHigherZones = zones.filter(z => z.color !== 'green').length;

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={[styles.headerWrapper, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 10 }]}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Hello, {workerProfile.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: workerProfile.status === 'Active' ? '#10B981' : '#CBD5E1' }]} />
                <Text style={styles.statusLine}>
                  {workerProfile.platform} · {workerProfile.platformId}
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notifButton} onPress={() => router.push('/(worker)/notifications')}>
                <Ionicons name="notifications-outline" size={22} color="#0F172A" />
                {unreadNotifs > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadNotifs}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarSmall} onPress={() => router.push('/(worker)/profile')}>
                <Text style={styles.avatarSmallText}>{workerProfile.name.charAt(0)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.headerShadow} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Platform.OS === 'ios' ? 100 + insets.top : 110 + insets.top }]}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.locationInfoCard}>
          <View style={styles.locationInfoHeader}>
            <View style={styles.locationIconWrap}>
              <Ionicons name="location" size={18} color="#1D4ED8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationTitle}>{BANGALORE_CITY} Operations Snapshot</Text>
              <Text style={styles.locationSubtitle}>Fixed city baseline mode enabled</Text>
            </View>
          </View>
          <View style={styles.locationStatsRow}>
            <View style={styles.locationStatItem}>
              <Text style={styles.locationStatValue}>{zones.length}</Text>
              <Text style={styles.locationStatLabel}>Tracked Zones</Text>
            </View>
            <View style={styles.locationStatItem}>
              <Text style={styles.locationStatValue}>{moderateOrHigherZones}</Text>
              <Text style={styles.locationStatLabel}>Active Alerts</Text>
            </View>
            <View style={styles.locationStatItem}>
              <Text style={styles.locationStatValue}>12.97N</Text>
              <Text style={styles.locationStatLabel}>City Center</Text>
            </View>
          </View>
        </View>

        {/* Global Alert */}
        {activeRedZone && (
          <View style={styles.globalAlert}>
            <View style={styles.alertIcon}>
              <Ionicons name="warning" size={20} color="#DC2626" />
            </View>
            <View style={styles.globalAlertTextContainer}>
              <Text style={styles.globalAlertTitle}>Severe Disruption in {activeRedZone.name}</Text>
              <Text style={styles.globalAlertDesc}>
                {activeRedZone.disruption?.type}. Expected: {activeRedZone.disruption?.expectedDuration}.
              </Text>
            </View>
          </View>
        )}

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconRow}>
              <View style={[styles.metricIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="card" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.metricLabel}>Weekly Premium</Text>
            <Text style={styles.metricValue}>₹{workerProfile.activePlan.premiumPaid}</Text>
            <Text style={styles.metricSub}>{workerProfile.activePlan.mode} mode</Text>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricIconRow}>
              <View style={[styles.metricIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="trending-up" size={18} color="#10B981" />
              </View>
            </View>
            <Text style={styles.metricLabel}>Total Payouts</Text>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>₹{workerProfile.totalPayoutReceived}</Text>
            <Text style={styles.metricSubGreen}>+850 Recent</Text>
          </View>
        </View>

        {/* Action Panel */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionBtn title="Coverage Plan" icon="calendar" color="#2563EB" onPress={() => router.push('/(worker)/coverage-plan')} />
          <ActionBtn title="Risk Map" icon="map" color="#8B5CF6" onPress={() => router.push('/(worker)/risk-map')} />
          <ActionBtn title="Safe Routes" icon="walk" color="#10B981" onPress={() => router.push('/(worker)/routes')} />
          <ActionBtn title="My Claims" icon="document-text" color="#F59E0B" onPress={() => router.push('/(worker)/claims')} />
        </View>

        {/* Exposure summary */}
        <View style={styles.exposureCard}>
          <View style={styles.exposureHeader}>
            <Text style={styles.exposureTitle}>Current Risk Exposure</Text>
            <View style={[styles.riskLevel, { backgroundColor: workerProfile.currentExposureScore > 50 ? '#FEF2F2' : '#ECFDF5' }]}>
              <Text style={[styles.riskLevelText, { color: workerProfile.currentExposureScore > 50 ? '#DC2626' : '#10B981' }]}>
                {workerProfile.currentExposureScore > 70 ? 'HIGH' : workerProfile.currentExposureScore > 50 ? 'MODERATE' : 'LOW'}
              </Text>
            </View>
          </View>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreValue, { color: workerProfile.currentExposureScore > 50 ? '#DC2626' : '#10B981' }]}>
              {workerProfile.currentExposureScore}
            </Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${workerProfile.currentExposureScore}%`, backgroundColor: workerProfile.currentExposureScore > 50 ? '#DC2626' : '#10B981' }]} />
          </View>
          <Text style={styles.exposureDesc}>
            Your upcoming blocks have moderate exposure to heavy traffic. Consider flexible timing to reduce premium.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const ActionBtn = ({ title, icon, color, onPress }: { title: string, icon: any, color: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.actionIconWrapper, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={26} color={color} />
    </View>
    <Text style={styles.actionBtnText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Fixed Header
  headerWrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
  },
  headerGradient: { paddingHorizontal: 20, paddingBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusLine: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifButton: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  badge: {
    position: 'absolute', top: -2, right: -2, backgroundColor: '#EF4444', borderRadius: 10,
    minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  avatarSmall: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#2563EB',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarSmallText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  headerShadow: { height: 1, backgroundColor: 'rgba(15, 23, 42, 0.06)' },

  // Scroll Content
  scrollContent: { padding: 20, paddingBottom: 120 },

  locationInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  locationInfoHeader: { flexDirection: 'row', alignItems: 'center' },
  locationIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  locationSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  locationStatsRow: { flexDirection: 'row', marginTop: 14, gap: 10 },
  locationStatItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  locationStatValue: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  locationStatLabel: { marginTop: 2, fontSize: 11, color: '#64748B', fontWeight: '600' },

  // Global Alert
  globalAlert: {
    backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#FECACA',
  },
  alertIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FEE2E2',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  globalAlertTextContainer: { flex: 1 },
  globalAlertTitle: { fontWeight: '800', color: '#B91C1C', fontSize: 14 },
  globalAlertDesc: { color: '#991B1B', fontSize: 13, marginTop: 2 },

  // Metrics
  metricsGrid: { flexDirection: 'row', gap: 14, marginBottom: 32 },
  metricCard: {
    flex: 1, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 18,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  metricIconRow: { marginBottom: 12 },
  metricIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  metricLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { fontSize: 26, fontWeight: '900', color: '#0F172A', marginVertical: 6 },
  metricSub: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  metricSubGreen: { fontSize: 12, color: '#10B981', fontWeight: '600' },

  // Actions
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 16, letterSpacing: -0.2 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 32 },
  actionBtn: {
    width: '47%', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 18, alignItems: 'center',
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  actionIconWrapper: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  // Exposure Card
  exposureCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 24, marginBottom: 40,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  exposureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exposureTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  riskLevel: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  riskLevelText: { fontSize: 11, fontWeight: '800' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  scoreValue: { fontSize: 40, fontWeight: '900' },
  scoreMax: { fontSize: 16, color: '#94A3B8', fontWeight: '700', marginLeft: 4 },
  progressBar: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
  progressFill: { height: '100%', borderRadius: 4 },
  exposureDesc: { fontSize: 14, color: '#64748B', lineHeight: 22 },
});
