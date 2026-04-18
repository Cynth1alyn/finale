'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Job, Priority, JobStatus } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';
import DataTable from '@/app/components/DataTable';
import Modal from '@/app/components/Modal';
import MapComponent from '@/app/components/MapComponent';
import SearchableSelect from '@/app/components/SearchableSelect';
import { Search, X, AlertTriangle, User, UserPlus, Pencil, Package } from 'lucide-react';

export default function JobsPage() {
  const router = useRouter();
  const { jobs, users, equipment, updateJob, deleteJob } = useAppContext();
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="แก้ไขงาน">
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
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ความสำคัญ</label>
              <select className="input" value={formData.job_priority || 'medium'} onChange={e => setFormData({...formData, job_priority: e.target.value as Priority})} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="low">ต่ำ</option>
                <option value="medium">ปานกลาง</option>
                <option value="high">สูง</option>
                <option value="urgent">เร่งด่วน</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>สถานะ</label>
              <select className="input" value={formData.job_status || JobStatus.PENDING} onChange={e => setFormData({...formData, job_status: e.target.value as JobStatus})} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="pending">รอดำเนินการ</option>
                <option value="in-progress">กำลังทำ</option>
                <option value="done">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
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

          {/* Job Ownership */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '16px 20px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserPlus size={18} color="var(--accent-blue)" /> กำหนดผู้รับผิดชอบงาน
            </h3>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>หัวหน้างาน</label>
                <SearchableSelect 
                  options={users.filter(u => u.role === 'admin' || u.role === 'manager').map(u => ({ value: u.user_id, label: `${u.firstname} ${u.lastname}` }))}
                  placeholder="เลือกหัวหน้างาน..."
                  value={formData.assigned_lead_id || ''}
                  onSelect={val => setFormData({...formData, assigned_lead_id: val})}
                />
              </div>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                <table className="data-table" style={{ width: '100%', background: 'var(--bg-secondary)', fontSize: 13 }}>
                  <thead>
                    <tr><th style={{ width: 60 }}>ลำดับ</th><th>รหัสพนักงาน</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th></tr>
                  </thead>
                  <tbody>
                    {formData.assigned_lead_id ? (() => {
                      const lead = users.find(u => u.user_id === formData.assigned_lead_id);
                      return lead ? (
                        <tr>
                          <td>1</td>
                          <td>{lead.user_id}</td>
                          <td>{lead.firstname} {lead.lastname}</td>
                          <td style={{ textTransform: 'capitalize' }}>{lead.role === 'admin' ? 'ผู้ดูแลระบบ' : lead.role === 'manager' ? 'ผู้จัดการ' : lead.role}</td>
                        </tr>
                      ) : null;
                    })() : (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>— เลือกหัวหน้างาน —</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>พนักงานลูกทีม</label>
                <SearchableSelect 
                  options={users.filter(u => u.role !== 'admin' && u.role !== 'manager').map(u => ({ value: u.user_id, label: `${u.firstname} ${u.lastname}` }))}
                  placeholder="เพิ่มพนักงาน..."
                  value=""
                  resetOnSelect={true}
                  onSelect={val => {
                    if (val && !formData.assigned_user_ids?.includes(val)) {
                      setFormData({...formData, assigned_user_ids: [...(formData.assigned_user_ids || []), val]});
                    }
                  }}
                />
              </div>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                <table className="data-table" style={{ width: '100%', background: 'var(--bg-secondary)', fontSize: 13 }}>
                  <thead>
                    <tr><th style={{ width: 60 }}>ลำดับ</th><th>รหัสพนักงาน</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th style={{ width: 40, textAlign: 'center' }}>ลบ</th></tr>
                  </thead>
                  <tbody>
                    {(formData.assigned_user_ids || []).length > 0 ? (
                      (formData.assigned_user_ids || []).map((uid, index) => {
                        const u = users.find(x => x.user_id === uid);
                        return u ? (
                          <tr key={uid}>
                            <td>{index + 1}</td>
                            <td>{u.user_id}</td>
                            <td>{u.firstname} {u.lastname}</td>
                            <td style={{ textTransform: 'capitalize' }}>{u.role === 'technician' ? 'ช่างเทคนิค' : u.role === 'staff' ? 'พนักงานทั่วไป' : u.role}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button onClick={() => setFormData({...formData, assigned_user_ids: formData.assigned_user_ids!.filter(id => id !== uid)})} style={{ background: 'var(--accent-rose)', color: '#fff', border: 'none', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                                <X size={14} strokeWidth={3} />
                              </button>
                            </td>
                          </tr>
                        ) : null;
                      })
                    ) : (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>— ยังไม่ได้เลือกพนักงาน —</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Equipment Requests */}
          {formData.job_status === 'pending' && (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '16px 20px', background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={18} color="var(--accent-blue)" /> เบิกอุปกรณ์สำหรับงานนี้
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                 <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>เลือกอุปกรณ์ (ที่มีในคลัง)</label>
                 <SearchableSelect 
                   options={equipment.filter(e => e.remain_qty > 0).map(e => ({ value: e.equip_id, label: `${e.name} (คงเหลือ: ${e.remain_qty})` }))}
                   placeholder="ค้นหาอุปกรณ์..."
                   value=""
                   resetOnSelect={true}
                   onSelect={val => {
                     if (val) {
                       const existing = formData.equipment_requests?.find(r => r.equip_id === val);
                       if (!existing) {
                         setFormData({
                           ...formData, 
                           equipment_requests: [...(formData.equipment_requests || []), { equip_id: val, qty: 1 }]
                         });
                       }
                     }
                   }}
                 />
              </div>

              {formData.equipment_requests && formData.equipment_requests.length > 0 && (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                  <table className="data-table" style={{ width: '100%', background: 'var(--bg-secondary)', fontSize: 13 }}>
                    <thead>
                      <tr><th style={{ width: 60 }}>ลำดับ</th><th>ชื่ออุปกรณ์</th><th style={{ width: 100, textAlign: 'center' }}>จำนวนเบิก</th><th style={{ width: 60, textAlign: 'center' }}>ลบ</th></tr>
                    </thead>
                    <tbody>
                      {formData.equipment_requests.map((req, index) => {
                        const item = equipment.find(e => e.equip_id === req.equip_id);
                        return item ? (
                          <tr key={req.equip_id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="number" min="1" max={item.remain_qty} className="input" style={{ width: 60, padding: '4px 8px', textAlign: 'center' }} value={req.qty} onChange={e => {
                                const newQty = parseInt(e.target.value) || 1;
                                const maxQty = item.remain_qty;
                                const finalQty = newQty > maxQty ? maxQty : newQty;
                                setFormData({
                                  ...formData,
                                  equipment_requests: formData.equipment_requests!.map(r => r.equip_id === req.equip_id ? { ...r, qty: finalQty } : r)
                                });
                              }} />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button onClick={() => setFormData({...formData, equipment_requests: formData.equipment_requests!.filter(r => r.equip_id !== req.equip_id)})} style={{ background: 'var(--accent-rose)', color: '#fff', border: 'none', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                                <X size={14} strokeWidth={3} />
                              </button>
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={handleSave}>บันทึกข้อมูล</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
