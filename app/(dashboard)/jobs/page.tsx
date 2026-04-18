'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Job } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';
import DataTable from '@/app/components/DataTable';
import Modal from '@/app/components/Modal';
import MapComponent from '@/app/components/MapComponent';

import { Search, AlertTriangle, X, User, Pencil } from 'lucide-react';

export default function JobsPage() {
  const router = useRouter();
  const { jobs, users, updateJob, deleteJob } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Job>>({});

  const openAddModal = () => {
    router.push('/jobs/new');
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormData(job);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) {
      deleteJob(id);
    }
  };

  const handleSave = () => {
    if (!formData.job_title) return alert('กรุณาระบุหัวข้องาน');

    if (editingJob) {
      updateJob(formData as Job);
    }
    setIsModalOpen(false);
  };

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
      return <span style={{ fontSize: 12, color: overdue ? 'var(--accent-rose)' : 'var(--text-muted)', fontWeight: overdue ? 600 : 400, display: 'flex', alignItems: 'center', gap: 4 }}>{row._due}{overdue ? <AlertTriangle size={14} /> : ''}</span>;
    }},
    {
      key: 'actions',
      label: 'จัดการ',
      render: (row: typeof tableData[0]) => (
        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(row as Job)}>แก้ไข</button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-rose)' }} onClick={() => handleDelete(row.job_id)}>ลบ</button>
        </div>
      )
    }
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
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">จัดการงาน</div>
          <div className="page-subtitle">ทั้งหมด {jobs.length} รายการ</div>
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
          <button className="btn btn-primary" onClick={openAddModal}>+ มอบหมายงานใหม่</button>
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

      <div className="card" style={{ padding: 20 }}>
        <DataTable
          data={tableData as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          rowHref={(row) => `/jobs/${(row as typeof tableData[0]).job_id}`}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="แก้ไขงาน" maxWidth={820}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>หัวข้องาน</label>
            <input type="text" className="input" value={formData.job_title || ''} onChange={e => setFormData({...formData, job_title: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>รายละเอียด</label>
            <textarea className="input" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>พิกัดสถานที่จัดการงาน (คลิกบนแผนที่เพื่อปักหมุด)</label>
            <MapComponent 
              height="200px" 
              selectedPos={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : null}
              onPositionSelect={(lat, lng) => setFormData({...formData, lat, lng})}
            />
            {formData.lat && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>ละติจูด: {formData.lat.toFixed(6)}, ลองจิจูด: {formData.lng!.toFixed(6)}</div>}
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>วันเริ่ม</label>
              <input type="date" className="input" value={formData.start_date || ''} onChange={e => setFormData({...formData, start_date: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>กำหนดเสร็จ</label>
              <input type="date" className="input" value={formData.due_date || ''} onChange={e => setFormData({...formData, due_date: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
          </div>

          {/* Customer Information */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '16px 20px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="var(--accent-blue)" /> ข้อมูลลูกค้า
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>ชื่อลูกค้า</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="input" value={formData.customer_name || ''} onChange={e => setFormData({...formData, customer_name: e.target.value})} style={{ paddingRight: 32 }} placeholder="กรอกชื่อลูกค้า..." />
                  <Pencil size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>เบอร์ติดต่อ</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="input" value={formData.contact_number || ''} onChange={e => setFormData({...formData, contact_number: e.target.value})} style={{ paddingRight: 32 }} placeholder="08x-xxx-xxxx" />
                  <Pencil size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>ที่อยู่</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="input" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} style={{ paddingRight: 32 }} placeholder="กรอกที่อยู่..." />
                  <Pencil size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>
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
