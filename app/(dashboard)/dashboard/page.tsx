'use client';

import StatCard from '@/app/components/StatCard';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';
import Link from 'next/link';
import { useAppContext } from '@/app/lib/AppContext';

export default function DashboardPage() {
  const { jobs, issues, users, requests, equipment, units } = useAppContext();

  const totalJobs       = jobs.length;
  const activeJobs      = jobs.filter(j => j.job_status === 'in-progress').length;
  const openIssues      = issues.filter(i => i.status === 'open' || i.status === 'in-progress').length;
  const pendingRequests = requests.filter(r => r.req_status === 'pending').length;
  const totalUsers      = users.length;

  const recentJobs      = [...jobs].sort((a, b) => b.start_date.localeCompare(a.start_date)).slice(0, 5);
  const recentIssues    = [...issues].sort((a, b) => b.report_date.localeCompare(a.report_date)).slice(0, 5);
  const recentRequests  = [...requests].sort((a, b) => b.req_date.localeCompare(a.req_date)).slice(0, 5);
  
  // Find low stock equipment (e.g. remain_qty <= 3)
  const lowStockEquipment = equipment.filter(e => e.remain_qty <= 3).sort((a, b) => a.remain_qty - b.remain_qty).slice(0, 5);

  const getUserName = (ids: string[]) => ids.map(id => {
    const u = users.find(u => u.user_id === id);
    return u ? `${u.firstname}` : '—';
  }).join(', ');

  const getSingleUserName = (id: string) => {
    const u = users.find(u => u.user_id === id);
    return u ? `${u.firstname} ${u.lastname}` : '—';
  }

  const getUnitName = (id: string) => {
    return units.find(u => u.unit_id === id)?.unit_name || 'ชิ้น';
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">ภาพรวมระบบ</div>
          <div className="page-subtitle">ยินดีต้อนรับ, กลับเข้าสู่ระบบจัดการไอที 👋 — วันนี้มีงาน {activeJobs} รายการที่กำลังดำเนินการ</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/jobs" className="btn btn-secondary btn-sm">ดูงานทั้งหมด</Link>
          {/* Removed "+ สร้างรายงาน" button */}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="งานทั้งหมด"       value={totalJobs}       icon="⚙" color="#3B82F6" trend="12%" trendUp />
        <StatCard label="งานที่ดำเนินการ"  value={activeJobs}      icon="🔄" color="#F59E0B" trend="5%"  trendUp />
        <StatCard label="ปัญหาที่เปิดอยู่" value={openIssues}      icon="⚠" color="#F43F5E" trend="3%"  trendUp={false} />
        <StatCard label="คำขอที่รอ"         value={pendingRequests} icon="📋" color="#8B5CF6" sub={`${totalUsers} ผู้ใช้งานในระบบ`} />
      </div>

      {/* Content grid */}
      <div className="section-grid">
        {/* Recent Jobs */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>งานล่าสุด</div>
            <Link href="/jobs" style={{ fontSize: 12, color: 'var(--accent-blue-light)', textDecoration: 'none', fontWeight: 500 }}>ดูทั้งหมด →</Link>
          </div>
          <div>
            {recentJobs.map((job, i) => (
              <Link key={job.job_id} href={`/jobs`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="hover-bg" style={{
                  padding: '14px 20px',
                  borderBottom: i < recentJobs.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.job_title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>ผู้รับผิดชอบ: {getUserName(job.assigned_user_ids)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <StatusBadge status={job.job_status} />
                    <PriorityBadge priority={job.job_priority} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Issues */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>ปัญหาล่าสุด</div>
            <Link href="/issues" style={{ fontSize: 12, color: 'var(--accent-blue-light)', textDecoration: 'none', fontWeight: 500 }}>ดูทั้งหมด →</Link>
          </div>
          <div>
            {recentIssues.map((issue, i) => {
              const reporter = users.find(u => u.user_id === issue.reporter_id);
              return (
                <Link key={issue.issue_id} href={`/issues`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="hover-bg" style={{
                    padding: '14px 20px',
                    borderBottom: i < recentIssues.length - 1 ? '1px solid var(--border-color)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'background 0.15s',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.topic}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>แจ้งโดย: {reporter ? `${reporter.firstname} ${reporter.lastname}` : '—'} · {issue.report_date}</div>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Low Stock Equipment */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>อุปกรณ์ใกล้หมด ⚠️</div>
            <Link href="/equipment" style={{ fontSize: 12, color: 'var(--accent-blue-light)', textDecoration: 'none', fontWeight: 500 }}>ตรวจสอบ →</Link>
          </div>
          <div>
            {lowStockEquipment.length === 0 ? (
              <div style={{ padding: 20, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>ไม่มีอุปกรณ์ที่สต็อกคงเหลือน้อย</div>
            ) : lowStockEquipment.map((eq, i) => (
              <Link key={eq.equip_id} href={`/equipment`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="hover-bg" style={{
                  padding: '14px 20px',
                  borderBottom: i < lowStockEquipment.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'background 0.15s',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>หมวดหมู่: {eq.type_category}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: eq.remain_qty === 0 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>เหลือ {eq.remain_qty}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>จากทั้งหมด {eq.total_qty} {getUnitName(eq.unit_id)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>คำขอเบิกอุปกรณ์ล่าสุด</div>
            <Link href="/requests" style={{ fontSize: 12, color: 'var(--accent-blue-light)', textDecoration: 'none', fontWeight: 500 }}>ตรวจสอบ →</Link>
          </div>
          <div>
            {recentRequests.length === 0 ? (
              <div style={{ padding: 20, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>ไม่มีคำขอเบิกอุปกรณ์</div>
            ) : recentRequests.map((req, i) => (
              <Link key={req.req_id} href={`/requests`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="hover-bg" style={{
                  padding: '14px 20px',
                  borderBottom: i < recentRequests.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'background 0.15s',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>คำขอรหัส {req.req_id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>ผู้ขอ: {getSingleUserName(req.user_id)} · {req.req_date}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <StatusBadge status={req.req_status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="card animate-fade-in" style={{ padding: '20px', marginTop: 20 }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15, marginBottom: 14 }}>การดำเนินการด่วน</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { href: '/jobs',        label: '+ มอบหมายงานใหม่', icon: '⚙', color: '#3B82F6' },
            { href: '/issues',      label: '+ แจ้งปัญหา',       icon: '⚠', color: '#F43F5E' },
            { href: '/requests',    label: '+ สร้างคำขอ',        icon: '📋', color: '#8B5CF6' },
            { href: '/equipment',   label: 'ตรวจสอบอุปกรณ์',    icon: '🖥', color: '#10B981' },
            { href: '/map',         label: 'ดูแผนที่ภาพรวม',    icon: '🗺', color: '#3B82F6' },
          ].map(a => (
            <Link key={a.href} href={a.href} className="btn btn-secondary" style={{ borderColor: `${a.color}40`, gap: 8 }}>
              <span>{a.icon}</span> {a.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
