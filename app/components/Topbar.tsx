'use client';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="topbar">
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>

      {/* Notification */}
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{
          width: 38, height: 38,
          background: 'var(--bg-hover)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--border-light)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
        >🔔</div>
        <span style={{
          position: 'absolute', top: -4, right: -4,
          width: 17, height: 17,
          background: 'var(--accent-rose)',
          borderRadius: '50%',
          fontSize: 10, fontWeight: 700, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid var(--bg-secondary)',
        }}>3</span>
      </div>

      {/* Date */}
      <div style={{
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        padding: '7px 14px',
        fontSize: 12,
        color: 'var(--text-secondary)',
        fontWeight: 500,
      }}>
        {new Date().toLocaleDateString('th-TH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
      </div>

      {/* User avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
        <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', fontSize: 13 }}>ธน</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>ธนาวุฒิ</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Admin</div>
        </div>
      </div>
    </header>
  );
}
