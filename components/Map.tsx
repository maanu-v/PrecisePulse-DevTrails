import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useAppStore } from '../store/mockDataStore';

// Generate hex polygon coordinates around a center point
const getHexagonRing = (center: [number, number], radius: number): { latitude: number; longitude: number }[] => {
  const points: { latitude: number; longitude: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i + 30;
    const angle_rad = (Math.PI / 180) * angle_deg;
    points.push({
      latitude: center[0] + radius * Math.cos(angle_rad),
      longitude: center[1] + radius * 1.5 * Math.sin(angle_rad),
    });
  }
  return points;
};

const getColorHex = (color: string) => {
  switch (color) {
    case 'red': return '#EF4444';
    case 'orange': return '#F59E0B';
    case 'green': return '#10B981';
    default: return '#94A3B8';
  }
};

const getFillColor = (color: string) => {
  switch (color) {
    case 'red': return 'rgba(239, 68, 68, 0.35)';
    case 'orange': return 'rgba(245, 158, 11, 0.30)';
    case 'green': return 'rgba(16, 185, 129, 0.25)';
    default: return 'rgba(148, 163, 184, 0.2)';
  }
};

// Fallback to Bangalore if location is unavailable
const BANGALORE_REGION: Region = {
  latitude: 12.9516,
  longitude: 77.6600,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

interface MapProps {
  onZoneClick?: (zoneId: string) => void;
  userLocation?: { latitude: number; longitude: number };
  recenterToken?: number;
}

export default function NativeMap({
  onZoneClick,
  userLocation: externalUserLocation,
  recenterToken,
}: MapProps) {
  const zones = useAppStore(state => state.zones);
  const mapRef = useRef<MapView>(null);
  const [initialRegion, setInitialRegion] = useState<Region>(BANGALORE_REGION);
  const activeLocation = externalUserLocation ?? {
    latitude: BANGALORE_REGION.latitude,
    longitude: BANGALORE_REGION.longitude,
  };

  useEffect(() => {
    if (externalUserLocation) {
      setInitialRegion({
        latitude: externalUserLocation.latitude,
        longitude: externalUserLocation.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      });
      return;
    }

    setInitialRegion(BANGALORE_REGION);
  }, [externalUserLocation]);

  useEffect(() => {
    if (recenterToken === undefined) return;

    mapRef.current?.animateToRegion(
      {
        latitude: activeLocation.latitude,
        longitude: activeLocation.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      500
    );
  }, [activeLocation.latitude, activeLocation.longitude, recenterToken]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      initialRegion={initialRegion}
      showsUserLocation={false}
      showsMyLocationButton={false}
      showsCompass={true}
      showsScale={false}
      mapType="standard"
      customMapStyle={mapStyle}
    >
      {/* Risk Zone Polygons */}
      {zones.map(zone => (
        <React.Fragment key={zone.id}>
          <Polygon
            coordinates={getHexagonRing(zone.center, 0.015)}
            strokeColor={getColorHex(zone.color)}
            fillColor={getFillColor(zone.color)}
            strokeWidth={2}
            tappable
            onPress={() => onZoneClick?.(zone.id)}
          />
          <Marker
            coordinate={{ latitude: zone.center[0], longitude: zone.center[1] }}
            onPress={() => onZoneClick?.(zone.id)}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.zoneLabel, { backgroundColor: getColorHex(zone.color) + '20', borderColor: getColorHex(zone.color) }]}>
              <Text style={[styles.zoneLabelText, { color: getColorHex(zone.color) }]}>{zone.name.split(' ')[0]}</Text>
            </View>
          </Marker>
        </React.Fragment>
      ))}

      <Marker
        coordinate={activeLocation}
        tracksViewChanges={false}
        anchor={{ x: 0.5, y: 1 }}
      >
        <View style={styles.userPinWrap}>
          <View style={styles.userPinHead}>
            <View style={styles.userPinDot} />
          </View>
          <View style={styles.userPinStem} />
          <View style={styles.userPinShadow} />
        </View>
      </Marker>
    </MapView>
  );
}

// Clean map style
const mapStyle = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#D1E4F1' }] },
  { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#F1F5F9' }] },
];

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  zoneLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  zoneLabelText: {
    fontSize: 11,
    fontWeight: '800',
  },
  userPinWrap: {
    alignItems: 'center',
  },
  userPinHead: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  userPinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  userPinStem: {
    width: 2,
    height: 10,
    backgroundColor: '#2563EB',
    marginTop: -2,
  },
  userPinShadow: {
    width: 14,
    height: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    marginTop: 2,
  },
});
