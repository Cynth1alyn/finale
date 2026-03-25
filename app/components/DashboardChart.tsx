'use client';

import React from 'react';

interface DashboardChartProps {
  title: string;
  data: { label: string; value: number }[];
  color?: string;
}

export default function DashboardChart({ title, data, color = '#3B82F6' }: DashboardChartProps) {
  const maxVal = Math.max(...data.map(d => d.value), 10);
  const chartHeight = 160;
  const padding = 20;
  const usableHeight = chartHeight - padding * 2;
  const barWidth = 36;
  const gap = 12;

  return (
    <div className="card glass-premium" style={{ padding: '24px', flex: 1, minWidth: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>7 วันล่าสุด</div>
      </div>

      <div style={{ height: chartHeight, display: 'flex', alignItems: 'flex-end', gap: gap, paddingBottom: 24, position: 'relative' }}>
        {/* Y-axis grid lines */}
        {[0, 0.5, 1].map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: padding + p * usableHeight,
            left: 0, right: 0,
            borderBottom: '1px dashed var(--border-color)',
            opacity: 0.5,
            zIndex: 0
          }} />
        ))}

        {data.map((d, i) => {
          const height = (d.value / maxVal) * usableHeight;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1 }}>
              <div 
                className="animate-grow-up"
                style={{ 
                  width: '100%', 
                  maxWidth: barWidth,
                  height: height, 
                  background: `linear-gradient(to top, ${color}, ${color}CC)`,
                  borderRadius: '6px 6px 2px 2px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: `0 4px 12px ${color}30`
                }}
                title={`${d.label}: ${d.value}`}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* Tooltip on hover (simplified) */}
                <div style={{
                  position: 'absolute',
                  top: -24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: '1px solid var(--border-color)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  pointerEvents: 'none'
                }} className="chart-tooltip">
                  {d.value}
                </div>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
