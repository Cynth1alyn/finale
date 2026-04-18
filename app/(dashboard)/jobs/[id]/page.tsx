'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/lib/AppContext';
import { JobStatus, User } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';
import { MapPin, Phone, User as UserIcon, Crown, Building2, AlertTriangle } from 'lucide-react';

export default function JobDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { id } = params;
  
  const { jobs, users, departments } = useAppContext();
  const job = jobs.find(j => j.job_id === id);

  if (!job) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        ไม่พบงาน #{id}
        <br /><Link href="/jobs" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>← กลับ</Link>
      </div>
    );
  }

  const assignedUsers = (job.assigned_user_ids || []).map(uid => users.find(u => u.user_id === uid)).filter(Boolean) as User[];
  const lead = users.find(u => u.user_id === job.assigned_lead_id);
  const dept = assignedUsers[0] ? departments.find(d => d.dept_id === assignedUsers[0].dept_id) : null;

  const daysLeft = Math.ceil((new Date(job.due_date).getTime() - new Date().getTime()) / 86400000);
  const overdue = daysLeft < 0 && job.job_status !== JobStatus.DONE && job.job_status !== JobStatus.CANCELLED;
  const progressMap: Record<string, number> = { [JobStatus.PENDING]: 0, [JobStatus.IN_PROGRESS]: 50, [JobStatus.DONE]: 100, [JobStatus.CANCELLED]: 0 };
  const progress = progressMap[job.job_status] || 0;

  const avatarColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#EC4899'];

  const roleLabel = (role: string) => {
    if (role === 'technician') return 'ช่างเทคนิค';
    if (role === 'user') return 'ผู้ใช้งาน';
    if (role === 'manager') return 'ผู้จัดการ';
    if (role === 'admin') return 'ผู้ดูแลระบบ';
    return role;
  };

  const mapUrl = job.lat && job.lng
    ? `https://www.openstreetmap.org/?mlat=${job.lat}&mlon=${job.lng}#map=15/${job.lat}/${job.lng}`
    : null;

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/jobs" className="btn btn-ghost btn-sm">← กลับ</Link>
          <div>
            <div className="page-title">{job.job_title}</div>
            <div className="page-subtitle">รหัสงาน: {job.job_id}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatusBadge status={job.job_status} />
          <PriorityBadge priority={job.job_priority} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Description */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>รายละเอียด</h3>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.8 }}>
              {job.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>ไม่มีรายละเอียด</span>}
            </p>
          </div>

          {/* Customer Info */}
          {(job.customer_name || job.contact_number || job.address || job.landmark) && (
            <div className="card" style={{ padding: '22px 24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserIcon size={15} /> ข้อมูลลูกค้า
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {job.customer_name && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <UserIcon size={14} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>ชื่อ</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.customer_name}</span>
                  </div>
                )}
                {job.contact_number && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <Phone size={14} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>เบอร์ติดต่อ</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.contact_number}</span>
                  </div>
                )}
                {job.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                    <MapPin size={14} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: 'var(--text-muted)', minWidth: 80, flexShrink: 0 }}>ที่อยู่</span>
                    <span style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{job.address}</span>
                  </div>
                )}
                {job.landmark && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <AlertTriangle size={14} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>จุดสังเกต</span>
                    <span style={{ color: 'var(--accent-amber)', fontWeight: 500 }}>{job.landmark}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Map */}
          {job.lat && job.lng && (
            <div className="card" style={{ padding: '22px 24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} /> ตำแหน่งที่ตั้ง
              </h3>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: 10, background: 'var(--bg-secondary)' }}>
                {/* Static map image via OpenStreetMap tiles */}
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${job.lng - 0.01},${job.lat - 0.01},${job.lng + 0.01},${job.lat + 0.01}&layer=mapnik&marker=${job.lat},${job.lng}`}
                  style={{ width: '100%', height: 260, border: 'none', display: 'block' }}
                  title="ตำแหน่งงาน"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {job.lat.toFixed(6)}, {job.lng.toFixed(6)}
                </div>
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>
                    เปิดใน OpenStreetMap ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ความคืบหน้า</h3>
              <span style={{ fontSize: 20, fontWeight: 800, color: progress === 100 ? 'var(--accent-emerald)' : 'var(--accent-blue-light)' }}>{progress}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{
                width: `${progress}%`,
                background: progress === 100 ? 'linear-gradient(90deg,#10B981,#34D399)' : 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <span>เริ่ม: {job.start_date}</span>
              <span style={{ color: overdue ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                กำหนดเสร็จ: {job.due_date} {overdue ? `(เกิน ${-daysLeft} วัน)` : daysLeft >= 0 ? `(เหลือ ${daysLeft} วัน)` : ''}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</h3>
            {[
              { label: 'มอบหมายงาน',     date: job.start_date, done: true,  icon: '✓' },
              { label: 'เริ่มดำเนินการ',  date: job.start_date, done: job.job_status !== 'pending', icon: '→' },
              { label: 'กำลังดำเนินการ', date: '',              done: job.job_status === 'in-progress' || job.job_status === 'done', icon: '◎' },
              { label: 'เสร็จสิ้น',       date: job.due_date,   done: job.job_status === 'done', icon: '⭐' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 16 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: step.done ? 'linear-gradient(135deg,#3B82F6,#8B5CF6)' : 'var(--bg-hover)',
                    border: step.done ? 'none' : '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: step.done ? '#fff' : 'var(--text-muted)',
                  }}>{step.icon}</div>
                  {i < 3 && <div style={{ width: 1, flex: 1, minHeight: 16, background: step.done ? 'var(--accent-blue)' : 'var(--border-color)', margin: '4px 0' }} />}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: step.done ? 600 : 400, color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.label}</div>
                  {step.date && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{step.date}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Job Meta */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ข้อมูลงาน</h3>
            {[
              { label: 'สถานะ',       value: <StatusBadge status={job.job_status} /> },
              { label: 'ความสำคัญ',   value: <PriorityBadge priority={job.job_priority} /> },
              { label: 'วันเริ่มต้น', value: job.start_date },
              { label: 'กำหนดเสร็จ',  value: <span style={{ color: overdue ? 'var(--accent-rose)' : 'var(--text-primary)', fontWeight: overdue ? 700 : 400 }}>{job.due_date}{overdue ? ' ⚠' : ''}</span> },
              { label: 'แผนก',        value: dept?.dept_name ?? '—' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Lead Person */}
          {lead && (
            <div className="card" style={{ padding: '20px 22px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Crown size={14} color="var(--accent-amber)" /> หัวหน้างาน
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                <div className="avatar avatar-md" style={{ background: lead.avatar_color || '#8B5CF6', fontSize: 13, color: '#fff', flexShrink: 0 }}>
                  {lead.firstname[0]}{lead.lastname[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{lead.firstname} {lead.lastname}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {roleLabel(lead.role)}
                    {lead.dept_id && departments.find(d => d.dept_id === lead.dept_id) && (
                      <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        · <Building2 size={10} /> {departments.find(d => d.dept_id === lead.dept_id)?.dept_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Team */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ผู้รับผิดชอบ ({assignedUsers.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignedUsers.length === 0 && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>— ยังไม่มีผู้รับผิดชอบ —</div>
              )}
              {assignedUsers.map((u, i) => {
                const userDept = departments.find(d => d.dept_id === u.dept_id);
                return (
                  <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-md" style={{ background: u.avatar_color || avatarColors[i % avatarColors.length], fontSize: 12, color: '#fff', flexShrink: 0 }}>
                      {u.firstname[0]}{u.lastname[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{u.firstname} {u.lastname}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{roleLabel(u.role)} · {userDept?.dept_name ?? '—'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
