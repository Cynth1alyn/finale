'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { users, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = (notif: { id: string; related_link?: string; is_read: boolean; title: string; message: string; timestamp: string }) => {
    markNotificationAsRead(notif.id);
    setIsNotifOpen(false);
    if (notif.related_link) {
      router.push(notif.related_link);
    }
  };

  const timeAgo = (dateStr: string) => {
    const min = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (min < 1) return 'เมื่อสักครู่';
    if (min < 60) return `${min} นาทีที่แล้ว`;
    if (min < 1440) return `${Math.floor(min/60)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(min/1440)} วันที่แล้ว`;
  };

  return (
    <header className="topbar">
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>

      {/* Notification */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <div style={{
          width: 38, height: 38,
          background: isNotifOpen ? 'var(--border-light)' : 'var(--bg-hover)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)',
          transition: 'background 0.15s',
          cursor: 'pointer'
        }}
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          onMouseEnter={e => { if (!isNotifOpen) (e.currentTarget as HTMLElement).style.background = 'var(--border-light)' }}
          onMouseLeave={e => { if (!isNotifOpen) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
        ><Bell size={17} strokeWidth={2} /></div>
        
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 17, height: 17,
            background: 'var(--accent-rose)',
            borderRadius: '50%',
            fontSize: 10, fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-secondary)',
            pointerEvents: 'none'
          }}>{unreadCount}</span>
        )}

        {/* Dropdown Menu */}
        {isNotifOpen && (
          <div className="card animate-scale-up" style={{
            position: 'absolute', top: 50, right: 0,
            width: 320, padding: 0, zIndex: 100,
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>การแจ้งเตือน</div>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllNotificationsAsRead()}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}
                >
                  อ่านทั้งหมด
                </button>
              )}
            </div>
            
            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>ไม่มีการแจ้งเตือน</div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className="hover-bg"
                    onClick={() => handleNotifClick(n)}
                    style={{ 
                      padding: '14px 16px', 
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: n.is_read ? 'transparent' : 'rgba(59,130,246,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: n.is_read ? 500 : 700, color: 'var(--text-primary)' }}>{n.title}</div>
                      {!n.is_read && <div style={{ width: 8, height: 8, background: 'var(--accent-blue)', borderRadius: '50%', marginTop: 4 }}></div>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{timeAgo(n.timestamp)}</div>
                  </div>
                ))
              )}
            </div>
            
            <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--border-color)', background: 'var(--bg-hover)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>แจ้งเตือนระบบ TechJob</span>
            </div>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

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
      <Link href="/profile" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.15s' }}
             onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
             onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
          <div 
            className="avatar avatar-md" 
            style={{ 
              background: users.find(u => u.user_id === 'U001')?.avatar_color || 'linear-gradient(135deg,#3B82F6,#8B5CF6)', 
              fontSize: 13, color: '#fff' 
            }}
          >
            {users.find(u => u.user_id === 'U001') ? `${users.find(u => u.user_id === 'U001')?.firstname[0]}${users.find(u => u.user_id === 'U001')?.lastname[0]}` : '?'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{users.find(u => u.user_id === 'U001')?.firstname || 'User'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{users.find(u => u.user_id === 'U001')?.role || 'Admin'}</div>
          </div>
        </div>
      </Link>
    </header>
  );
}
