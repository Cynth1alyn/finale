'use client';

import Link from 'next/link';
import { useAppContext } from '@/app/lib/AppContext';
import { Briefcase, AlertTriangle, Package, CheckCircle, Activity, Map as MapIcon, Settings, Users, Building2, FileText, ClipboardList, Monitor } from 'lucide-react';

export default function HomePage() {
  const { currentUser, jobs: allJobs, issues, equipment } = useAppContext();

  const jobs = allJobs.filter(j => {
    if (currentUser?.role === 'admin') return true;
    const isLead = j.assigned_lead_id === currentUser?.user_id;
    const isAssignee = j.assigned_user_ids?.includes(currentUser?.user_id || '');
    if ((currentUser?.role === 'technician' || currentUser?.role === 'user') && j.job_status === 'pending') return false;
    return isLead || isAssignee;
  });

  const stats = [
    {
      label: 'งานทั้งหมด',
      value: jobs.length,
      sub: `กำลังดำเนินการ ${jobs.filter(j => j.job_status === 'in-progress').length} งาน`,
      icon: Briefcase,
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
      href: '/jobs-view',
    },
    {
      label: 'ปัญหาที่ยังเปิดอยู่',
      value: issues.filter(i => i.status === 'open' || i.status === 'in-progress').length,
      sub: `ทั้งหมด ${issues.length} รายการ`,
      icon: AlertTriangle,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
      href: '/issues',
    },
    {
      label: 'อุปกรณ์เหลือน้อย',
      value: equipment.filter(e => e.remain_qty <= 3).length,
      sub: `สต็อกทั้งหมด ${equipment.length} รายการ`,
      icon: Package,
      color: '#F43F5E',
      gradient: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(244,63,94,0.05))',
      href: '/equipment',
    },
    {
      label: 'งานเสร็จแล้ว',
      value: jobs.filter(j => j.job_status === 'done').length,
      sub: `${jobs.length > 0 ? Math.round((jobs.filter(j => j.job_status === 'done').length / jobs.length) * 100) : 0}% ของงานทั้งหมด`,
      icon: CheckCircle,
      color: '#10B981',
      gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
      href: '/jobs-view',
    },
  ];

  const recentJobs = jobs.slice(0, 5);
  const pendingIssues = issues.filter(i => i.status === 'open').slice(0, 4);

  const roleDisplay: Record<string, string> = {
    admin: 'ผู้ดูแลระบบ',
    manager: 'ผู้จัดการ',
    technician: 'ช่างเทคนิค',
    user: 'ผู้ใช้งาน',
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'อรุณสวัสดิ์';
    if (h < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  const hasAccess = (href: string) => {
    if (!currentUser) return false;
    const role = currentUser.role;
    if (role === 'admin') return true;
    if (href === '/map') return ['technician', 'user'].includes(role);
    if (href === '/jobs-view') return ['manager', 'technician', 'user'].includes(role);
    if (href === '/issues/new') return ['technician', 'user', 'manager'].includes(role);
    if (href === '/departments') return ['manager'].includes(role);
    // Others are admin-only
    return false;
  };

  const allActions = [
    { href: '/map', label: 'แผนที่งาน', desc: 'ดูพิกัดงานบนแผนที่', icon: MapIcon, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { href: '/jobs-view', label: 'ติดตามงาน', desc: 'ดูและอัปเดตสถานะงาน', icon: Briefcase, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { href: '/jobs', label: 'จัดการงาน', desc: 'เพิ่ม/แก้ไข/ลบ ข้อมูลงาน', icon: Settings, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
    { href: '/users', label: 'ผู้ใช้งาน', desc: 'จัดการบัญชีและสิทธิ์', icon: Users, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
    { href: '/departments', label: 'แผนก', desc: 'จัดการข้อมูลแผนก', icon: Building2, color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
    { href: '/issues', label: 'รายงานปัญหา', desc: 'ดูและจัดการปัญหาทั้งหมด', icon: FileText, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { href: '/issues/new', label: 'แจ้งปัญหา', desc: 'รายงานปัญหาให้แอดมิน', icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    { href: '/requests', label: 'คำขอ', desc: 'ตรวจสอบการเบิกอุปกรณ์', icon: ClipboardList, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
    { href: '/equipment', label: 'อุปกรณ์', desc: 'จัดการสต็อกอุปกรณ์ไอที', icon: Monitor, color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Welcome Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 50%, #1a1a2e 100%)',
        borderRadius: 20,
        padding: '36px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {greeting()} 👋
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>
                {currentUser?.firstname} {currentUser?.lastname}
              </h1>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
                {roleDisplay[currentUser?.role || ''] || currentUser?.role} · TechJob IT Management
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              {stats.filter(s => hasAccess(s.href)).map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <s.icon size={20} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {allActions.filter(a => hasAccess(a.href)).map(action => (
          <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
            <div className="card animate-fade-in" style={{
              padding: '24px', background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${action.color}25`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <action.icon size={24} color={action.color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{action.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{action.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>



      {/* Recent Jobs + Pending Issues */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Jobs */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="var(--accent-blue)" /> งานล่าสุด
            </div>
            <Link href="/jobs-view" style={{ fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>ดูทั้งหมด →</Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentJobs.length === 0 && (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>ยังไม่มีงาน</div>
            )}
            {recentJobs.map(job => {
              const statusColors: Record<string, string> = { pending: '#F59E0B', 'in-progress': '#3B82F6', done: '#10B981', cancelled: '#6B7280' };
              const statusLabel: Record<string, string> = { pending: 'รอ', 'in-progress': 'กำลังทำ', done: 'เสร็จ', cancelled: 'ยกเลิก' };
              return (
                <Link key={job.job_id} href={`/jobs-view/${job.job_id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 12,
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[job.job_status], flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.job_title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>กำหนด: {job.due_date}</div>
                    </div>
                    <span style={{ fontSize: 11, background: `${statusColors[job.job_status]}18`, color: statusColors[job.job_status], padding: '3px 8px', borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>{statusLabel[job.job_status]}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pending Issues */}
        {hasAccess('/issues') && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} color="var(--accent-amber)" /> ปัญหาที่รอดำเนินการ
              </div>
              <Link href="/issues" style={{ fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>ดูทั้งหมด →</Link>
            </div>
            <div style={{ padding: '8px 0' }}>
              {pendingIssues.length === 0 && (
                <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>ไม่มีปัญหาที่รอดำเนินการ ✓</div>
              )}
              {pendingIssues.map(issue => (
                <div key={issue.issue_id} style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border-color)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.topic}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>วันที่แจ้ง: {issue.report_date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
