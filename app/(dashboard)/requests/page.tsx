'use client';

import { useState } from 'react';
import Link from 'next/link';
import { requests, users } from '@/app/lib/mock-data';
import StatusBadge from '@/app/components/StatusBadge';
import DataTable from '@/app/components/DataTable';

export default function RequestsPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = requests.filter(r => statusFilter === 'all' || r.req_status === statusFilter);

  const getUserName = (id: string) => {
    const u = users.find(u => u.user_id === id);
    return u ? `${u.firstname} ${u.lastname}` : '—';
  };

  const tableData = filtered.map(r => ({ ...r, _requester: getUserName(r.user_id) }));

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.req_status === 'pending').length,
    approved: requests.filter(r => r.req_status === 'approved').length,
    fulfilled: requests.filter(r => r.req_status === 'fulfilled').length,
    rejected: requests.filter(r => r.req_status === 'rejected').length,
  };
  const statusTabs: Record<string, string> = { all: 'ทั้งหมด', pending: 'รอพิจารณา', approved: 'อนุมัติ', fulfilled: 'จัดส่งแล้ว', rejected: 'ปฏิเสธ' };

  const columns = [
    { key: 'req_id', label: 'รหัสคำขอ', render: (row: typeof tableData[0]) => <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent-blue-light)' }}>{row.req_id}</span> },
    { key: '_requester', label: 'ผู้ขอ', render: (row: typeof tableData[0]) => <span style={{ fontSize: 13 }}>{row._requester}</span> },
    { key: 'req_date', label: 'วันที่ขอ', render: (row: typeof tableData[0]) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.req_date}</span> },
    { key: 'req_status', label: 'สถานะ', render: (row: typeof tableData[0]) => <StatusBadge status={row.req_status} /> },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">คำขออุปกรณ์</div>
          <div className="page-subtitle">ทั้งหมด {requests.length} รายการ · รอพิจารณา {statusCounts.pending} รายการ</div>
        </div>
        <button className="btn btn-primary">+ สร้างคำขอใหม่</button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(statusCounts).map(([s, count]) => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setStatusFilter(s)}>
            {statusTabs[s]} ({count})
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <DataTable
          data={tableData as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          rowHref={(row) => `/requests/${(row as typeof tableData[0]).req_id}`}
          searchKeys={['req_id', '_requester']}
        />
      </div>
    </>
  );
}
