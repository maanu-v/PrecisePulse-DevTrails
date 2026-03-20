import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapComponent from '../../components/Map';
import { useAppStore } from '../../store/mockDataStore';

export default function InsurerRiskMapScreen() {
  const zones = useAppStore(state => state.zones);
  const activeAlerts = zones.filter(z => z.color !== 'green').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>City Operational Intelligence</Text>
        <View style={styles.statsBadge}>
          <Text style={styles.statsText}>{activeAlerts} Active Disruptions</Text>
        </View>
      </View>
      <View style={styles.mapWrapper}>
        <MapComponent onZoneClick={(id) => { console.log('Insurer clicked zone', id) }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', zIndex: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  statsBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#FECACA' },
  statsText: { color: '#B91C1C', fontWeight: '800', fontSize: 13 },
  mapWrapper: { flex: 1 }
});
