'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/lib/AppContext';
import { Request, RequestStatus } from '@/app/lib/mock-data';
import StatusBadge from '@/app/components/StatusBadge';
import DataTable from '@/app/components/DataTable';
import Modal from '@/app/components/Modal';

export default function RequestsPage() {
  const { requests, users, addRequest, updateRequest, deleteRequest } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Request>>({});

  const openAddModal = () => {
    setEditingRequest(null);
    setFormData({
      req_id: `R${String(requests.length + 1).padStart(3, '0')}`,
      req_date: new Date().toISOString().split('T')[0],
      req_status: 'pending',
      user_id: users[0]?.user_id || 'U001',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (req: Request) => {
    setEditingRequest(req);
    setFormData(req);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบคำขอนี้ใช่หรือไม่?')) {
      deleteRequest(id);
    }
  };

  const handleSave = () => {
    if (editingRequest) {
      updateRequest(formData as Request);
    } else {
      addRequest(formData as Request);
    }
    setIsModalOpen(false);
  };

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
    {
      key: 'actions',
      label: 'จัดการ',
      render: (row: typeof tableData[0]) => (
        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(row as Request)}>แก้ไข</button>
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
        <button className="btn btn-primary" onClick={openAddModal}>+ สร้างคำขอใหม่</button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRequest ? 'แก้ไขคำขอ' : 'สร้างคำขอใหม่'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>รหัสคำขอ</label>
            <input type="text" className="input" value={formData.req_id || ''} disabled style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-hover)' }} />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>วันที่ขอ</label>
              <input type="date" className="input" value={formData.req_date || ''} onChange={e => setFormData({...formData, req_date: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>สถานะ</label>
              <select className="input" value={formData.req_status || 'pending'} onChange={e => setFormData({...formData, req_status: e.target.value as RequestStatus})} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="pending">รอพิจารณา</option>
                <option value="approved">อนุมัติ</option>
                <option value="fulfilled">จัดส่งแล้ว</option>
                <option value="rejected">ปฏิเสธ</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ผู้ขอ</label>
            <select className="input" value={formData.user_id || ''} onChange={e => setFormData({...formData, user_id: e.target.value})} style={{ width: '100%', padding: '8px 12px' }}>
              {users.map(u => <option key={u.user_id} value={u.user_id}>{u.firstname} {u.lastname}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={handleSave}>บันทึกข้อมูล</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
