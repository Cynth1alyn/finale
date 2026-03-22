'use client';

import { useState } from 'react';
import Link from 'next/link';
import { jobs, users } from '@/app/lib/mock-data';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';
import DataTable from '@/app/components/DataTable';

export default function JobsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = jobs.filter(j => {
    if (statusFilter !== 'all' && j.job_status !== statusFilter) return false;
    if (priorityFilter !== 'all' && j.job_priority !== priorityFilter) return false;
    return true;
  });

  const getUserName = (ids: string[]) => ids.map(id => {
    const u = users.find(u => u.user_id === id);
    return u ? `${u.firstname}` : '—';
  }).join(', ');

  const tableData = filtered.map(j => ({
    ...j,
    _assignees: getUserName(j.assigned_user_ids),
    _due: j.due_date,
  }));

  const columns = [
    {
      key: 'job_title',
      label: 'หัวข้องาน',
      render: (row: typeof tableData[0]) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{row.job_title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.description}</div>
        </div>
      ),
    },
    { key: '_assignees', label: 'ผู้รับผิดชอบ', render: (row: typeof tableData[0]) => <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row._assignees}</span> },
    { key: 'job_priority', label: 'ความสำคัญ', render: (row: typeof tableData[0]) => <PriorityBadge priority={row.job_priority} /> },
    { key: 'job_status', label: 'สถานะ', render: (row: typeof tableData[0]) => <StatusBadge status={row.job_status} /> },
    { key: 'start_date', label: 'วันเริ่ม', render: (row: typeof tableData[0]) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.start_date}</span> },
    { key: '_due', label: 'กำหนดเสร็จ', render: (row: typeof tableData[0]) => {
      const overdue = new Date(row._due) < new Date() && row.job_status !== 'done' && row.job_status !== 'cancelled';
      return <span style={{ fontSize: 12, color: overdue ? 'var(--accent-rose)' : 'var(--text-muted)', fontWeight: overdue ? 600 : 400 }}>{row._due}{overdue ? ' ⚠' : ''}</span>;
    }},
  ];

  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter(j => j.job_status === 'pending').length,
    'in-progress': jobs.filter(j => j.job_status === 'in-progress').length,
    done: jobs.filter(j => j.job_status === 'done').length,
    cancelled: jobs.filter(j => j.job_status === 'cancelled').length,
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">จัดการงาน</div>
          <div className="page-subtitle">ทั้งหมด {jobs.length} รายการ</div>
        </div>
        <button className="btn btn-primary">+ มอบหมายงานใหม่</button>
      </div>

      {/* Status Tabs */}
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

      {/* Priority filter */}
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

      <div className="card" style={{ padding: 20 }}>
        <DataTable
          data={tableData as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          rowHref={(row) => `/jobs/${(row as typeof tableData[0]).job_id}`}
          searchKeys={['job_title', '_assignees']}
        />
      </div>
    </>
  );
}
