'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';

const navItems = [
  { href: '/dashboard',   label: 'Dashboard',    icon: '◈' },
  { href: '/map',         label: 'แผนที่',        icon: '🗺' },
  { href: '/jobs',        label: 'งาน (Jobs)',    icon: '⚙' },
  { href: '/users',       label: 'ผู้ใช้งาน',    icon: '👤' },
  { href: '/departments', label: 'แผนก',          icon: '🏢' },
  { href: '/issues',      label: 'แจ้งปัญหา',    icon: '⚠' },
  { href: '/requests',    label: 'คำขอ',          icon: '📋' },
  { href: '/equipment',   label: 'อุปกรณ์',       icon: '🖥' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { users } = useAppContext();
  
  // Mock logged in user is U001
  const currentUser = users.find(u => u.user_id === 'U001') || users[0];

  const initials = currentUser ? `${currentUser.firstname[0]}${currentUser.lastname[0]}` : '?';

  return (
    <aside className="sidebar animate-slide-left">
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff',
            boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
          }}>T</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>TechJob</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>IT Management</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 10px 6px' }}>
          เมนูหลัก
        </div>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? '#fff' : 'var(--text-secondary)',
                background: active ? 'linear-gradient(90deg,rgba(59,130,246,0.25),rgba(139,92,246,0.15))' : 'transparent',
                borderLeft: active ? '2px solid var(--accent-blue)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer user */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div className="avatar avatar-md" style={{ background: currentUser?.avatar_color || 'linear-gradient(135deg,#3B82F6,#8B5CF6)', fontSize: 13, color: '#fff' }}>
            {initials}
          </div>
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.15s' }}
                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent-blue)'}
                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}>
              {currentUser?.firstname} {currentUser?.lastname}
            </div>
          </Link>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{currentUser?.role || 'Administrator'}</div>
        </div>
        <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 16, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent-rose)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
          title="ออกจากระบบ"
        >⏻</Link>
      </div>
    </aside>
  );
}
