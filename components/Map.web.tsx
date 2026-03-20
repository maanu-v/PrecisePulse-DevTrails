import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { CircleMarker, MapContainer, Polygon, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { useAppStore } from '../store/mockDataStore';

// Roughly generates a hexagon path given a center [lat, lng] and radius in degrees (e.g., ~0.01)
const getHexagonRing = (center: [number, number], radius: number): [number, number][] => {
  const points: [number, number][] = [];
  // 6 points for a hexagon
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i + 30; // Pointy topped
    const angle_rad = Math.PI / 180 * angle_deg;
    points.push([
      center[0] + radius * Math.cos(angle_rad),
      center[1] + (radius * 1.5) * Math.sin(angle_rad) // compensate roughly for longitude squish
    ]);
  }
  return points;
};

const getColorMap = (color: string) => {
  switch(color) {
    case 'red': return '#EF4444';
    case 'orange': return '#F59E0B';
    case 'green': return '#10B981';
    default: return '#94A3B8';
  }
};

function RecenterMap({ center, recenterToken }: { center?: { latitude: number; longitude: number }; recenterToken?: number }) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;
    map.setView([center.latitude, center.longitude], map.getZoom(), { animate: true });
  }, [center, map, recenterToken]);

  return null;
}

export default function WebMap({
  onZoneClick,
  userLocation,
  recenterToken,
}: {
  onZoneClick: (zoneId: string) => void;
  userLocation?: { latitude: number; longitude: number };
  recenterToken?: number;
}) {
  const zones = useAppStore(state => state.zones);
  
  if (typeof window === 'undefined') return null; // Avoid SSR issues

  return (
    <div style={{ flex: 1, height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={userLocation ? [userLocation.latitude, userLocation.longitude] : [12.9716, 77.5946]}
        zoom={12} 
        style={{ height: '100%', width: '100%', borderRadius: 12 }}
        zoomControl={false}
      >
        <RecenterMap center={userLocation} recenterToken={recenterToken} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        
        {zones.map((zone) => (
          <Polygon 
            key={zone.id}
            positions={getHexagonRing(zone.center, 0.015)}
            pathOptions={{ 
              color: getColorMap(zone.color), 
              fillColor: getColorMap(zone.color),
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: () => onZoneClick(zone.id)
            }}
          >
            <Popup>
              <strong>{zone.name}</strong><br/>
              Status: {zone.color.toUpperCase()}<br/>
              {zone.disruption && `Disruption: ${zone.disruption.type}`}
            </Popup>
          </Polygon>
        ))}

        {userLocation ? (
          <CircleMarker
            center={[userLocation.latitude, userLocation.longitude]}
            radius={9}
            pathOptions={{
              color: '#FFFFFF',
              weight: 2,
              fillColor: '#2563EB',
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} permanent>
              You are here
            </Tooltip>
          </CircleMarker>
        ) : null}
      </MapContainer>
    </div>
  );
}
