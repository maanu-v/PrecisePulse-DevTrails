import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/mockDataStore';

export default function RouteSuggestionsScreen() {
  const router = useRouter();
  const zones = useAppStore(state => state.zones);
  
  // Mock current location logic
  const currentZone = zones.find(z => z.color === 'orange') || zones[0];
  const recommendedSafeZone = zones.find(z => z.color === 'green');

  const [routeAccepted, setRouteAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Safe Routes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  scrollContent: { padding: 20 },

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
