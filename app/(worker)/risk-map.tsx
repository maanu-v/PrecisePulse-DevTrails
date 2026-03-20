import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    assessWeatherRisk,
    CurrentWeather,
    fetchCurrentWeather,
    fetchForecast,
    ForecastItem,
    getTomorrowForecast,
    getWeatherIconUrl,
    WeatherRisk,
    WeatherRiskLevel,
} from '../../services/weatherService';
import { useAppStore, Zone } from '../../store/mockDataStore';

// Conditional import will resolve to Map.web.tsx on web and Map.tsx on native
import MapComponent from '../../components/Map';

const BANGALORE_LOCATION = { latitude: 12.9716, longitude: 77.5946 };

export default function RiskMapScreen() {
  const router = useRouter();
  const zones = useAppStore(state => state.zones);
  const setZones = useAppStore(state => state.setZones);

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [forecastMode, setForecastMode] = useState<'today' | 'tomorrow'>('today');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [recenterToken, setRecenterToken] = useState(0);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [currentWeatherRisk, setCurrentWeatherRisk] = useState<WeatherRisk | null>(null);
  const [zoneRiskData, setZoneRiskData] = useState<Record<string, { weather: CurrentWeather; risk: WeatherRisk }>>({});

  const zonesRef = useRef<Zone[]>(zones);

  useEffect(() => {
    zonesRef.current = zones;
  }, [zones]);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
  };

  const getZoneColorFromRisk = (level: WeatherRiskLevel): Zone['color'] => {
    if (level === 'low') return 'green';
    if (level === 'moderate') return 'orange';
    return 'red';
  };

  const getRiskScore = (level: WeatherRiskLevel): number => {
    switch (level) {
      case 'severe':
        return 4;
      case 'high':
        return 3;
      case 'moderate':
        return 2;
      default:
        return 1;
    }
  };

  const weatherFromForecast = (item: ForecastItem, cityName: string): CurrentWeather => ({
    temp: item.temp,
    feelsLike: item.feelsLike,
    humidity: item.humidity,
    windSpeed: item.windSpeed,
    description: item.description,
    icon: item.icon,
    main: item.main,
    visibility: 7000,
    pressure: 1000,
    cityName,
  });

  const getWorstForecastRisk = useCallback((items: ForecastItem[], cityName: string): { weather: CurrentWeather; risk: WeatherRisk } | null => {
    if (items.length === 0) return null;

    let worstWeather = weatherFromForecast(items[0], cityName);
    let worstRisk = assessWeatherRisk(worstWeather);

    for (const item of items.slice(1)) {
      const weather = weatherFromForecast(item, cityName);
      const risk = assessWeatherRisk(weather);
      if (getRiskScore(risk.level) > getRiskScore(worstRisk.level)) {
        worstRisk = risk;
        worstWeather = weather;
      }
    }

    return { weather: worstWeather, risk: worstRisk };
  }, []);

  const classifyZones = useCallback(async (mode: 'today' | 'tomorrow') => {
    const sourceZones = zonesRef.current;

    const mapped = await Promise.all(
      sourceZones.map(async (zone) => {
        try {
          if (mode === 'today') {
            const weather = await fetchCurrentWeather(zone.center[0], zone.center[1]);
            const risk = assessWeatherRisk(weather);
            return { zone, weather, risk };
          }

          const forecast = await fetchForecast(zone.center[0], zone.center[1]);
          const tomorrowItems = getTomorrowForecast(forecast);
          const worst = getWorstForecastRisk(tomorrowItems, forecast.city);

          if (!worst) {
            const fallbackWeather = await fetchCurrentWeather(zone.center[0], zone.center[1]);
            return { zone, weather: fallbackWeather, risk: assessWeatherRisk(fallbackWeather) };
          }

          return { zone, weather: worst.weather, risk: worst.risk };
        } catch {
          return null;
        }
      })
    );

    const valid = mapped.filter((item): item is { zone: Zone; weather: CurrentWeather; risk: WeatherRisk } => Boolean(item));

    const nextZoneState: Zone[] = sourceZones.map((zone) => {
      const matched = valid.find(item => item.zone.id === zone.id);
      if (!matched) return zone;

      const nextColor = getZoneColorFromRisk(matched.risk.level);
      const disruption = matched.risk.level === 'low'
        ? undefined
        : {
            type: mode === 'tomorrow' ? `Forecast: ${matched.weather.main}` : `${matched.weather.main} Conditions`,
            severity: matched.risk.label,
            expectedDuration: mode === 'tomorrow' ? 'Tomorrow (rolling 3h windows)' : 'Live now',
            precipitation: `${matched.weather.description}`,
          };

      return {
        ...zone,
        color: nextColor,
        disruption,
      };
    });

    setZones(nextZoneState);

    const byId = valid.reduce<Record<string, { weather: CurrentWeather; risk: WeatherRisk }>>((acc, item) => {
      acc[item.zone.id] = { weather: item.weather, risk: item.risk };
      return acc;
    }, {});
    setZoneRiskData(byId);
  }, [getWorstForecastRisk, setZones]);

  const refreshLiveData = useCallback(async (silent: boolean = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const liveWeather = await fetchCurrentWeather(BANGALORE_LOCATION.latitude, BANGALORE_LOCATION.longitude);
      setCurrentWeather(liveWeather);
      setCurrentWeatherRisk(assessWeatherRisk(liveWeather));

      await classifyZones(forecastMode);
      setLastUpdatedAt(new Date());
    } catch (err) {
      console.log('Risk map weather refresh error:', err);
      setError('Unable to refresh weather. Showing last known zone classification.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [classifyZones, forecastMode]);

  useEffect(() => {
    refreshLiveData(false);

    const interval = setInterval(() => {
      refreshLiveData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshLiveData]);

  useEffect(() => {
    classifyZones(forecastMode).catch((err) => {
      console.log('Zone reclassify error:', err);
    });
  }, [classifyZones, forecastMode]);

  const nearestZone = useMemo(() => {
    let nearest: Zone | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const zone of zones) {
      const dLat = zone.center[0] - BANGALORE_LOCATION.latitude;
      const dLon = zone.center[1] - BANGALORE_LOCATION.longitude;
      const distanceScore = (dLat * dLat) + (dLon * dLon);
      if (distanceScore < nearestDistance) {
        nearestDistance = distanceScore;
        nearest = zone;
      }
    }

    return nearest;
  }, [zones]);

  const selectedZone = selectedZoneId ? zones.find(z => z.id === selectedZoneId) ?? null : null;
  const selectedZoneWeather = selectedZone ? zoneRiskData[selectedZone.id]?.weather : null;
  const selectedZoneRisk = selectedZone ? zoneRiskData[selectedZone.id]?.risk : null;

  const activeRiskCount = zones.filter(zone => zone.color !== 'green').length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerMain}>
          <Text style={styles.title}>Live Weather Risk Map</Text>
          <Text style={styles.subtitle}>Fixed Bengaluru baseline with real-time weather classification</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => refreshLiveData(true)} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#0F172A" />
          ) : (
            <Ionicons name="refresh" size={20} color="#0F172A" />
          )}
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.weatherStrip}>
        {loading ? (
          <View style={styles.weatherStripLoading}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.weatherStripText}>Syncing weather intelligence...</Text>
          </View>
        ) : (
          <>
            <View style={styles.weatherMetaLeft}>
              <Text style={styles.weatherCity}>{currentWeather?.cityName ?? 'Current Location'}</Text>
              <Text style={styles.weatherSummary}>
                {currentWeather ? `${currentWeather.temp}° · ${currentWeather.description}` : 'Live weather unavailable'}
              </Text>
            </View>
            <View style={styles.weatherMetaRight}>
              <Text style={[styles.riskChip, { backgroundColor: (currentWeatherRisk?.color ?? '#64748B') + '25' }]}>
                {currentWeatherRisk?.label ?? 'No Risk Data'}
              </Text>
              {lastUpdatedAt && (
                <Text style={styles.lastUpdatedText}>
                  Updated {lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
          </>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.quickStatsRow}>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{activeRiskCount}</Text>
          <Text style={styles.quickStatLabel}>Risky Zones</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{zones.length}</Text>
          <Text style={styles.quickStatLabel}>Tracked Zones</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{nearestZone ? nearestZone.name.split(' ')[0] : '-'}</Text>
          <Text style={styles.quickStatLabel}>Nearest Zone</Text>
        </View>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterBtn, forecastMode === 'today' && styles.filterBtnActive]}
          onPress={() => setForecastMode('today')}
        >
          <Text style={[styles.filterText, forecastMode === 'today' && styles.filterTextActive]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, forecastMode === 'tomorrow' && styles.filterBtnActive]}
          onPress={() => setForecastMode('tomorrow')}
        >
          <Text style={[styles.filterText, forecastMode === 'tomorrow' && styles.filterTextActive]}>Tomorrow Forecast</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapComponent onZoneClick={handleZoneClick} userLocation={BANGALORE_LOCATION} recenterToken={recenterToken} />

        {/* Floating Legends */}
        <View style={styles.legendOverlay}>
          <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#10B981' }]} /><Text style={styles.legendText}>Low Risk</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} /><Text style={styles.legendText}>Moderate Risk</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} /><Text style={styles.legendText}>High / Severe</Text></View>
        </View>

        <TouchableOpacity
          style={styles.recenterFab}
          onPress={() => setRecenterToken((t) => t + 1)}
          activeOpacity={0.85}
        >
          <Ionicons name="navigate" size={18} color="#FFFFFF" />
          <Text style={styles.recenterFabText}>Go to Pin</Text>
        </TouchableOpacity>
      </View>

      {/* Side/Bottom Drawer for Zone Details */}
      {selectedZone && (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>{selectedZone.name}</Text>
            <TouchableOpacity onPress={() => setSelectedZoneId(null)}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.drawerZoneId}>ID: {selectedZone.id}</Text>
          
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, { backgroundColor: selectedZone.color === 'red' ? '#EF4444' : selectedZone.color === 'orange' ? '#F59E0B' : '#10B981' }]} />
            <Text style={styles.statusPillText}>
              {selectedZone.color === 'red' ? 'SEVERE DISRUPTION' : selectedZone.color === 'orange' ? 'MODERATE RISK' : 'NO DISRUPTION'}
            </Text>
          </View>

          {selectedZoneWeather && (
            <View style={styles.zoneWeatherCard}>
              <View style={styles.zoneWeatherTop}>
                <View>
                  <Text style={styles.zoneWeatherTemp}>{selectedZoneWeather.temp}°C</Text>
                  <Text style={styles.zoneWeatherDesc}>{selectedZoneWeather.description}</Text>
                </View>
                <Image source={{ uri: getWeatherIconUrl(selectedZoneWeather.icon) }} style={styles.zoneWeatherIcon} />
              </View>
              <Text style={styles.zoneWeatherFact}>
                Wind {selectedZoneWeather.windSpeed} m/s · Humidity {selectedZoneWeather.humidity}% · Visibility {(selectedZoneWeather.visibility / 1000).toFixed(1)} km
              </Text>
              {selectedZoneRisk?.factors?.[0] && (
                <Text style={styles.zoneRiskReason}>Primary factor: {selectedZoneRisk.factors[0]}</Text>
              )}
            </View>
          )}

          {selectedZone.disruption ? (
            <View style={styles.disruptionBox}>
              <Text style={styles.detailLabel}>Disruption Type</Text>
              <Text style={styles.detailValue}>{selectedZone.disruption.type}</Text>
              
              <Text style={[styles.detailLabel, { marginTop: 12 }]}>Expected Duration</Text>
              <Text style={styles.detailValue}>{selectedZone.disruption.expectedDuration}</Text>

              {selectedZone.disruption.precipitation ? (
                <>
                  <Text style={[styles.detailLabel, { marginTop: 12 }]}>Weather Trigger</Text>
                  <Text style={styles.detailValue}>{selectedZone.disruption.precipitation}</Text>
                </>
              ) : null}
            </View>
          ) : (
            <View style={styles.disruptionBoxSafe}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.safeText}>This zone is perfectly safe for operations.</Text>
            </View>
          )}

          <View style={styles.drawerActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(worker)/routes')}>
              <Text style={styles.primaryBtnText}>Find Safe Route Near Here</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Report Incorrect Classification</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { marginRight: 14 },
  headerMain: { flex: 1 },
  title: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 12, fontWeight: '500', color: '#475569', marginTop: 2 },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  weatherStrip: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  weatherStripLoading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  weatherStripText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  weatherMetaLeft: { flex: 1 },
  weatherMetaRight: { alignItems: 'flex-end' },
  weatherCity: { fontSize: 13, color: '#334155', fontWeight: '700' },
  weatherSummary: { marginTop: 2, fontSize: 12, color: '#64748B', fontWeight: '500', textTransform: 'capitalize' },
  riskChip: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  lastUpdatedText: { marginTop: 4, fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  errorText: { marginHorizontal: 20, color: '#B91C1C', fontSize: 12, marginTop: 4 },

  quickStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  quickStatValue: { fontSize: 16, color: '#0F172A', fontWeight: '800' },
  quickStatLabel: { marginTop: 2, fontSize: 11, color: '#64748B', fontWeight: '600' },
  
  filtersRow: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFFFFF', zIndex: 10 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F8FAFC', marginRight: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  filterBtnActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#FFFFFF' },

  mapContainer: { flex: 1, position: 'relative' },
  
  legendOverlay: { position: 'absolute', top: 16, right: 16, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, zIndex: 500 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  recenterFab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 600,
  },
  recenterFabText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  drawer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, zIndex: 1000 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  drawerTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  drawerZoneId: { fontSize: 12, color: '#94A3B8', fontWeight: '700', marginBottom: 16 },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusPillText: { fontSize: 12, fontWeight: '800', color: '#334155', letterSpacing: 0.5 },

  disruptionBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#FECACA' },
  disruptionBoxSafe: { backgroundColor: '#ECFDF5', padding: 16, borderRadius: 12, marginBottom: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#A7F3D0' },
  safeText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#065F46', fontWeight: '600' },
  
  detailLabel: { fontSize: 12, color: '#991B1B', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  detailValue: { fontSize: 16, color: '#7F1D1D', fontWeight: '800' },

  zoneWeatherCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  zoneWeatherTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  zoneWeatherTemp: { fontSize: 24, color: '#1E3A8A', fontWeight: '900' },
  zoneWeatherDesc: { marginTop: 2, color: '#1D4ED8', textTransform: 'capitalize', fontWeight: '600' },
  zoneWeatherIcon: { width: 44, height: 44 },
  zoneWeatherFact: { marginTop: 8, color: '#334155', fontSize: 12, fontWeight: '500' },
  zoneRiskReason: { marginTop: 6, color: '#0F172A', fontSize: 12, fontWeight: '600' },

  drawerActions: { gap: 12 },
  primaryBtn: { backgroundColor: '#0F172A', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { backgroundColor: '#FFFFFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  secondaryBtnText: { color: '#64748B', fontSize: 15, fontWeight: '700' }
});
