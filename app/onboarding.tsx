import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/mockDataStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width > 768;

  const setWorkerProfile = useAppStore(state => state.setWorkerProfile);
  const workerProfile = useAppStore(state => state.workerProfile);
  
  const [step, setStep] = useState(1);

  // Form State
  const [platform, setPlatform] = useState<string>('');
  const [vehicle, setVehicle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [hours, setHours] = useState<string>('8');
  const [days, setDays] = useState<string>('6');
  const [agreed, setAgreed] = useState(false);
  
  const platforms = ['Swiggy', 'Zomato', 'Amazon', 'Zepto', 'Other'];
  const vehicles = ['2-Wheeler', 'EV Scooter', 'Bicycle', 'Other'];
  const categories = ['Food Delivery', 'Groceries', 'Parcels / E-commerce', 'Generic Delivery'];
  const cities = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Other'];

  const handleNext = () => {
    if (step < 9) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = () => {
    const weeklyIncomeNum = parseInt(income, 10) || 4000;
    
    // Dynamic Premium logic as requested: Base + Zone Risk + Income Factor
    const basePrice = 20;
    const incomeFactor = (weeklyIncomeNum * 0.02); // 2% 
    let zoneRiskAdjustment = 0;
    
    if (city === 'Mumbai' || city === 'Bengaluru') zoneRiskAdjustment = 5;
    else if (city === 'Delhi NCR') zoneRiskAdjustment = 10;
    else zoneRiskAdjustment = -2; // Safe area deduction

    const finalPremium = basePrice + zoneRiskAdjustment + incomeFactor;

    setWorkerProfile({
      ...workerProfile,
      platform: platform,
      vehicleType: vehicle,
      deliveryCategory: category,
      weeklyIncome: weeklyIncomeNum,
      city: city,
      workHoursPerDay: parseInt(hours, 10) || 8,
      workDaysPerWeek: parseInt(days, 10) || 6,
      policyAccepted: true,
      premiumBreakdown: {
        base: basePrice,
        riskAdjustment: zoneRiskAdjustment,
        incomeFactor: incomeFactor,
        total: Math.round(finalPremium)
      },
      activePlan: {
        ...workerProfile.activePlan,
        premiumPaid: Math.round(finalPremium),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        rules: {
          covered: [
            { event: 'Heavy Rain / Floods', parameter: 'API rainfall thresholds crossed in active Hex Zone' },
            { event: 'Severe Heatwave', parameter: 'Govt heat-alert + local API threshold breached' },
            { event: 'Extreme Pollution', parameter: 'AQI sustained > 400 for 2+ hours' }
          ],
          conditional: [
            { event: 'City Curfews / Unplanned Strikes', parameter: 'Restricted payout cap. Subject to alternative route availability checks.' },
            { event: 'Market Shutdowns', parameter: 'Only localized to the specific Hex zone. Spillover zones not covered.' }
          ],
          excluded: [
            { event: 'Pandemics / National Lockdowns', reason: 'Systemic risks that affect all workers simultaneously break the risk pooling model and create infinite liability.' },
            { event: 'War / Terrorism', reason: 'Act of War clauses are standard systemic risk exclusions.' },
            { event: 'Routine Traffic Disruptions', reason: 'Normal operational hazards; only severe, systemic shutdowns covered.' }
          ]
        }
      }
    });

    router.replace('/(worker)/dashboard' as any);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
        <View 
          key={s} 
          style={[
            styles.stepDot, 
            step >= s && styles.stepDotActive,
            step === s && styles.stepDotCurrent
          ]} 
        />
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Who do you deliver for?</Text>
            <Text style={styles.subtitle}>Select your primary platform. This helps validate identity and structure your risk profile.</Text>
            
            <View style={styles.optionsGrid}>
              {platforms.map(p => (
                <TouchableOpacity 
                  key={p}
                  style={[styles.optionCard, platform === p && styles.optionCardActive]}
                  onPress={() => setPlatform(p)}
                >
                  <Ionicons name="cube-outline" size={24} color={platform === p ? '#2563EB' : '#64748B'} />
                  <Text style={[styles.optionLabel, platform === p && styles.optionLabelActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>What do you drive and deliver?</Text>
            <Text style={styles.subtitle}>Providing vehicle type and cargo category helps us adjust your vulnerability score.</Text>
            
            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.chipGroup}>
              {vehicles.map(v => (
                <TouchableOpacity 
                  key={v}
                  style={[styles.chip, vehicle === v && styles.chipActive]}
                  onPress={() => setVehicle(v)}
                >
                  <Text style={[styles.chipText, vehicle === v && styles.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Main Delivery Category</Text>
            <View style={styles.chipGroup}>
              {categories.map(c => (
                <TouchableOpacity 
                  key={c}
                  style={[styles.chip, category === c && styles.chipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>How much do you earn?</Text>
            <Text style={styles.subtitle}>We use this to calculate your weekly protection cap and payout rules.</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.largeInput}
                keyboardType="numeric"
                placeholder="4000"
                placeholderTextColor="#94A3B8"
                value={income}
                onChangeText={setIncome}
                autoFocus
              />
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>Your premium will be automatically tuned to your earnings base.</Text>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Where do you operate?</Text>
            <Text style={styles.subtitle}>Select your primary city so our hyper-local risk engine can map your daily environments automatically.</Text>
            
            <View style={styles.optionsList}>
              {cities.map((c) => (
                <TouchableOpacity 
                    key={c}
                    style={[
                      styles.zoneCard, 
                      city === c && { borderColor: '#3B82F6', borderWidth: 2, backgroundColor: '#EFF6FF' }
                    ]}
                    onPress={() => setCity(c)}
                  >
                    <View style={styles.zoneHeader}>
                      <Text style={[styles.zoneName, city === c && { color: '#1D4ED8' }]}>{c}</Text>
                      <Ionicons name={city === c ? "checkmark-circle" : "location-outline"} size={24} color={city === c ? "#3B82F6" : "#64748B"} />
                    </View>
                  </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>How do you work?</Text>
            <Text style={styles.subtitle}>This fine-tunes your exposure model and builds a robust profile.</Text>
            
            <Text style={styles.label}>Hours per day</Text>
            <View style={styles.incrementer}>
              <TouchableOpacity style={styles.incBtn} onPress={() => setHours(String(Math.max(1, parseInt(hours || '1') - 1)))}>
                <Ionicons name="remove" size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.incValue}>{hours} hrs</Text>
              <TouchableOpacity style={styles.incBtn} onPress={() => setHours(String(Math.min(24, parseInt(hours || '1') + 1)))}>
                <Ionicons name="add" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Days per week</Text>
            <View style={styles.incrementer}>
              <TouchableOpacity style={styles.incBtn} onPress={() => setDays(String(Math.max(1, parseInt(days || '1') - 1)))}>
                <Ionicons name="remove" size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.incValue}>{days} days</Text>
              <TouchableOpacity style={styles.incBtn} onPress={() => setDays(String(Math.min(7, parseInt(days || '1') + 1)))}>
                <Ionicons name="add" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Your Policy Preview</Text>
            <Text style={styles.subtitle}>Review your insurance terms before finalizing.</Text>
            
            <View style={styles.policyBox}>
               <Text style={styles.policySectionTitle}>✔ Covered</Text>
               <Text style={styles.policyText}>Heavy Rain, Floods, Severe Pollution</Text>
               
               <View style={styles.divider} />

               <Text style={[styles.policySectionTitle, { color: '#D97706' }]}>⚠ Conditional</Text>
               <Text style={styles.policyText}>City Curfews, Unplanned Zone Closures</Text>
               
               <View style={styles.divider} />

               <Text style={[styles.policySectionTitle, { color: '#DC2626' }]}>✖ Not Covered</Text>
               <Text style={styles.policyText}>Accidents, Health Issues, Routine traffic jams</Text>
            </View>
          </View>
        );

      case 7:
        const calculatedIncome = parseInt(income, 10) || 4000;
        const basePrice = 20;
        const incomeFac = (calculatedIncome * 0.02); 
        let riskAdj = 0;
        
        if (city === 'Mumbai' || city === 'Bengaluru') riskAdj = 5;
        else if (city === 'Delhi NCR') riskAdj = 10;
        else riskAdj = -2;

        const prm = basePrice + riskAdj + incomeFac;

        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Your Premium Preview</Text>
            <Text style={styles.subtitle}>Immediate value tailored for your specific risk exposure.</Text>
            
            <View style={styles.premiumBox}>
              <Text style={styles.premiumLabel}>Weekly Premium</Text>
              <Text style={styles.premiumValue}>₹{Math.round(prm)}</Text>
            </View>

            <View style={styles.premiumFactors}>
              <Text style={styles.factorsTitle}>Pricing Breakdown:</Text>
              <View style={styles.factorRow}>
                <Ionicons name="calculator-outline" size={20} color="#10B981" />
                <Text style={styles.factorText}>Base Platform Price (₹{basePrice})</Text>
              </View>
              <View style={styles.factorRow}>
                <Ionicons name="cash-outline" size={20} color="#3B82F6" />
                <Text style={styles.factorText}>Income Factor (+₹{Math.round(incomeFac)})</Text>
              </View>
              <View style={styles.factorRow}>
                <Ionicons name="map-outline" size={20} color={riskAdj > 0 ? "#EF4444" : "#10B981"} />
                <Text style={styles.factorText}>Zone Risk: {city || 'Area'} ({riskAdj > 0 ? '+' : ''}₹{riskAdj})</Text>
              </View>
            </View>
            
            <View style={[styles.infoBox, { marginTop: 24, backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="bulb-outline" size={20} color="#15803D" />
              <Text style={[styles.infoText, { color: '#166534' }]}>
                AI Insight: You are operating in a {riskAdj > 0 ? 'moderately risky' : 'safe'} zone with variable disruption probabilities.
              </Text>
            </View>
          </View>
        );
      
      case 8:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Digital Policy Contract</Text>
            <Text style={styles.subtitle}>You must expressly agree to these parametric terms to finalize coverage.</Text>
            
            <ScrollView style={{ maxHeight: 300, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, marginBottom: 24, backgroundColor: '#F8FAFC' }}>
               <Text style={[styles.policySectionTitle, { color: '#047857' }]}>✔ Covered (Zero Touch Payout)</Text>
               <Text style={styles.policyText}>• Heavy Rain / Floods (When API rainfall thresholds cross)</Text>
               <Text style={styles.policyText}>• Severe Heatwave (Govt alert + Local API threshold)</Text>
               <Text style={styles.policyText}>• Extreme Pollution (AQI sustained {'>'} 400 for 2+ hrs)</Text>

               <View style={styles.divider} />
               <Text style={[styles.policySectionTitle, { color: '#B45309' }]}>⚠ Conditional Restrictions</Text>
               <Text style={styles.policyText}>• City Curfews / Strikes (Subject to safe-routing verification)</Text>
               <Text style={styles.policyText}>• Market Shutdowns (Strictly localized to specific Hex zones)</Text>

               <View style={styles.divider} />
               <Text style={[styles.policySectionTitle, { color: '#B91C1C' }]}>✖ STRICT SYSTEMIC EXCLUSIONS</Text>
               <Text style={styles.policyText}>• Pandemics / National Lockdowns (Systemic risk creates infinite uninsurable liability)</Text>
               <Text style={styles.policyText}>• War / Terrorism (Standard Act of War exclusion)</Text>
               <Text style={styles.policyText}>• Traffic / Personal Accidents (Operational and Health hazards not covered)</Text>

               <View style={styles.divider} />
               <Text style={[styles.policySectionTitle, { color: '#0F172A' }]}>⚖ Anti-Fraud & Compliance</Text>
               <Text style={styles.policyText}>• Moving deliberately into a known Red zone voids pending active claims.</Text>
               <Text style={styles.policyText}>• Continuing deliveries during a paid disruption voids the payout claim (Dual-benefit restriction).</Text>
               <Text style={styles.policyText}>• Payouts rely strictly on verified system GPS and telematics.</Text>
            </ScrollView>

            <TouchableOpacity 
               style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: agreed ? '#ECFDF5' : '#F1F5F9', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: agreed ? '#10B981' : '#CBD5E1' }}
               onPress={() => setAgreed(!agreed)}
            >
               <Ionicons name={agreed ? "checkbox" : "square-outline"} size={24} color={agreed ? "#10B981" : "#64748B"} />
               <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '700', color: agreed ? '#065F46' : '#334155' }}>
                  I Agree to the Parametric Terms
               </Text>
            </TouchableOpacity>
          </View>
        );

      case 9:
        return (
          <View style={[styles.contentContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <View style={styles.successCircle}>
               <Ionicons name="shield-checkmark" size={64} color="#10B981" />
            </View>
            <Text style={[styles.title, { textAlign: 'center' }]}>You're Protected ✅</Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>Your coverage starts this week. Stay safe out there.</Text>
          </View>
        );
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !platform) return true;
    if (step === 2 && (!vehicle || !category)) return true;
    if (step === 3 && !income) return true;
    if (step === 4 && !city) return true;
    if (step === 8 && !agreed) return true;
    return false;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.headerArea, { paddingTop: Math.max(insets.top, 20) }]}>
         {step > 1 && step < 9 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
         )}
         {renderStepIndicator()}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.mainCard, { width: isDesktop ? 600 : '100%' }]}>
          {renderStepContent()}
        </View>
      </ScrollView>

      <View style={[styles.footerArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity 
          style={[styles.primaryButton, isNextDisabled() && styles.primaryButtonDisabled]} 
          onPress={handleNext}
          disabled={isNextDisabled()}
        >
          <Text style={styles.primaryButtonText}>
            {step === 9 ? 'Go to Dashboard' : (step === 8 ? 'I Agree & Finalize' : 'Continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  stepIndicatorContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    height: 6,
    flex: 1,
    maxWidth: 32,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
  },
  stepDotActive: {
    backgroundColor: '#3B82F6',
  },
  stepDotCurrent: {
    backgroundColor: '#1D4ED8',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  optionCard: {
    width: '46%',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  optionCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center'
  },
  optionLabelActive: {
    color: '#1D4ED8',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#1D4ED8',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#2563EB',
    paddingBottom: 8,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 16,
  },
  largeInput: {
    flex: 1,
    fontSize: 48,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  optionsList: {
    gap: 12,
  },
  zoneCard: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  incrementer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    marginBottom: 24,
  },
  incBtn: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  incValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  policyBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
  },
  policySectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 15,
    color: '#475569',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  premiumBox: {
    backgroundColor: '#0F172A',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  premiumLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  premiumValue: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  premiumFactors: {
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  factorText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  successCircle: {
    width: 120,
    height: 120,
    backgroundColor: '#ECFDF5',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  footerArea: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
