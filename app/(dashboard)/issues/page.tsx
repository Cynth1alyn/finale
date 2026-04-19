'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import { Issue, IssueStatus } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';
import DataTable from '@/app/components/DataTable';
import Modal from '@/app/components/Modal';
import MapComponent from '@/app/components/MapComponent';
import { Check } from 'lucide-react';

export default function IssuesPage() {
  const { issues, users, updateIssue, deleteIssue } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Issue>>({});

  const openEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setFormData(issue);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบรายงานปัญหานี้ใช่หรือไม่?')) {
      deleteIssue(id);
    }
  };

  const handleSave = () => {
    if (!formData.topic) return alert('กรุณาระบุหัวข้อปัญหา');
    if (editingIssue) {
      updateIssue(formData as Issue);
    }
    setIsModalOpen(false);
  };

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
      label: 'การแก้ไข',
      render: (row: typeof tableData[0]) => (
        <span style={{ fontSize: 11, color: row.solution ? 'var(--accent-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {row.solution ? <><Check size={14} /> มีวิธีแก้ไข</> : '— ยังไม่แก้ไข'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'จัดการ',
      render: (row: typeof tableData[0]) => (
        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(row as Issue)}>แก้ไข</button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-rose)' }} onClick={() => handleDelete(row.issue_id)}>ลบ</button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">รายงานปัญหา</div>
          <div className="page-subtitle">ทั้งหมด {issues.length} รายการ · เปิดอยู่ {statusCounts.open + statusCounts['in-progress']} รายการ</div>
        </div>
      </div>

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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="แก้ไขปัญหา">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>หัวข้อปัญหา</label>
            <input type="text" className="input" value={formData.topic || ''} onChange={e => setFormData({ ...formData, topic: e.target.value })} style={{ width: '100%', padding: '8px 12px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>รายละเอียด</label>
            <textarea className="input" rows={3} value={formData.detail || ''} onChange={e => setFormData({ ...formData, detail: e.target.value })} style={{ width: '100%', padding: '8px 12px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>พิกัดจุดเกิดเหตุ (คลิกบนแผนที่เพื่อปักหมุด)</label>
            <MapComponent
              height="200px"
              selectedPos={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : null}
              onPositionSelect={(lat, lng) => setFormData({ ...formData, lat, lng })}
            />
            {formData.lat && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>ละติจูด: {formData.lat.toFixed(6)}, ลองจิจูด: {formData.lng!.toFixed(6)}</div>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>วิธีแก้ไข (ถ้ามี)</label>
            <textarea className="input" rows={2} value={formData.solution || ''} onChange={e => setFormData({ ...formData, solution: e.target.value })} style={{ width: '100%', padding: '8px 12px' }} />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>วันที่แจ้ง</label>
              <input type="date" className="input" value={formData.report_date || ''} onChange={e => setFormData({ ...formData, report_date: e.target.value })} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>สถานะ</label>
              <select className="input" value={formData.status || 'open'} onChange={e => setFormData({ ...formData, status: e.target.value as IssueStatus })} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="open">เปิด</option>
                <option value="in-progress">กำลังแก้ไข</option>
                <option value="resolved">แก้ไขแล้ว</option>
                <option value="closed">ปิด</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ผู้แจ้ง</label>
            <select className="input" value={formData.reporter_id || ''} onChange={e => setFormData({ ...formData, reporter_id: e.target.value })} style={{ width: '100%', padding: '8px 12px' }}>
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
