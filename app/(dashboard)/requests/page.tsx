'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/lib/AppContext';
import { Request, RequestStatus } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';
import DataTable from '@/app/components/DataTable';

export default function RequestsPage() {
  const router = useRouter();
  const { requests, users, deleteRequest } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบคำขอนี้ใช่หรือไม่?')) {
      deleteRequest(id);
    }
  };

  const filtered = requests.filter(r => statusFilter === 'all' || r.req_status === statusFilter);

  const getUserName = (id: string) => {
    const u = users.find(u => u.user_id === id);
    return u ? `${u.firstname} ${u.lastname}` : '—';
  };

  const tableData = filtered.map(r => ({ ...r, _requester: getUserName(r.user_id) }));

  const statusCounts = {
    all: requests.length,
    [RequestStatus.PENDING]: requests.filter(r => r.req_status === RequestStatus.PENDING).length,
    [RequestStatus.APPROVED]: requests.filter(r => r.req_status === RequestStatus.APPROVED).length,
    [RequestStatus.FULFILLED]: requests.filter(r => r.req_status === RequestStatus.FULFILLED).length,
    [RequestStatus.REJECTED]: requests.filter(r => r.req_status === RequestStatus.REJECTED).length,
  };
  const statusTabs: Record<string, string> = { 
    all: 'ทั้งหมด', 
    [RequestStatus.PENDING]: 'รอพิจารณา', 
    [RequestStatus.APPROVED]: 'อนุมัติ', 
    [RequestStatus.FULFILLED]: 'จัดส่งแล้ว', 
    [RequestStatus.REJECTED]: 'ปฏิเสธ' 
  };

  const columns = [
    { key: 'req_id', label: 'รหัสคำขอ', render: (row: typeof tableData[0]) => <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent-blue-light)' }}>{row.req_id}</span> },
    { key: '_requester', label: 'ผู้ขอ', render: (row: typeof tableData[0]) => <span style={{ fontSize: 13 }}>{row._requester}</span> },
    { key: 'req_date', label: 'วันที่ขอ', render: (row: typeof tableData[0]) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.req_date}</span> },
    { key: 'req_status', label: 'สถานะ', render: (row: typeof tableData[0]) => <StatusBadge status={row.req_status} /> },
    {
      key: 'actions',
      label: 'จัดการ',
      render: (row: typeof tableData[0]) => (
        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          <Link href={`/requests/${row.req_id}`} className="btn btn-ghost btn-sm">ดูรายละเอียด</Link>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-rose)' }} onClick={() => handleDelete(row.req_id)}>ลบ</button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">คำขออุปกรณ์</div>
          <div className="page-subtitle">ทั้งหมด {requests.length} รายการ · รอพิจารณา {statusCounts.pending} รายการ</div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/requests/new')}>+ สร้างคำขอใหม่</button>
      </div>

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
