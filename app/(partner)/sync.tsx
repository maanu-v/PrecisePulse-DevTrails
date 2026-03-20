import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/mockDataStore';

export default function WorkerSyncScreen() {
  const worker = useAppStore(state => state.workerProfile);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Worker Id Mapping & Sync</Text>

      <View style={styles.controlsRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Search worker by ID or Email...</Text>
        </View>
        <TouchableOpacity style={styles.syncBtn}>
          <Ionicons name="sync" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.syncBtnText}>Trigger Full Sync</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.table}>
        <View style={styles.thRow}>
          <Text style={[styles.th, { flex: 2 }]}>Worker Name</Text>
          <Text style={[styles.th, { flex: 1 }]}>Platform ID</Text>
          <Text style={[styles.th, { flex: 1 }]}>Insurance ID</Text>
          <Text style={[styles.th, { flex: 1 }]}>Status</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Last Synced</Text>
        </View>
        
        <View style={styles.tr}>
          <View style={[styles.td, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
            <View style={styles.avatar}><Text style={styles.avText}>{worker.name.charAt(0)}</Text></View>
            <Text style={styles.name}>{worker.name}</Text>
          </View>
          <Text style={[styles.td, { flex: 1, fontFamily: 'monospace' }]}>{worker.platformId}</Text>
          <Text style={[styles.td, { flex: 1, fontFamily: 'monospace' }]}>{worker.id}</Text>
          <View style={[styles.td, { flex: 1 }]}>
            <Text style={styles.statusPill}>Active</Text>
          </View>
          <Text style={[styles.td, { flex: 1, textAlign: 'right', color: '#64748B' }]}>2 mins ago</Text>
        </View>

        {/* Dummy rows */}
        <View style={styles.tr}>
          <View style={[styles.td, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
            <View style={[styles.avatar, { backgroundColor: '#F59E0B' }]}><Text style={styles.avText}>R</Text></View>
            <Text style={styles.name}>Rahul Gupta</Text>
          </View>
          <Text style={[styles.td, { flex: 1, fontFamily: 'monospace' }]}>SWG-8822</Text>
          <Text style={[styles.td, { flex: 1, color: '#94A3B8' }]}>Unlinked</Text>
          <View style={[styles.td, { flex: 1 }]}>
            <Text style={[styles.statusPill, { backgroundColor: '#F1F5F9', color: '#64748B' }]}>Inactive</Text>
          </View>
          <Text style={[styles.td, { flex: 1, textAlign: 'right', color: '#64748B' }]}>1 day ago</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 32 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 24 },
  
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 24 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  searchText: { color: '#94A3B8', marginLeft: 12 },
  syncBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', paddingHorizontal: 24, borderRadius: 12 },
  syncBtnText: { color: '#FFFFFF', fontWeight: '700' },

  table: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  thRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  tr: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  td: { fontSize: 14, color: '#0F172A' },
  
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  name: { fontWeight: '700', fontSize: 15 },
  
  statusPill: { alignSelf: 'flex-start', backgroundColor: '#D1FAE5', color: '#065F46', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 11, fontWeight: '800', overflow: 'hidden' }
});
