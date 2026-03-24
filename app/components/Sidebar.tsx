'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import {
  LayoutDashboard,
  Map,
  Settings,
  Users,
  Building2,
  AlertTriangle,
  ClipboardList,
  Monitor,
  LogOut,
  FileText,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/map', label: 'แผนที่', icon: Map },
  { href: '/jobs-view', label: 'ติดตามงาน', icon: Briefcase },
  { href: '/jobs', label: 'จัดการงาน', icon: Settings },
  { href: '/users', label: 'ผู้ใช้งาน', icon: Users },
  { href: '/departments', label: 'แผนก', icon: Building2 },
  { href: '/issues', label: 'รายงานปัญหา', icon: FileText },
  { href: '/issues/new', label: 'แจ้งปัญหา', icon: AlertTriangle },
  { href: '/requests', label: 'คำขอ', icon: ClipboardList },
  { href: '/equipment', label: 'อุปกรณ์', icon: Monitor },
];


export default function Sidebar() {
  const pathname = usePathname();
  const { users, jobs, issues, requests, equipment } = useAppContext();

  const pendingJobs = jobs.filter(j => j.job_status === 'pending').length;
  const openIssues = issues.filter(i => i.status === 'open' || i.status === 'in-progress').length;
  const pendingRequests = requests.filter(r => r.req_status === 'pending').length;
  const lowStockEquip = equipment.filter(e => e.remain_qty <= 3).length;

  const getBadgeCount = (href: string) => {
    switch (href) {
      case '/jobs': return pendingJobs;
      case '/issues': return openIssues;
      case '/requests': return pendingRequests;
      case '/equipment': return lowStockEquip;
      default: return 0;
    }
  };

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
          const badgeCount = getBadgeCount(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'linear-gradient(90deg,rgba(59,130,246,0.25),rgba(139,92,246,0.15))' : 'transparent',
                borderLeft: active ? '2px solid var(--accent-blue)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <item.icon size={17} strokeWidth={2} style={{ width: 20, flexShrink: 0 }} />
                {item.label}
              </div>
              {badgeCount > 0 && (
                <div style={{
                  background: item.href === '/equipment' ? 'var(--accent-amber)' : 'var(--accent-rose)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 10,
                  minWidth: 18,
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                  {badgeCount}
                </div>
              )}
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
        <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s', display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent-rose)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
          title="ออกจากระบบ"
        ><LogOut size={16} strokeWidth={2} /></Link>
      </div>
    </aside>
  );
}
