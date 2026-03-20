import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/mockDataStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function RouteSuggestionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const workerProfile = useAppStore(state => state.workerProfile);
  const notifications = useAppStore(state => state.notifications);
  const zones = useAppStore(state => state.zones);
  const unreadNotifs = notifications.filter(n => !n.read).length;
  
  // Mock current location logic
  const currentZone = zones.find(z => z.color === 'orange') || zones[0];
  const recommendedSafeZone = zones.find(z => z.color === 'green');

  const [routeAccepted, setRouteAccepted] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrapper, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 10 }]}> 
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerMain}>
              <Text style={styles.title}>Safe Routes</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusIndicator, { backgroundColor: workerProfile.status === 'Active' ? '#10B981' : '#CBD5E1' }]} />
                <Text style={styles.subtitle}>{workerProfile.platform} · Bengaluru live route guidance</Text>
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

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Platform.OS === 'ios' ? 100 + insets.top : 110 + insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Current Location Context */}
        <View style={styles.contextCard}>
          <Text style={styles.contextLabel}>CURRENT LOCATION</Text>
          <Text style={styles.zoneName}>{currentZone.name}</Text>
          <View style={styles.pillRow}>
            <View style={[styles.colorDot, { backgroundColor: currentZone.color === 'orange' ? '#F59E0B' : '#EF4444' }]} />
            <Text style={styles.pillText}>
              {currentZone.color === 'orange' ? 'MODERATE RISK' : 'SEVERE RISK'}
            </Text>
          </View>
        </View>

        {/* AI Route Recommendation */}
        {recommendedSafeZone && !routeAccepted ? (
          <View style={styles.recommendationCard}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              <Text style={styles.aiBadgeText}>AI RECOMMENDED</Text>
            </View>
            
            <Text style={styles.routeTarget}>Navigate to {recommendedSafeZone.name}</Text>
            <Text style={styles.routeReasoning}>
              Heavy traffic and waterlogging detected in your area. Moving to {recommendedSafeZone.name} will maintain your insurance eligibility and keep you safe.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <Text style={styles.statVal}>12 min</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="map-outline" size={20} color="#64748B" />
                <Text style={styles.statVal}>3.2 km</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                <Text style={styles.statValGreen}>Eligible</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.acceptBtn} onPress={() => setRouteAccepted(true)}>
              <Text style={styles.acceptBtnText}>Start Safe Route</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.ignoreBtn}>
              <Text style={styles.ignoreBtnText}>Ignore & Stay on Current Route</Text>
            </TouchableOpacity>

            <View style={styles.warningBox}>
              <Ionicons name="warning" size={16} color="#B91C1C" />
              <Text style={styles.warningText}>Ignoring safe routes when available may result in claim rejection if a disruption occurs.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.activeRouteCard}>
            <Ionicons name="navigate-circle" size={48} color="#10B981" />
            <Text style={styles.activeRouteTitle}>Safe Route Active</Text>
            <Text style={styles.activeRouteDesc}>You are currently heading to a safe zone. Your coverage remains active.</Text>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setRouteAccepted(false)}>
              <Text style={styles.cancelBtnText}>Cancel Route</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerGradient: { paddingHorizontal: 20, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerShadow: { height: 1, backgroundColor: 'rgba(15, 23, 42, 0.06)' },
  headerMain: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  subtitle: { fontSize: 12, fontWeight: '500', color: '#475569', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 10 },
  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmallText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  scrollContent: { padding: 20, paddingBottom: 120 },

  contextCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  contextLabel: { fontSize: 12, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, marginBottom: 4 },
  zoneName: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  pillRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  colorDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  pillText: { fontSize: 11, fontWeight: '700', color: '#334155' },

  recommendationCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#3B82F6', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 16 },
  aiBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', marginLeft: 4, letterSpacing: 0.5 },
  
  routeTarget: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  routeReasoning: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 24 },
  statBox: { alignItems: 'center' },
  statVal: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 4 },
  statValGreen: { fontSize: 14, fontWeight: '800', color: '#10B981', marginTop: 4 },

  acceptBtn: { backgroundColor: '#0F172A', flexDirection: 'row', paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  acceptBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginRight: 8 },
  
  ignoreBtn: { paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  ignoreBtnText: { color: '#64748B', fontSize: 14, fontWeight: '700' },

  warningBox: { backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: '#FECACA' },
  warningText: { flex: 1, marginLeft: 8, fontSize: 12, color: '#991B1B', lineHeight: 18 },

  activeRouteCard: { backgroundColor: '#ECFDF5', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#6EE7B7', marginTop: 32 },
  activeRouteTitle: { fontSize: 20, fontWeight: '800', color: '#065F46', marginTop: 16, marginBottom: 8 },
  activeRouteDesc: { fontSize: 14, color: '#047857', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  cancelBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1FAE5' },
  cancelBtnText: { color: '#065F46', fontWeight: '700' }
});
