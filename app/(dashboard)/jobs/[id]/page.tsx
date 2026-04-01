import Link from 'next/link';
import { api } from '@/app/lib/api';
import { JobStatus, User } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let job;
  try {
    job = await api.jobs.getJob(id);
  } catch {
    job = null;
  }

  if (!job) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        ไม่พบงาน #{id}
        <br /><Link href="/jobs" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>← กลับ</Link>
      </div>
    );
  }

  const assignedUsers: User[] = [];
  for (const userId of job.assigned_user_ids ?? []) {
    try {
      const user = await api.users.getUser(userId);
      assignedUsers.push(user);
    } catch {
      // skip missing user
    }
  }

  const departments = await api.departments.getDepartments();
  const dept = assignedUsers[0] ? departments.find(d => d.dept_id === assignedUsers[0].dept_id) : null;

  const daysLeft = Math.ceil((new Date(job.due_date).getTime() - new Date().getTime()) / 86400000);
  const overdue = daysLeft < 0 && job.job_status !== JobStatus.DONE && job.job_status !== JobStatus.CANCELLED;
  const progressMap: Record<string, number> = { [JobStatus.PENDING]: 0, [JobStatus.IN_PROGRESS]: 50, [JobStatus.DONE]: 100, [JobStatus.CANCELLED]: 0 };
  const progress = progressMap[job.job_status] || 0;

  const avatarColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#EC4899'];

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>รายละเอียด</h3>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.8 }}>{job.description}</p>
          </div>

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: '20px 22px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ข้อมูลงาน</h3>
            {[
              { label: 'สถานะ',       value: <StatusBadge status={job.job_status} /> },
              { label: 'ความสำคัญ',   value: <PriorityBadge priority={job.job_priority} /> },
              { label: 'วันเริ่มต้น', value: job.start_date },
              { label: 'กำหนดเสร็จ',  value: job.due_date },
              { label: 'แผนก',        value: dept?.dept_name ?? '—' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '20px 22px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ผู้รับผิดชอบ ({assignedUsers.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignedUsers.map((u, i) => {
                const userDept = departments.find(d => d.dept_id === u.dept_id);
                return (
                  <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-md" style={{ background: avatarColors[i % avatarColors.length], fontSize: 12 }}>
                      {u.firstname[0]}{u.lastname[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{u.firstname} {u.lastname}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.role} · {userDept?.dept_name ?? '—'}</div>
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

