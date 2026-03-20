import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppStore } from '../../store/mockDataStore';

export default function WorkerProfileScreen() {
  const router = useRouter();
  const workerProfile = useAppStore(state => state.workerProfile);
  const claims = useAppStore(state => state.claims);
  const setRole = useAppStore(state => state.setCurrentRole);

  const handleLogout = () => {
    setRole(null);
    router.replace('/');
  };

  const pendingClaims = claims.filter(c => c.status === 'Pending').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#1E3A8A', '#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{workerProfile.name.charAt(0)}</Text>
            </View>
            <Text style={styles.name}>{workerProfile.name}</Text>
            <Text style={styles.idLine}>ID: {workerProfile.id}</Text>
            <View style={styles.statusChip}>
              <View style={styles.statusDotWhite} />
              <Text style={styles.statusChipText}>{workerProfile.platform} · {workerProfile.status}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{workerProfile.activePlan.premiumPaid}</Text>
            <Text style={styles.statLabel}>Premium/wk</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>₹{workerProfile.totalPayoutReceived}</Text>
            <Text style={styles.statLabel}>Total Payouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{workerProfile.currentExposureScore}</Text>
            <Text style={styles.statLabel}>Risk Score</Text>
          </View>
        </View>

        {/* Insurance Hub Section */}
        <Text style={styles.sectionTitle}>Insurance Hub</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="shield-checkmark"
            iconColor="#2563EB"
            iconBg="#EFF6FF"
            title="Coverage Plan"
            subtitle="Manage your coverage mode & zones"
            onPress={() => router.push('/(worker)/coverage-plan')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="document-text"
            iconColor="#F59E0B"
            iconBg="#FFFBEB"
            title="My Claims"
            subtitle={pendingClaims > 0 ? `${pendingClaims} pending claim${pendingClaims > 1 ? 's' : ''}` : 'View claim history'}
            badge={pendingClaims > 0 ? pendingClaims : undefined}
            onPress={() => router.push('/(worker)/claims')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="wallet"
            iconColor="#10B981"
            iconBg="#ECFDF5"
            title="Premium & Payouts"
            subtitle="View premium breakdown & statements"
            onPress={() => router.push('/(worker)/premium-payouts')}
          />
        </View>

        {/* Platform Integration */}
        <Text style={styles.sectionTitle}>Platform Integration</Text>
        <View style={styles.menuCard}>
          <View style={styles.integrationRow}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="business" size={22} color="#0F172A" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{workerProfile.platform}</Text>
              <Text style={styles.menuSubtitle}>ID: {workerProfile.platformId}</Text>
            </View>
            <View style={styles.syncedPill}>
              <Ionicons name="checkmark-circle" size={14} color="#065F46" />
              <Text style={styles.syncedText}>SYNCED</Text>
            </View>
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.integrationStats}>
            <View style={styles.integrationStatItem}>
              <Text style={styles.integrationStatLabel}>Earnings Synced</Text>
              <Text style={styles.integrationStatValue}>₹{workerProfile.totalEarningsSynced}</Text>
            </View>
            <View style={styles.integrationStatItem}>
              <Text style={styles.integrationStatLabel}>Vehicle Class</Text>
              <Text style={styles.integrationStatValue}>{workerProfile.vehicleType}</Text>
            </View>
          </View>
        </View>

        {/* Consent */}
        <View style={styles.consentCard}>
          <Ionicons name="lock-closed" size={18} color="#64748B" style={{ marginRight: 12 }} />
          <Text style={styles.consentText}>
            Live geolocation & earnings data shared with PrecisePulse via API for parametric validation.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const MenuItem = ({ icon, iconColor, iconBg, title, subtitle, badge, onPress }: {
  icon: any; iconColor: string; iconBg: string; title: string; subtitle: string; badge?: number; onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
    <View style={[styles.menuIconBox, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={22} color={iconColor} />
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.menuRight}>
      {badge !== undefined && (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 120 },

  // Profile Header
  profileHeader: { marginBottom: 20 },
  profileGradient: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  name: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  idLine: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 12 },
  statusChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  statusDotWhite: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34D399', marginRight: 8 },
  statusChipText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  // Stats Row
  statsRow: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 20,
    marginTop: -20, borderRadius: 16, padding: 20,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 36, backgroundColor: '#E2E8F0' },

  // Section Titles
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: '#0F172A',
    marginTop: 28, marginBottom: 12, marginHorizontal: 20,
  },

  // Menu Cards
  menuCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 20,
    shadowColor: '#1E293B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20,
  },
  menuIconBox: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  menuSubtitle: { fontSize: 13, color: '#64748B' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuBadge: {
    backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  menuBadgeText: { fontSize: 12, fontWeight: '800', color: '#92400E' },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 80 },

  // Integration Row
  integrationRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20,
  },
  syncedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  syncedText: { color: '#065F46', fontSize: 10, fontWeight: '800' },
  integrationStats: {
    flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, gap: 24,
  },
  integrationStatItem: { flex: 1 },
  integrationStatLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  integrationStatValue: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  // Consent
  consentCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: 20, marginTop: 20,
    backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  consentText: { flex: 1, fontSize: 13, color: '#64748B', lineHeight: 20 },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, marginTop: 24, marginBottom: 20,
    paddingVertical: 16, borderRadius: 12,
    borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FEF2F2',
  },
  logoutText: { color: '#DC2626', fontSize: 15, fontWeight: '700' },
});
