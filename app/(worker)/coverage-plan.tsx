import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useAppStore } from '../../store/mockDataStore';

export default function CoveragePlanScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const workerProfile = useAppStore(state => state.workerProfile);
  const activePlan = workerProfile.activePlan;
  
  const isDesktop = width > 768;

  // Formats date relative to now nicely
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Ongoing';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
       
       <View style={[styles.mainCard, { width: isDesktop ? 800 : '100%', alignSelf: 'center' }]}>
         
         {/* POLICY HEADER */}
         <View style={styles.headerArea}>
           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
             <Ionicons name="document-text" size={32} color="#1E3A8A" style={{ marginRight: 12 }} />
             <View>
               <Text style={styles.headerTitle}>Digital Policy Contract</Text>
               <Text style={styles.headerSubtitle}>Weekly Parametric Income Protection</Text>
             </View>
           </View>

           <View style={styles.summaryBar}>
             <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Status</Text>
                <View style={[styles.statusBadge, activePlan.coverageActive ? styles.statusActive : styles.statusInactive]}>
                  <Text style={styles.statusBadgeText}>{activePlan.coverageActive ? 'Active' : 'Inactive'}</Text>
                </View>
             </View>
             <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Valid Until</Text>
                <Text style={styles.summaryValue}>{formatDate(activePlan.validUntil)}</Text>
             </View>
             <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weekly Premium</Text>
                <Text style={styles.summaryValue}>₹{activePlan.premiumPaid}</Text>
             </View>
           </View>
         </View>

         {/* EXPLAINER */}
         <View style={styles.explainerBox}>
           <Text style={styles.explainerTitle}>What is Parametric Insurance?</Text>
           <Text style={styles.explainerText}>
             Unlike traditional insurance, you do not need to file manual claims with photo evidence. Our system monitors external APIs (weather, traffic, news) against your active Hex Zone. When a covered event crosses a danger threshold in your area, your income loss is **automatically insured and paid out**.
           </Text>
         </View>

         {/* CORE COVERAGE */}
         <Text style={styles.sectionHeading}>1. Covered Deliveries (Automatic Triggers)</Text>
         <Text style={styles.sectionDesc}>If a verified disruption crosses predefined thresholds in your working zone while you are active, coverage applies automatically.</Text>
         <View style={styles.cardList}>
            {activePlan.rules?.covered?.map((rule, idx) => (
              <View key={idx} style={[styles.ruleCard, { borderColor: '#10B981', borderLeftWidth: 4 }]}>
                 <Text style={[styles.ruleEvent, { color: '#047857' }]}>{rule.event}</Text>
                 <Text style={styles.ruleParam}>Trigger: {rule.parameter}</Text>
              </View>
            )) || <Text style={styles.placeholderText}>Loading covered rules...</Text>}
         </View>

         {/* CONDITIONAL */}
         <Text style={styles.sectionHeading}>2. Conditional Coverage (Controlled Exposure)</Text>
         <Text style={styles.sectionDesc}>For human-made disruptions, coverage is allowed but controlled. Payouts may be capped and subject to stricter validation for safer routing alternatives.</Text>
         <View style={styles.cardList}>
            {activePlan.rules?.conditional?.map((rule, idx) => (
              <View key={idx} style={[styles.ruleCard, { borderColor: '#F59E0B', borderLeftWidth: 4 }]}>
                 <Text style={[styles.ruleEvent, { color: '#B45309' }]}>{rule.event}</Text>
                 <Text style={styles.ruleParam}>Condition: {rule.parameter}</Text>
              </View>
            )) || <Text style={styles.placeholderText}>Loading conditional rules...</Text>}
         </View>

         {/* EXCLUSIONS (Important) */}
         <Text style={styles.sectionHeading}>3. Systemic Exclusions</Text>
         <Text style={styles.sectionDesc}>The following severe, systemic risks are strictly excluded. They represent un-insurable, infinite liability that breaks localized risk pooling principles simultaneously affecting all workers.</Text>
         <View style={styles.cardList}>
            {activePlan.rules?.excluded?.map((rule, idx) => (
              <View key={idx} style={[styles.ruleCard, { borderColor: '#EF4444', borderLeftWidth: 4 }]}>
                 <Text style={[styles.ruleEvent, { color: '#B91C1C' }]}>{rule.event}</Text>
                 <Text style={styles.ruleParam}>Why Excluded?: <Text style={{fontWeight: '500'}}>{rule.reason}</Text></Text>
              </View>
            )) || <Text style={styles.placeholderText}>Loading excluded rules...</Text>}
         </View>

         {/* ELIGIBILITY & FRAUD */}
         <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 24, marginTop: 32 }}>
            <View style={[styles.infoColumn, { backgroundColor: '#F8FAFC' }]}>
               <Ionicons name="map" size={28} color="#3B82F6" style={{ marginBottom: 12 }} />
               <Text style={styles.infoColTitle}>Zone-Based Eligibility Rules</Text>
               <Text style={styles.infoColText}>• Starting in a <Text style={{fontWeight:'700', color:'#10B981'}}>Yellow (Safe) zone</Text> guarantees full eligibility.</Text>
               <Text style={styles.infoColText}>• Moving into a known <Text style={{fontWeight:'700', color:'#EF4444'}}>Red (High Risk) zone</Text> deliberately will invalidate claims for events occurring in that zone.</Text>
               <Text style={styles.infoColText}>• If your zone suddenly escalates from Yellow to Red during your shift, you are fully covered.</Text>
               <Text style={styles.infoColText}>Insurance covers uncontrollable exposure, not deliberate risk-taking.</Text>
            </View>

            <View style={[styles.infoColumn, { backgroundColor: '#F1F5F9' }]}>
               <Ionicons name="shield-checkmark" size={28} color="#0F172A" style={{ marginBottom: 12 }} />
               <Text style={styles.infoColTitle}>Fraud & Validation Framework</Text>
               <Text style={styles.infoColText}>• GPS data coordinates must structurally match platform delivery activity signals (Anti-Spoofing).</Text>
               <Text style={styles.infoColText}>• Claims are completely void if you continue completing deliveries during a declared disruption block.</Text>
               <Text style={styles.infoColText}>• Multiple overlapping disruptions in the same zone do strictly <Text style={{fontWeight:'700'}}>NOT</Text> stack payouts.</Text>
            </View>
         </View>

         {/* FOOTER */}
         <View style={styles.footerPolicy}>
           <Text style={styles.footerText}>By maintaining an active policy, you agree to these weekly defined triggers and conditions. Claim evaluation relies strictly on verified system telematics.</Text>
         </View>

       </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Subtle gray backdrop behind the primary document
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerArea: {
    borderBottomWidth: 2,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  summaryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  summaryItem: {
    marginBottom: 8,
    minWidth: 100,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '800',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  explainerBox: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  explainerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 8,
  },
  explainerText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 22,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 22,
  },
  cardList: {
    gap: 12,
    marginBottom: 32,
  },
  ruleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
  },
  ruleEvent: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  ruleParam: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#94A3B8',
  },
  infoColumn: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
  },
  infoColTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  infoColText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 10,
    lineHeight: 22,
  },
  footerPolicy: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  }
});
