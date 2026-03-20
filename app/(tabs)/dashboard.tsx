import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>PrecisePulse</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/(tabs)/profile')}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              ) : (
                <Ionicons name="person-circle" size={32} color="#94A3B8" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Heatmap Card */}
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapOverlay}>
            <View style={styles.heatmapBadge}>
              <Ionicons name="grid" size={16} color="#DC2626" />
              <View style={styles.heatmapBadgeTextContainer}>
                <Text style={styles.heatmapTitle}>Anomalous Grid Heatmap</Text>
                <Text style={styles.heatmapSubtitle}>Density of parametric triggers by sector</Text>
              </View>
            </View>
          </View>
          {/* Placeholder for actual map */}
          <View style={styles.mapPlaceholder}>
             <Ionicons name="map-outline" size={64} color="#CBD5E1" />
          </View>
        </View>

        {/* High Risk Alert Card */}
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>High Risk Alert</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.alertItem}>
            <View style={styles.alertUserRow}>
              <View style={styles.alertAvatarPlaceholder} />
              <View>
                <Text style={styles.alertName}>Marcus Thorne</Text>
                <Text style={styles.alertRole}>Courier #8921</Text>
              </View>
            </View>
            <View style={styles.alertScoreContainer}>
              <Text style={styles.alertScoreRed}>98</Text>
              <Text style={styles.alertScoreLabel}>SCORE</Text>
            </View>
          </View>

          <View style={styles.alertItem}>
            <View style={styles.alertUserRow}>
              <View style={styles.alertAvatarPlaceholderDark} />
              <View>
                <Text style={styles.alertName}>Elena Rodriguez</Text>
                <Text style={styles.alertRole}>Courier #4412</Text>
              </View>
            </View>
            <View style={styles.alertScoreContainer}>
              <Text style={styles.alertScoreOrange}>82</Text>
              <Text style={styles.alertScoreLabel}>SCORE</Text>
            </View>
          </View>
        </View>

        {/* Padding for bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heatmapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    height: 350,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  heatmapOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  heatmapBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heatmapBadgeTextContainer: {
    marginLeft: 12,
  },
  heatmapTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  heatmapSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  liveBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  alertUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    marginRight: 16,
  },
  alertAvatarPlaceholderDark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    marginRight: 16,
  },
  alertName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  alertRole: {
    fontSize: 13,
    color: '#64748B',
  },
  alertScoreContainer: {
    alignItems: 'center',
  },
  alertScoreRed: {
    fontSize: 24,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 2,
  },
  alertScoreOrange: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EA580C',
    marginBottom: 2,
  },
  alertScoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
});
