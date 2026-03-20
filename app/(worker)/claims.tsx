import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StickyHeader } from '../../components/StickyHeader';
import { Claim, useAppStore } from '../../store/mockDataStore';

export default function ClaimsScreen() {
  const router = useRouter();
  const claims = useAppStore(state => state.claims);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  return (
    <View style={styles.container}>
      <StickyHeader title="My Claims" showBackButton backHref="/(worker)/profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Claims List */}
        <View style={styles.claimsList}>
          {claims.map((claim) => (
            <TouchableOpacity key={claim.id} style={styles.claimCard} onPress={() => setSelectedClaim(claim)}>
              <View style={styles.claimCardHeader}>
                <Text style={styles.claimId}>{claim.id}</Text>
                <View style={[styles.statusBadge, 
                  claim.status === 'Approved' ? styles.statusApproved : 
                  claim.status === 'Rejected' ? styles.statusRejected : styles.statusPending
                ]}>
                  <Text style={[styles.statusText, 
                    claim.status === 'Approved' ? styles.statusTextApproved : 
                    claim.status === 'Rejected' ? styles.statusTextRejected : styles.statusTextPending
                  ]}>{claim.status}</Text>
                </View>
              </View>
              
              <Text style={styles.claimDisruption}>{claim.disruptionType} in {claim.zoneName}</Text>
              
              <View style={styles.claimFooter}>
                <Text style={styles.claimDate}>{new Date(claim.date).toLocaleDateString()}</Text>
                <Text style={styles.claimAmount}>₹{claim.payoutAmount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Claim Detail Drawer Modal */}
      {selectedClaim && (
        <View style={styles.drawer}>
          <View style={styles.drawerTitleRow}>
            <Text style={styles.drawerTitle}>Claim Details</Text>
            <TouchableOpacity onPress={() => setSelectedClaim(null)}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.drawerId}>{selectedClaim.id}</Text>
          
          <View style={styles.drawerGrid}>
            <View style={styles.drawerRow}>
              <Text style={styles.drawerLabel}>Disruption Type</Text>
              <Text style={styles.drawerValue}>{selectedClaim.disruptionType}</Text>
            </View>
            <View style={styles.drawerRow}>
              <Text style={styles.drawerLabel}>Zone</Text>
              <Text style={styles.drawerValue}>{selectedClaim.zoneName}</Text>
            </View>
            <View style={styles.drawerRow}>
              <Text style={styles.drawerLabel}>Amount</Text>
              <Text style={styles.drawerValue}>₹{selectedClaim.payoutAmount}</Text>
            </View>
            <View style={styles.drawerRow}>
              <Text style={styles.drawerLabel}>Trigger Source</Text>
              <Text style={styles.drawerValue}>{selectedClaim.source}</Text>
            </View>
          </View>

          <View style={styles.reasonBox}>
            <Text style={styles.reasonLabel}>Decision Notes</Text>
            <Text style={styles.reasonText}>{selectedClaim.reasonSummary}</Text>
          </View>

          <View style={styles.drawerActions}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Download Summary</Text>
            </TouchableOpacity>
            {selectedClaim.status === 'Rejected' && (
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Appeal Rejection</Text>
              </TouchableOpacity>
            )}
            {selectedClaim.status === 'Pending' && (
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Add Additional Evidence</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },

  claimsList: { gap: 16 },
  claimCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  claimCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  claimId: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusApproved: { backgroundColor: '#D1FAE5' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusRejected: { backgroundColor: '#FEE2E2' },
  
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  statusTextApproved: { color: '#065F46' },
  statusTextPending: { color: '#92400E' },
  statusTextRejected: { color: '#991B1B' },

  claimDisruption: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  claimFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  claimDate: { fontSize: 13, color: '#94A3B8' },
  claimAmount: { fontSize: 18, fontWeight: '900', color: '#10B981' },

  drawer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  drawerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  drawerTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  drawerId: { fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 24 },
  
  drawerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  drawerRow: { width: '45%' },
  drawerLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  drawerValue: { fontSize: 15, fontWeight: '700', color: '#0F172A' },

  reasonBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  reasonLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 8 },
  reasonText: { fontSize: 14, color: '#0F172A', lineHeight: 20 },

  drawerActions: { gap: 12 },
  primaryBtn: { backgroundColor: '#0F172A', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { backgroundColor: '#FFFFFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  secondaryBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '700' }
});
