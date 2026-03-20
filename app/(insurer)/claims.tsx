import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore, Claim } from '../../store/mockDataStore';

export default function InsurerClaimsScreen() {
  const claims = useAppStore(state => state.claims);
  const updateStatus = useAppStore(state => state.updateClaimStatus);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const handleAction = (status: 'Approved' | 'Rejected') => {
    if (selectedClaim) {
      updateStatus(selectedClaim.id, status);
      setSelectedClaim({ ...selectedClaim, status });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Claims Operations Console</Text>

      <View style={styles.layout}>
        {/* Table View */}
        <View style={styles.tableArea}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1.5 }]}>Claim ID</Text>
            <Text style={[styles.th, { flex: 2 }]}>Zone & Disruption</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>Date</Text>
            <Text style={[styles.th, { flex: 1 }]}>Status</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Amount</Text>
          </View>
          <ScrollView>
            {claims.map((claim) => (
              <TouchableOpacity 
                key={claim.id} 
                style={[styles.tr, selectedClaim?.id === claim.id && styles.trSelected]}
                onPress={() => setSelectedClaim(claim)}
              >
                <Text style={[styles.td, { flex: 1.5, fontWeight: '700' }]}>{claim.id}</Text>
                <View style={[styles.td, { flex: 2 }]}>
                  <Text style={styles.cellMain}>{claim.zoneName}</Text>
                  <Text style={styles.cellSub}>{claim.disruptionType}</Text>
                </View>
                <Text style={[styles.td, { flex: 1.5, color: '#64748B' }]}>{new Date(claim.date).toLocaleDateString()}</Text>
                <View style={[styles.td, { flex: 1 }]}>
                  <Text style={[styles.statusPill, claim.status === 'Approved' ? styles.statusApp : claim.status === 'Rejected' ? styles.statusRej : styles.statusPen]}>
                    {claim.status}
                  </Text>
                </View>
                <Text style={[styles.td, { flex: 1, textAlign: 'right', fontWeight: '800' }]}>₹{claim.payoutAmount}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Detail Panel */}
        <View style={styles.detailArea}>
          {selectedClaim ? (
            <ScrollView>
              <Text style={styles.detailTitle}>Claim Investigation</Text>
              
              <View style={styles.evidenceCard}>
                <Text style={styles.evidenceHeader}>SYSTEM CLASSIFICATION</Text>
                <View style={styles.evdRow}><Text style={styles.evdLabel}>Trigger Source:</Text><Text style={styles.evdVal}>{selectedClaim.source}</Text></View>
                <View style={styles.evdRow}><Text style={styles.evdLabel}>Zone Status:</Text><Text style={[styles.evdVal, { color: '#EF4444' }]}>SEVERE (Red)</Text></View>
                <View style={styles.evdRow}><Text style={styles.evdLabel}>Worker Compliance:</Text><Text style={[styles.evdVal, { color: '#10B981' }]}>Followed Route</Text></View>
              </View>

              <Text style={styles.evidenceHeader}>EVENT SUMMARY</Text>
              <Text style={styles.reasonText}>{selectedClaim.reasonSummary}</Text>

              {selectedClaim.status === 'Pending' ? (
                <View style={styles.actionBox}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleAction('Approved')}>
                    <Text style={styles.btnText}>Approve & Issue Payout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => handleAction('Rejected')}>
                    <Text style={styles.btnTextDark}>Reject Claim</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.resolvedBox}>
                  <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                  <Text style={styles.resolvedText}>This claim is currently {selectedClaim.status.toUpperCase()}.</Text>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.emptyDetail}>
              <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyDetailText}>Select a claim to review details</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 32 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 24 },
  
  layout: { flex: 1, flexDirection: 'row', gap: 24 },
  
  tableArea: { flex: 2, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  tr: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', alignItems: 'center' },
  trSelected: { backgroundColor: '#EFF6FF' },
  td: { fontSize: 14, color: '#0F172A' },
  cellMain: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  cellSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  
  statusPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 11, fontWeight: '800', overflow: 'hidden' },
  statusApp: { backgroundColor: '#D1FAE5', color: '#065F46' },
  statusPen: { backgroundColor: '#FEF3C7', color: '#92400E' },
  statusRej: { backgroundColor: '#FEE2E2', color: '#991B1B' },

  detailArea: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 24 },
  emptyDetail: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyDetailText: { color: '#94A3B8', marginTop: 16, fontWeight: '600' },
  
  detailTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 24 },
  evidenceCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  evidenceHeader: { fontSize: 12, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginBottom: 16 },
  evdRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  evdLabel: { color: '#475569', fontSize: 14 },
  evdVal: { color: '#0F172A', fontSize: 14, fontWeight: '700' },

  reasonText: { fontSize: 14, color: '#0F172A', lineHeight: 22, backgroundColor: '#F1F5F9', padding: 16, borderRadius: 12, marginBottom: 32 },

  actionBox: { gap: 12 },
  approveBtn: { backgroundColor: '#10B981', paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  rejectBtn: { backgroundColor: '#FFFFFF', paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  btnTextDark: { color: '#0F172A', fontWeight: '700', fontSize: 14 },

  resolvedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECFDF5', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0' },
  resolvedText: { color: '#065F46', fontWeight: '700', marginLeft: 8 }
});
