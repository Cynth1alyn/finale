'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  color?: string;
  link?: string;
  onClick?: () => void;
}

export interface MapComponentProps {
  markers?: MarkerData[];
  readOnly?: boolean;
  selectedPos?: { lat: number, lng: number } | null;
  activeMarkerId?: string | null;
  onPositionSelect?: (lat: number, lng: number) => void;
  height?: string | number;
}

const DynamicMap = dynamic<MapComponentProps>(() => import('./LeafletMap'), { 
  ssr: false, 
  loading: () => <div style={{ width: '100%', height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-hover)', borderRadius: '8px', color: 'var(--text-muted)' }}>กำลังโหลดแผนที่...</div>
});

export default function MapComponent(props: MapComponentProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: '100%', height: props.height || '300px', background: 'var(--bg-hover)', borderRadius: '8px' }} />;

  return <DynamicMap {...props} />;
}
