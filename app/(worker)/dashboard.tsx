import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useAppStore, ActiveDisruption, ClaimResult } from '../../store/mockDataStore';

export default function WorkerDashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { workerProfile, activeDisruption, setActiveDisruption, addClaim, setWorkerProfile, claims } = useAppStore();

  // Zero-Touch claim processing states
  const [processingState, setProcessingState] = useState<'idle' | 'detecting' | 'verifying' | 'result'>('idle');
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);

  // Earnings mock chart data
  const data = [500, 800, 450, 950, 1200, 1100, 1500];
  const claimData = [0, 0, 0, 0, 0, 0, 0];

  // ZERO-TOUCH ENGINE
  useEffect(() => {
    if (activeDisruption && processingState === 'idle') {
      triggerZeroTouchProcessing();
    }
  }, [activeDisruption]);

  const triggerZeroTouchProcessing = () => {
    setProcessingState('detecting');
    
    // Simulate API Network Detection Letency
    setTimeout(() => {
      setProcessingState('verifying');
      
      // Simulate Policy Logic Validation Letency
      setTimeout(() => {
         processClaimLogic();
      }, 2500);

    }, 2000);
  };

  const processClaimLogic = () => {
    if (!activeDisruption) return;

    let payout = 0;
    let status: 'Approved' | 'Rejected' = 'Rejected';
    let reasons: string[] = [];

    // Validation 1: Is event covered?
    if (!activeDisruption.isCovered) {
       reasons.push("✖ Event type is explicitly excluded from algorithmic pooling.");
    } else {
       reasons.push("✔ Event matches policy 'Covered' triggers.");
    }

    // Validation 2: Is worker geographically eligible? (Mocking a strict match requirement)
    // Assume worker is in 'Z-1-X' but trigger is 'Z-1-X' => match
    const workerInAffectedZone = true; // In a real app, verify GPS vs affected zone
    if (workerInAffectedZone) {
       reasons.push("✔ Telemetry confirms presence in affected grid.");
    } else {
       reasons.push("✖ Worker external to the active danger radius.");
    }

    // Validation 3: Is worker active?
    const workerIsActive = true; 
    if (workerIsActive) {
       reasons.push("✔ Platform sync confirms active delivery status.");
    }

    if (activeDisruption.isCovered && workerInAffectedZone && workerIsActive) {
       status = 'Approved';
       payout = Math.round((workerProfile.weeklyIncome || 4000) * 0.2); // 20% of weekly income payout
       
       addClaim({
         id: `CLM-AUTO-${Math.floor(Math.random() * 9000) + 1000}`,
         date: new Date().toISOString(),
         zoneId: activeDisruption.zoneId,
         zoneName: 'Auto-detected Zone',
         disruptionType: activeDisruption.type,
         source: 'Auto',
         status,
         payoutAmount: payout,
         reasonSummary: 'Parametric automation successfully triggered and verified telematics.',
       });

       setWorkerProfile({
          totalPayoutReceived: workerProfile.totalPayoutReceived + payout
       });
    }

    setClaimResult({ status, amount: payout, reasons });
    setProcessingState('result');
  };

  const closeSimulation = () => {
     setActiveDisruption(null);
     setClaimResult(null);
     setProcessingState('idle');
  };

  // UI Simulation triggers
  const triggerSim = (type: string, isCovered: boolean) => {
     setActiveDisruption({
       type,
       zoneId: 'Z-DEMO-1',
       description: `A severe ${type.toLowerCase()} has been detected crossing thresholds.`,
       isCovered,
     });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* -------------------- ZERO TOUCH UI MODAL -------------------- */}
      <Modal visible={processingState !== 'idle'} transparent animationType="fade">
         <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
               {processingState === 'detecting' && (
                 <>
                   <ActivityIndicator size="large" color="#3B82F6" style={{ marginBottom: 20 }} />
                   <Text style={styles.modalTitle}>⚡ Disruption Detected</Text>
                   <Text style={styles.modalSubtitle}>Syncing with weather and municipal APIs...</Text>
                 </>
               )}
               {processingState === 'verifying' && (
                 <>
                   <ActivityIndicator size="large" color="#8B5CF6" style={{ marginBottom: 20 }} />
                   <Text style={styles.modalTitle}>Verifying Eligibility</Text>
                   <Text style={styles.modalSubtitle}>Running zero-touch telematic validation against your policy...</Text>
                 </>
               )}
               {processingState === 'result' && claimResult && (
                 <>
                   <Ionicons 
                      name={claimResult.status === 'Approved' ? "checkmark-circle" : "close-circle"} 
                      size={64} 
                      color={claimResult.status === 'Approved' ? "#10B981" : "#EF4444"} 
                      style={{ marginBottom: 12 }} 
                   />
                   <Text style={styles.modalTitle}>Claim {claimResult.status}</Text>
                   
                   {claimResult.status === 'Approved' && (
                     <Text style={styles.payoutText}>+₹{claimResult.amount} Credited</Text>
                   )}

                   <View style={styles.reasonsBox}>
                      <Text style={styles.reasonsTitle}>Automated Reasoning:</Text>
                      {claimResult.reasons.map((r, i) => (
                         <Text key={i} style={[styles.reasonItem, { color: r.startsWith('✔') ? '#065F46' : '#991B1B' }]}>{r}</Text>
                      ))}
                   </View>

                   <TouchableOpacity style={styles.closeBtn} onPress={closeSimulation}>
                      <Text style={styles.closeBtnText}>Dismiss</Text>
                   </TouchableOpacity>
                 </>
               )}
            </View>
         </View>
      </Modal>


      {/* -------------------- MAIN DASHBOARD UI -------------------- */}
      <View style={[styles.mainLayout, { flexDirection: isDesktop ? 'row' : 'column' }]}>
        
        {/* LEFT COLUMN */}
        <View style={styles.leftCol}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>PrecisePulse, {workerProfile.name.split(' ')[0]}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                 <View style={{ 
                    width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', marginRight: 8,
                    shadowColor: '#10B981', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4
                 }} />
                 <Text style={[styles.subGreeting, { marginTop: 0 }]}>Parametric Coverage Active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* DYNAMIC PREMIUM PANEL (AI PRICING VISIBILITY) */}
          <View style={styles.premiumCard}>
             <View style={styles.premiumHeader}>
                <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
                <Text style={styles.premiumTitle}>Weekly Premium Algorithm</Text>
             </View>
             
             <Text style={styles.premiumMainValue}>₹{workerProfile.premiumBreakdown?.total || workerProfile.activePlan.premiumPaid}</Text>
             
             <View style={styles.algBreakdown}>
                <View style={styles.algRow}>
                   <Text style={styles.algLabel}>Base Platform Rate</Text>
                   <Text style={styles.algValue}>₹{workerProfile.premiumBreakdown?.base || 20}</Text>
                </View>
                <View style={styles.algRow}>
                   <Text style={styles.algLabel}>Personal Income Factor</Text>
                   <Text style={styles.algValue}>+ ₹{Math.round(workerProfile.premiumBreakdown?.incomeFactor || 0)}</Text>
                </View>
                <View style={styles.algRow}>
                   <Text style={styles.algLabel}>Spatial Risk Adjustment ({workerProfile.city || 'Zone'})</Text>
                   <Text style={[styles.algValue, { color: (workerProfile.premiumBreakdown?.riskAdjustment || 0) > 0 ? '#DC2626' : '#10B981' }]}>
                      {(workerProfile.premiumBreakdown?.riskAdjustment || 0) > 0 ? '+' : ''}₹{workerProfile.premiumBreakdown?.riskAdjustment || 0}
                   </Text>
                </View>
             </View>
             
             <View style={styles.aiInsight}>
                <Ionicons name="bulb" size={16} color="#B45309" style={{ marginTop: 2, marginRight: 8 }} />
                <Text style={styles.insightText}>
                   Pricing dynamically adjusted based on geographical density probabilities. Rates refresh strictly on {workerProfile.activePlan.validUntil ? new Date(workerProfile.activePlan.validUntil).toLocaleDateString() : 'next week'}.
                </Text>
             </View>
          </View>

          {/* SIMULATORS (DEVELOPER CONTROLS) */}
          <View style={[styles.simCard, { padding: 16 }]}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                 <View style={{ flex: 1 }}>
                     <Text style={[styles.simTitle, { fontSize: 15 }]}>Parametric Simulators</Text>
                     <Text style={[styles.simSubtitle, { fontSize: 13, marginBottom: 0 }]}>Test zero-touch claim processing</Text>
                 </View>
                 <Ionicons name="hardware-chip" size={24} color="#3B82F6" />
             </View>
             
             <View style={[styles.simBtnGroup, { gap: 8 }]}>
                <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#DBEAFE', borderColor: '#3B82F6', paddingVertical: 8, paddingHorizontal: 12 }]} onPress={() => triggerSim('Heavy Rain', true)}>
                   <Ionicons name="rainy" size={16} color="#1D4ED8" />
                   <Text style={[styles.simText, { color: '#1E3A8A', fontSize: 13 }]}>Rain</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B', paddingVertical: 8, paddingHorizontal: 12 }]} onPress={() => triggerSim('Heatwave', true)}>
                   <Ionicons name="thermometer" size={16} color="#B45309" />
                   <Text style={[styles.simText, { color: '#92400E', fontSize: 13 }]}>Heat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#FCE7F3', borderColor: '#DB2777', paddingVertical: 8, paddingHorizontal: 12 }]} onPress={() => triggerSim('Widespread Traffic', false)}>
                   <Ionicons name="car" size={16} color="#BE185D" />
                   <Text style={[styles.simText, { color: '#9D174D', fontSize: 13 }]}>Traffic</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* RECENT PAYOUTS / CLAIMS */}
          <View style={styles.recentCard}>
             <View style={styles.cardHeader}>
               <Ionicons name="receipt" size={20} color="#0F172A" />
               <Text style={styles.cardTitle}>Recent Activity & Payouts</Text>
             </View>
             <View style={styles.claimsList}>
                {claims.slice(0, 3).map((claim, idx) => (
                   <View key={idx} style={styles.claimItem}>
                      <View style={[styles.claimIconWrapper, claim.status === 'Approved' ? styles.claimIconGreen : styles.claimIconRed]}>
                         <Ionicons name={claim.status === 'Approved' ? "checkmark" : "close"} size={16} color={claim.status === 'Approved' ? "#065F46" : "#991B1B"} />
                      </View>
                      <View style={styles.claimBody}>
                          <Text style={styles.claimType}>{claim.disruptionType}</Text>
                          <Text style={styles.claimDate}>{new Date(claim.date).toLocaleDateString()} • {claim.zoneName}</Text>
                      </View>
                      <View style={styles.claimAmtBlock}>
                          <Text style={[styles.claimAmount, claim.status === 'Approved' ? { color: '#10B981' } : { color: '#94A3B8', textDecorationLine: 'line-through' }]}>
                             ₹{claim.payoutAmount || 0}
                          </Text>
                          <Text style={[styles.claimStatusText, { color: claim.status === 'Approved' ? '#10B981' : '#EF4444' }]}>{claim.status}</Text>
                      </View>
                   </View>
                ))}
             </View>
          </View>

        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.rightCol}>
          
          {/* EARNINGS CHART */}
          <View style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="stats-chart" size={20} color="#0F172A" />
              <Text style={styles.cardTitle}>Earnings & Payouts</Text>
            </View>
            <View style={{ height: 200, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 10 }}>
               {data.map((val, idx) => (
                  <View key={idx} style={{ 
                      width: '10%', 
                      height: `${(val / 1500) * 100}%`, 
                      backgroundColor: '#3B82F6', 
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      opacity: idx >= 4 ? 1 : 0.5
                  }} />
               ))}
            </View>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>Total Earned</Text>
                <Text style={styles.statValue}>₹{workerProfile.totalEarningsSynced}</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Auto-Payouts Received</Text>
                <Text style={[styles.statValue, { color: '#10B981' }]}>₹{workerProfile.totalPayoutReceived}</Text>
              </View>
            </View>
          </View>

        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  mainLayout: {
    gap: 24,
  },
  leftCol: {
    flex: 1,
    gap: 24,
  },
  rightCol: {
    flex: 1,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subGreeting: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // PREMIUM PANEL
  premiumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
  },
  premiumMainValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
  },
  algBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    gap: 12,
  },
  algRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  algLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  algValue: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '700',
  },
  aiInsight: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  // SIMULATOR
  simCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
  },
  simTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  simSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
  },
  simBtnGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  simText: {
    fontSize: 14,
    fontWeight: '700',
  },
  // CHARTS
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  // RECENT CLAIMS
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  claimsList: {
    gap: 16,
  },
  claimItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  claimIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  claimIconGreen: {
    backgroundColor: '#D1FAE5',
  },
  claimIconRed: {
    backgroundColor: '#FEE2E2',
  },
  claimBody: {
    flex: 1,
  },
  claimType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  claimDate: {
    fontSize: 12,
    color: '#64748B',
  },
  claimAmtBlock: {
    alignItems: 'flex-end',
  },
  claimAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  claimStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  // MODAL OVERLAY
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  payoutText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10B981',
    marginTop: 12,
  },
  reasonsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  reasonItem: {
    fontSize: 13,
    lineHeight: 20,
  },
  closeBtn: {
    marginTop: 24,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  }
});
