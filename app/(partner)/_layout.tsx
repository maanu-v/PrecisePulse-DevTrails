import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/mockDataStore';

export default function PartnerLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const setRole = useAppStore(state => state.setCurrentRole);

  const NavItem = ({ title, icon, path }: { title: string, icon: any, path: string }) => {
    const isActive = pathname === path || pathname === path + '/';
    return (
      <TouchableOpacity style={[styles.navItem, isActive && styles.navItemActive]} onPress={() => router.push(path as any)}>
        <Ionicons name={icon} size={20} color={isActive ? "#FFFFFF" : "#64748B"} />
        <Text style={[styles.navText, isActive && styles.navTextActive]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isDesktop && (
        <View style={styles.sidebar}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={28} color="#2563EB" />
            <Text style={styles.logoText}>Platform Admin</Text>
          </View>
          
          <View style={styles.navMenu}>
            <NavItem title="Overview" icon="grid-outline" path="/(partner)" />
            <NavItem title="Worker Sync" icon="sync-outline" path="/(partner)/sync" />
            <NavItem title="API Access" icon="code-slash-outline" path="/(partner)/api" />
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => { setRole(null); router.replace('/'); }}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Exit Demo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {!isDesktop && (
          <View style={styles.mobileHeader}>
            <Text style={styles.mobileTitle}>Platform Admin</Text>
            <TouchableOpacity onPress={() => { setRole(null); router.replace('/'); }}>
              <Ionicons name="log-out" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
        )}
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
  sidebar: { width: 280, backgroundColor: '#FFFFFF', padding: 24, justifyContent: 'space-between', borderRightWidth: 1, borderRightColor: '#E2E8F0' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logoText: { color: '#0F172A', fontSize: 18, fontWeight: '800', marginLeft: 12 },
  navMenu: { flex: 1, gap: 8 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  navItemActive: { backgroundColor: '#2563EB' },
  navText: { color: '#64748B', fontSize: 15, fontWeight: '600', marginLeft: 12 },
  navTextActive: { color: '#FFFFFF', fontWeight: '800' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FEF2F2', borderRadius: 8 },
  logoutText: { color: '#DC2626', fontSize: 15, fontWeight: '700', marginLeft: 12 },
  
  mainContent: { flex: 1, overflow: 'hidden' },
  mobileHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  mobileTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' }
});
