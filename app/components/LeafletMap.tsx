'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
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

function SearchControl({ onSelect }: { onSelect?: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlRef.current) {
      L.DomEvent.disableClickPropagation(controlRef.current);
      L.DomEvent.disableScrollPropagation(controlRef.current);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&countrycodes=th&accept-language=th`);
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSelect = (item: Record<string, string>) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon); // Nominatim outputs lon
    map.flyTo([lat, lng], 16, { animate: true });
    if (onSelect) onSelect(lat, lng);
    setShowResults(false);
  };

  return (
    <div 
      className="leaflet-top leaflet-right" 
      style={{ pointerEvents: 'auto', marginRight: 10, marginTop: 10 }}
      ref={controlRef}
    >
      <div className="leaflet-control" style={{ background: 'var(--bg-card)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: 280, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', padding: 4 }}>
          <input 
            type="text" 
            value={query} 
            onChange={e => { setQuery(e.target.value); setShowResults(true); }} 
            placeholder="ค้นหาสถานที่..." 
            style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontSize: 13, background: 'transparent', color: 'var(--text-primary)' }} 
          />
          <button type="submit" style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }} disabled={loading}>
            {loading ? '...' : 'ค้นหา'}
          </button>
        </form>
        {showResults && results.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-color)', maxHeight: 220, overflowY: 'auto', background: 'var(--bg-card)' }}>
            {results.map((r, i) => (
              <div 
                key={i} 
                onClick={() => handleSelect(r)} 
                style={{ padding: '10px 12px', borderBottom: i < results.length - 1 ? '1px solid var(--border-color)' : 'none', fontSize: 12, cursor: 'pointer', color: 'var(--text-primary)', lineHeight: 1.4, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                title={r.display_name}
              >
                {r.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
        
        {/* Render Search inside container but explicitly top right */}
        {!readOnly && <SearchControl onSelect={onPositionSelect} />}
      </MapContainer>
    </div>
  );
}
