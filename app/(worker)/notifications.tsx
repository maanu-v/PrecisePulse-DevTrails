import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/mockDataStore';

export default function NotificationsScreen() {
  const router = useRouter();
  const notifications = useAppStore(state => state.notifications);
  const markRead = useAppStore(state => state.markNotificationRead);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.map((notif) => (
          <TouchableOpacity 
            key={notif.id} 
            style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
            onPress={() => markRead(notif.id)}
          >
            <View style={[styles.iconBox, 
              notif.type === 'danger' ? styles.iconDanger : 
              notif.type === 'success' ? styles.iconSuccess : styles.iconInfo
            ]}>
              <Ionicons 
                name={notif.type === 'danger' ? "warning" : notif.type === 'success' ? "checkmark-circle" : "information-circle"} 
                size={24} 
                color={notif.type === 'danger' ? '#EF4444' : notif.type === 'success' ? '#10B981' : '#3B82F6'} 
              />
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{notif.title}</Text>
              <Text style={styles.notifMsg}>{notif.message}</Text>
              <Text style={styles.notifDate}>{new Date(notif.date).toLocaleString()}</Text>
            </View>
            {!notif.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
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
  
  notifCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  notifCardUnread: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  iconDanger: { backgroundColor: '#FEF2F2' },
  iconSuccess: { backgroundColor: '#ECFDF5' },
  iconInfo: { backgroundColor: '#EFF6FF' },
  
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  notifMsg: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 8 },
  notifDate: { fontSize: 12, color: '#94A3B8' },
  
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6', marginTop: 6 }
});
