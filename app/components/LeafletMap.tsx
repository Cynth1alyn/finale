'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix typical React Leaflet marker icon issue
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { MarkerData } from './MapComponent';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina.src ?? iconRetina,
  iconUrl: iconUrl.src ?? iconUrl,
  shadowUrl: shadowUrl.src ?? shadowUrl,
});

const defaultCenter: [number, number] = [13.736717, 100.523186]; // Bangkok Center

function MapController({ onSelect, readOnly, activeMarkerId, markerRefs }: { onSelect?: (lat: number, lng: number) => void, readOnly: boolean, activeMarkerId?: string | null, markerRefs: React.MutableRefObject<{[key:string]: L.Marker}> }) {
  const map = useMapEvents({
    click(e) {
      if (!readOnly && onSelect) {
        onSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  useEffect(() => {
    if (activeMarkerId && markerRefs.current[activeMarkerId]) {
      const marker = markerRefs.current[activeMarkerId];
      marker.openPopup();
      map.flyTo(marker.getLatLng(), 16, { animate: true, duration: 1.2 });
    }
  }, [activeMarkerId, map, markerRefs]);

  return null;
}

export default function LeafletMap({ 
  markers = [], 
  readOnly = false, 
  selectedPos, 
  activeMarkerId,
  onPositionSelect,
  height = '300px'
}: { 
  markers?: MarkerData[], 
  readOnly?: boolean, 
  selectedPos?: { lat: number, lng: number } | null, 
  activeMarkerId?: string | null,
  onPositionSelect?: (lat: number, lng: number) => void,
  height?: string | number
}) {
  const markerRefs = useRef<{ [key: string]: L.Marker }>({});
  const center = selectedPos ? [selectedPos.lat, selectedPos.lng] : markers.length > 0 ? [markers[0].lat, markers[0].lng] : defaultCenter;

  const getCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <MapContainer center={center as L.LatLngExpression} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render read-only markers */}
        {markers.map((m) => (
          <Marker 
            key={m.id} 
            position={[m.lat, m.lng]} 
            icon={m.color ? getCustomIcon(m.color) : new L.Icon.Default()}
            ref={(r) => { if (r) markerRefs.current[m.id] = r; }}
            eventHandlers={{
              click: () => {
                if (m.onClick) m.onClick();
              }
            }}
          >
            <Popup>
              <div style={{ fontWeight: 600 }}>{m.title}</div>
              {m.subtitle && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{m.subtitle}</div>}
              {m.link && (
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <a 
                    href={m.link} 
                    style={{ 
                      display: 'inline-block', padding: '6px 12px', background: 'var(--accent-blue)', 
                      color: '#fff', textDecoration: 'none', borderRadius: 4, fontSize: 12, fontWeight: 500
                    }}
                  >
                    ดูรายละเอียด
                  </a>
                </div>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Render selection pin */}
        {selectedPos && !readOnly && (
          <Marker position={[selectedPos.lat, selectedPos.lng]} />
        )}

        <MapController onSelect={onPositionSelect} readOnly={readOnly} activeMarkerId={activeMarkerId} markerRefs={markerRefs} />
      </MapContainer>
    </div>
  );
}
