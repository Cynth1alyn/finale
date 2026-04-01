'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';
import { Search, X, AlertTriangle, MapPin, Calendar, Briefcase } from 'lucide-react';

export default function JobsViewPage() {
  const { jobs, users } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getUserName = (ids: string[] | null | undefined) => (ids || []).map(id => {
    const u = users.find(u => u.user_id === id);
    return u ? `${u.firstname}` : '—';
  }).join(', ');

  const filtered = jobs.filter(j => {
    if (statusFilter !== 'all' && j.job_status !== statusFilter) return false;
    if (priorityFilter !== 'all' && j.job_priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = j.job_title.toLowerCase().includes(q);
      const descMatch = (j.description || '').toLowerCase().includes(q);
      const assignMatch = getUserName(j.assigned_user_ids).toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !assignMatch) return false;
    }
    return true;
  });

  // Columns & mapped table data removed in favor of Card Grid

  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter(j => j.job_status === 'pending').length,
    'in-progress': jobs.filter(j => j.job_status === 'in-progress').length,
    done: jobs.filter(j => j.job_status === 'done').length,
    cancelled: jobs.filter(j => j.job_status === 'cancelled').length,
  };

  return (
    <>
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">ติดตามงาน</div>
          <div className="page-subtitle">แสดงรายการงาน แต่อ่านได้อย่างเดียว (สำหรับผู้ใช้ดูข้อมูล)</div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div className="search-box" style={{ width: '300px', maxWidth: '100%' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex' }}><Search size={16} /></span>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, รายละเอียด, พนักงาน..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={16} /></button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {Object.entries(statusCounts).map(([s, count]) => {
          const labels: Record<string, string> = { all: 'ทั้งหมด', pending: 'รอดำเนินการ', 'in-progress': 'กำลังทำ', done: 'เสร็จสิ้น', cancelled: 'ยกเลิก' };
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`btn ${active ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            >{labels[s]} ({count})</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ความสำคัญ:</span>
        {['all', 'urgent', 'high', 'medium', 'low'].map(p => {
          const labels: Record<string, string> = { all: 'ทั้งหมด', urgent: 'เร่งด่วน', high: 'สูง', medium: 'ปานกลาง', low: 'ต่ำ' };
          return (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={`btn btn-sm ${priorityFilter === p ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ borderColor: priorityFilter === p ? 'var(--accent-blue)' : undefined }}
            >{labels[p]}</button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map(job => {
          const overdue = new Date(job.due_date) < new Date() && job.job_status !== 'done' && job.job_status !== 'cancelled';
          const assignees = (job.assigned_user_ids || []).map(id => users.find(u => u.user_id === id)).filter(Boolean);
          
          return (
            <div key={job.job_id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, cursor: 'default', borderTop: `4px solid ${job.job_status === 'done' ? 'var(--accent-emerald)' : job.job_status === 'in-progress' ? 'var(--accent-blue)' : job.job_status === 'cancelled' ? 'var(--text-muted)' : 'var(--accent-amber)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{job.job_title}</h3>
                <div style={{ flexShrink: 0 }}><PriorityBadge priority={job.job_priority} /></div>
              </div>
              
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                {job.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
              </div>

              {(job.customer_name || job.address || job.landmark) && (
                <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {job.customer_name && (
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                       <Briefcase size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} /> 
                       {job.customer_name} 
                       {job.contact_number && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({job.contact_number})</span>}
                    </div>
                  )}
                  {job.address && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <MapPin size={14} style={{ flexShrink: 0, marginTop: 2, color: 'var(--accent-rose)' }} />
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.address}</span>
                    </div>
                  )}
                  {job.landmark && (
                    <div style={{ fontSize: 12, color: 'var(--accent-amber)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>จุดสังเกต: {job.landmark}</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <StatusBadge status={job.job_status} />
                  <div style={{ fontSize: 11, color: overdue ? 'var(--accent-rose)' : 'var(--text-muted)', fontWeight: overdue ? 600 : 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> {job.due_date} {overdue && '(เกินกำหนด)'}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                  {assignees.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ยังไม่มอบหมาย</span>}
                  {assignees.slice(0, 3).map((u, i) => u ? (
                    <div key={u.user_id} className="avatar avatar-sm" style={{ background: u.avatar_color, color: '#fff', fontSize: 11, fontWeight: 600, marginLeft: -8, border: '2px solid var(--bg-card)' }} title={`${u.firstname} ${u.lastname}`}>
                      {u.firstname[0]}{u.lastname[0]}
                    </div>
                  ) : null)}
                  {assignees.length > 3 && (
                    <div className="avatar avatar-sm" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 600, marginLeft: -8, border: '2px solid var(--bg-card)' }} title={`และพนักงานอีก ${assignees.length - 3} คน`}>
                      +{assignees.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 12, border: '1px dashed var(--border-color)' }}>
            ไม่พบงานที่ค้นหา
          </div>
        )}
      </div>
    </>
  );
}
