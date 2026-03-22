import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  trend?: string;
  trendUp?: boolean;
  sub?: string;
}

export default function StatCard({ label, value, icon, color, trend, trendUp, sub }: StatCardProps) {
  return (
    <div className="card animate-fade-in" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{
          width: 44, height: 44,
          background: `${color}20`,
          border: `1px solid ${color}40`,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{icon}</div>
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: trendUp ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            background: trendUp ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
            padding: '2px 7px', borderRadius: 6,
          }}>{trendUp ? '↑' : '↓'} {trend}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs เดือนที่แล้ว</span>
        </div>
      )}
    </div>
  );
}
