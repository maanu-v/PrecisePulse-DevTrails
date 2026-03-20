import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/mockDataStore';

interface Order {
  id: string;
  restaurant: string;
  items: string;
  distance: string;
  time: string;
  earnings: number;
  tip?: number;
  pickupZone: 'Green' | 'Orange' | 'Red';
  dropZone: 'Green' | 'Orange' | 'Red';
  safetyLevel: 'Safe' | 'Moderate' | 'High Risk';
  weatherCondition: 'Clear' | 'Rain' | 'Heavy Rain';
  trafficCondition: 'Low' | 'Moderate' | 'Heavy';
  insuranceEligible: boolean;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-101',
    restaurant: 'Biryani Blues',
    items: '2x Hyderabadi Biryani',
    distance: '2.5 km',
    time: '15 mins',
    earnings: 85,
    tip: 20,
    pickupZone: 'Green',
    dropZone: 'Green',
    safetyLevel: 'Safe',
    weatherCondition: 'Clear',
    trafficCondition: 'Low',
    insuranceEligible: true,
  },
  {
    id: 'ORD-102',
    restaurant: 'Burger King',
    items: 'Whopper Meal',
    distance: '4.2 km',
    time: '25 mins',
    earnings: 110,
    pickupZone: 'Green',
    dropZone: 'Green',
    safetyLevel: 'Safe',
    weatherCondition: 'Clear',
    trafficCondition: 'Moderate',
    insuranceEligible: true,
  },
  {
    id: 'ORD-103',
    restaurant: 'Pizza Hut',
    items: 'Medium Margherita',
    distance: '5.8 km',
    time: '35 mins',
    earnings: 145,
    pickupZone: 'Green',
    dropZone: 'Orange',
    safetyLevel: 'Moderate', 
    weatherCondition: 'Rain',
    trafficCondition: 'Moderate',
    insuranceEligible: true,
  },
  {
    id: 'ORD-105',
    restaurant: 'Truffles',
    items: 'All American Cheese Burger',
    distance: '3.5 km',
    time: '30 mins',
    earnings: 120,
    pickupZone: 'Orange',
    dropZone: 'Orange',
    safetyLevel: 'Moderate',
    weatherCondition: 'Rain',
    trafficCondition: 'Heavy',
    insuranceEligible: true,
  },
  {
    id: 'ORD-104',
    restaurant: 'Empire Restaurant',
    items: 'Ghee Rice, Chicken Kebab',
    distance: '3.1 km',
    time: '20 mins',
    earnings: 95,
    pickupZone: 'Orange',
    dropZone: 'Red',
    safetyLevel: 'High Risk',
    weatherCondition: 'Heavy Rain',
    trafficCondition: 'Heavy',
    insuranceEligible: false,
  },
];

export default function SafeOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const workerProfile = useAppStore(state => state.workerProfile);
  const notifications = useAppStore(state => state.notifications);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const [filter, setFilter] = useState<'All' | 'Safe' | 'Risky'>('All');

  // Sort orders: Safe -> Moderate -> High Risk
  const sortedOrders = [...MOCK_ORDERS].sort((a, b) => {
    const riskScore = { 'Safe': 1, 'Moderate': 2, 'High Risk': 3 };
    return riskScore[a.safetyLevel] - riskScore[b.safetyLevel];
  });

  const filteredOrders = sortedOrders.filter(order => {
    if (filter === 'Safe') return order.safetyLevel === 'Safe';
    if (filter === 'Risky') return order.safetyLevel !== 'Safe';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header from Routes Screen */}
      <View style={[styles.headerWrapper, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 10 }]}> 
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerMain}>
              <Text style={styles.title}>Safe Orders</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusIndicator, { backgroundColor: workerProfile.status === 'Active' ? '#10B981' : '#CBD5E1' }]} />
                <Text style={styles.subtitle}>{workerProfile.platform} · Priority Safety Queue</Text>
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

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: Platform.OS === 'ios' ? 100 + insets.top : 110 + insets.top }]}>
        
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark" size={20} color="#15803D" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>
            Orders are prioritized by safety. <Text style={{fontWeight: '700', color: '#15803D'}}>Green Zone</Text> trips are fully insured.
          </Text>
        </View>

        {filteredOrders.map((order) => (
          <View key={order.id} style={[
            styles.orderCard, 
            order.safetyLevel === 'Safe' ? styles.orderCardSafe :
            order.safetyLevel === 'Moderate' ? styles.orderCardModerate :
            styles.orderCardRisky
          ]}>
            {/* Header: Restaurant & Earnings */}
            <View style={styles.cardHeader}>
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantIcon}>
                  <Ionicons name="restaurant" size={20} color="#475569" />
                </View>
                <View>
                  <Text style={styles.restaurantName}>{order.restaurant}</Text>
                  <Text style={styles.orderItems}>{order.items}</Text>
                </View>
              </View>
              <View style={styles.earningsBadge}>
                <Text style={styles.earningsText}>₹{order.earnings + (order.tip || 0)}</Text>
              </View>
            </View>

            {/* Route Visualizer: Green -> Orange etc */}
            <View style={styles.routeRow}>
              <View style={styles.routePoint}>
                <View style={[styles.dot, { backgroundColor: getZoneColor(order.pickupZone) }]} />
                <Text style={styles.routeText}>Pickup ({order.pickupZone})</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.dot, { backgroundColor: getZoneColor(order.dropZone) }]} />
                <Text style={styles.routeText}>Drop ({order.dropZone})</Text>
              </View>
            </View>

            {/* Weather & Traffic Context */}
            <View style={styles.contextRow}>
                <View style={styles.contextTag}>
                    <Ionicons name={order.weatherCondition === 'Clear' ? 'sunny' : 'rainy'} size={12} color="#64748B" />
                    <Text style={styles.contextText}>{order.weatherCondition}</Text>
                </View>
                <View style={styles.contextTag}>
                    <Ionicons name="car" size={12} color="#64748B" />
                    <Text style={styles.contextText}>{order.trafficCondition} Traffic</Text>
                </View>
                <View style={styles.spacer} />
                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#64748B" />
                    <Text style={styles.metaText}>{order.time}</Text>
                </View>
            </View>

            {/* Action Footer */}
            <View style={styles.footer}>
               {order.safetyLevel === 'Safe' ? (
                 <View style={styles.safetyBadgeSafe}>
                   <Ionicons name="shield-checkmark" size={14} color="#15803D" />
                   <Text style={styles.safetyTextSafe}>Safe & Insured</Text>
                 </View>
               ) : order.safetyLevel === 'Moderate' ? (
                 <View style={styles.safetyBadgeModerate}>
                   <Ionicons name="warning" size={14} color="#B45309" />
                   <Text style={styles.safetyTextModerate}>Moderate Risk</Text>
                 </View>
               ) : (
                 <View style={styles.safetyBadgeRisky}>
                   <Ionicons name="alert-circle" size={14} color="#B91C1C" />
                   <Text style={styles.safetyTextRisky}>High Risk</Text>
                 </View>
               )}

               <TouchableOpacity style={[
                 styles.acceptBtn, 
                 !order.insuranceEligible ? styles.acceptBtnRisky : {}
                ]}>
                 <Text style={styles.acceptBtnText}>Accept Order</Text>
               </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} /> 
      </ScrollView>
    </View>
  );
}

function getZoneColor(zone: string) {
  switch (zone) {
    case 'Green': return '#22C55E';
    case 'Orange': return '#F97316';
    case 'Red': return '#EF4444';
    default: return '#94A3B8';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  // Header Styles (Copied & Adapted)
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#FFFFFF', // Ensure opacity isn't an issue
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

  scrollContent: { padding: 16, paddingBottom: 120 },
  
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#86EFAC',
    alignItems: 'center',
  },
  infoText: { flex: 1, fontSize: 13, color: '#14532D', lineHeight: 18 },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  orderCardSafe: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  orderCardModerate: {
    borderColor: '#FDBA74',
    backgroundColor: '#FFF7ED',
  },
  orderCardRisky: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  restaurantInfo: { flexDirection: 'row', gap: 12, flex: 1 },
  restaurantIcon: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center'
  },
  restaurantName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  orderItems: { fontSize: 13, color: '#64748B' },
  earningsBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  earningsText: { fontSize: 14, fontWeight: '800', color: '#166534' },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  routeText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  routeLine: { flex: 1, height: 1, backgroundColor: '#CBD5E1', marginHorizontal: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#94A3B8' },

  contextRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  contextTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  contextText: { fontSize: 11, fontWeight: '600', color: '#475569' },
  spacer: { flex: 1 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: '#64748B', fontWeight: '500' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  
  safetyBadgeSafe: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  safetyTextSafe: { fontSize: 12, fontWeight: '700', color: '#15803D' },
  
  safetyBadgeModerate: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  safetyTextModerate: { fontSize: 12, fontWeight: '700', color: '#B45309' },

  safetyBadgeRisky: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  safetyTextRisky: { fontSize: 12, fontWeight: '700', color: '#B91C1C' },

  acceptBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnRisky: {
    backgroundColor: '#64748B',
    opacity: 0.8
  },
  acceptBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
