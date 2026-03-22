'use client';

import { useState } from 'react';
import Link from 'next/link';
import { issues, users } from '@/app/lib/mock-data';
import StatusBadge from '@/app/components/StatusBadge';
import DataTable from '@/app/components/DataTable';

export default function IssuesPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = issues.filter(i => statusFilter === 'all' || i.status === statusFilter);

  const getUserName = (id: string) => {
    const u = users.find(u => u.user_id === id);
    return u ? `${u.firstname} ${u.lastname}` : '—';
  };

  const tableData = filtered.map(i => ({
    ...i,
    _reporter: getUserName(i.reporter_id),
  }));

  const statusCounts = {
    all: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    'in-progress': issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    closed: issues.filter(i => i.status === 'closed').length,
  };

  const columns = [
    {
      key: 'topic',
      label: 'หัวข้อปัญหา',
      render: (row: typeof tableData[0]) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{row.topic}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.detail}</div>
        </div>
      ),
    },
    { key: '_reporter', label: 'ผู้แจ้ง', render: (row: typeof tableData[0]) => <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row._reporter}</span> },
    { key: 'status', label: 'สถานะ', render: (row: typeof tableData[0]) => <StatusBadge status={row.status} /> },
    { key: 'report_date', label: 'วันที่แจ้ง', render: (row: typeof tableData[0]) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.report_date}</span> },
    {
      key: 'solution',
      label: 'แก้ไข',
      render: (row: typeof tableData[0]) => (
        <span style={{ fontSize: 11, color: row.solution ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
          {row.solution ? '✓ มีวิธีแก้ไข' : '— ยังไม่แก้ไข'}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">รายงานปัญหา</div>
          <div className="page-subtitle">ทั้งหมด {issues.length} รายการ · เปิดอยู่ {statusCounts.open + statusCounts['in-progress']} รายการ</div>
        </div>
        <button className="btn btn-primary">+ แจ้งปัญหาใหม่</button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(statusCounts).map(([s, count]) => {
          const labels: Record<string, string> = { all: 'ทั้งหมด', open: 'เปิด', 'in-progress': 'กำลังแก้ไข', resolved: 'แก้ไขแล้ว', closed: 'ปิด' };
          return (
            <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter(s)}>
              {labels[s]} ({count})
            </button>
          );
        })}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <DataTable
          data={tableData as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          rowHref={(row) => `/issues/${(row as typeof tableData[0]).issue_id}`}
          searchKeys={['topic', '_reporter']}
        />
      </div>
    </>
  );
}
