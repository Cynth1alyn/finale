'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Job, Priority, JobStatus } from '@/app/lib/types';
import MapComponent from '@/app/components/MapComponent';
import SearchableSelect from '@/app/components/SearchableSelect';
import { User, UserPlus, Pencil, Package, X } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const { jobs, users, equipment, addJob, updateEquipment } = useAppContext();

  // Generate new job ID from current list
  const newJobId = useMemo(() => {
    const maxNum = jobs.length > 0
      ? Math.max(...jobs.map(x => parseInt(x.job_id.replace(/\D/g, ''), 10) || 0))
      : 0;
    return `J${String(maxNum + 1).padStart(3, '0')}`;
  }, [jobs]);

  const [formData, setFormData] = useState<Partial<Job>>({
    job_id: newJobId,
    job_title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
    job_priority: Priority.MEDIUM,
    job_status: JobStatus.PENDING,
    assigned_user_ids: [],
    assigned_lead_id: '',
    customer_name: '',
    contact_number: '',
    address: '',
    lat: 13.736717,
    lng: 100.523186,
    equipment_requests: []
  });

  const [assigneePage, setAssigneePage] = useState(1);
  const [equipPage, setEquipPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const assignedUsers = formData.assigned_user_ids || [];
  const totalAssigneePages = Math.max(1, Math.ceil(assignedUsers.length / ITEMS_PER_PAGE));
  const activeAssigneePage = Math.min(assigneePage, totalAssigneePages);
  const currentAssignees = assignedUsers.slice((activeAssigneePage - 1) * ITEMS_PER_PAGE, activeAssigneePage * ITEMS_PER_PAGE);

  const equipRequests = formData.equipment_requests || [];
  const totalEquipPages = Math.max(1, Math.ceil(equipRequests.length / ITEMS_PER_PAGE));
  const activeEquipPage = Math.min(equipPage, totalEquipPages);
  const currentEquip = equipRequests.slice((activeEquipPage - 1) * ITEMS_PER_PAGE, activeEquipPage * ITEMS_PER_PAGE);

  const handlePositionSelect = async (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th`);
      const data = await res.json();
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }));
      }
    } catch (e) {
      console.error('Reverse geocoding failed', e);
    }
  };

  const handleSave = async () => {
    if (!formData.job_title) return alert('กรุณาระบุหัวข้องาน');
    try {
      if (formData.job_status === JobStatus.PENDING && formData.equipment_requests) {
        for (const req of formData.equipment_requests) {
          const item = equipment.find(e => e.equip_id === req.equip_id);
          if (item) {
            await updateEquipment({ ...item, remain_qty: Math.max(0, item.remain_qty - req.qty) });
          }
        }
      }
      await addJob(formData as Job);
      router.push('/jobs');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + String(error));
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">มอบหมายงานใหม่</div>
          <div className="page-subtitle">กรอกข้อมูลและมอบหมายงานให้ทีมช่าง</div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>หัวข้องาน <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <input type="text" className="input" placeholder="ตัวอย่าง: ติดตั้งอินเทอร์เน็ต, ซ่อมบำรุงเซิร์ฟเวอร์" value={formData.job_title || ''} onChange={e => setFormData({...formData, job_title: e.target.value})} style={{ width: '100%', padding: '10px 14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>รายละเอียด</label>
            <textarea className="input" rows={4} placeholder="รายละเอียดงานหรือขอบเขตงาน..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px 14px' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>พิกัดสถานที่จัดการงาน (คลิกบนแผนที่เพื่อปักหมุด)</label>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <MapComponent 
                height="320px" 
                selectedPos={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : null}
                onPositionSelect={handlePositionSelect}
              />
            </div>
            {formData.lat && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
              ละติจูด: {formData.lat.toFixed(6)}, ลองจิจูด: {formData.lng!.toFixed(6)}
            </div>}
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>วันเริ่ม</label>
              <input type="date" className="input" value={formData.start_date || ''} onChange={e => setFormData({...formData, start_date: e.target.value})} style={{ width: '100%', padding: '10px 14px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>กำหนดเสร็จ</label>
              <input type="date" className="input" value={formData.due_date || ''} onChange={e => setFormData({...formData, due_date: e.target.value})} style={{ width: '100%', padding: '10px 14px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>ความสำคัญ</label>
              <select className="input" value={formData.job_priority || Priority.MEDIUM} onChange={e => setFormData({...formData, job_priority: e.target.value as Priority})} style={{ width: '100%', padding: '10px 14px' }}>
                <option value="low">ต่ำ</option>
                <option value="medium">ปานกลาง</option>
                <option value="high">สูง</option>
                <option value="urgent">เร่งด่วน</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>สถานะ</label>
              <select className="input" value={formData.job_status || 'pending'} onChange={e => setFormData({...formData, job_status: e.target.value as JobStatus})} style={{ width: '100%', padding: '10px 14px' }}>
                <option value="pending">รอดำเนินการ</option>
                <option value="in-progress">กำลังทำ</option>
                <option value="done">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
          
          {/* Customer Information */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '20px 24px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="var(--accent-blue)" /> ข้อมูลลูกค้า
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>ชื่อลูกค้า</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="input" value={formData.customer_name || ''} onChange={e => setFormData({...formData, customer_name: e.target.value})} style={{ padding: '10px 14px', paddingRight: 32, width: '100%' }} placeholder="กรอกชื่อลูกค้า..." />
                  <Pencil size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>เบอร์ติดต่อ</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="input" value={formData.contact_number || ''} onChange={e => setFormData({...formData, contact_number: e.target.value})} style={{ padding: '10px 14px', paddingRight: 32, width: '100%' }} placeholder="08x-xxx-xxxx" />
                  <Pencil size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>ที่อยู่</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="input" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} style={{ padding: '10px 14px', paddingRight: 32, width: '100%' }} placeholder="กรอกที่อยู่..." />
                  <Pencil size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>จุดสังเกตเพิ่มเติม (Landmark)</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="input" value={formData.landmark || ''} onChange={e => setFormData({...formData, landmark: e.target.value})} style={{ padding: '10px 14px', paddingRight: 32, width: '100%' }} placeholder="เช่น ตรงข้ามเซเว่น, ใกล้ตึก..." />
                  <Pencil size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Job Ownership */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '20px 24px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserPlus size={18} color="var(--accent-blue)" /> กำหนดผู้รับผิดชอบงาน
            </h3>
            
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>หัวหน้างาน</label>
                <div style={{ width: 280 }}>
                  <SearchableSelect 
                    options={users.filter(u => u.role === 'admin' || u.role === 'manager').map(u => ({ value: u.user_id, label: `${u.firstname} ${u.lastname}` }))}
                    placeholder="เลือกหัวหน้างาน..."
                    value={formData.assigned_lead_id || ''}
                    onSelect={val => setFormData({...formData, assigned_lead_id: val})}
                  />
                </div>
              </div>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                <table className="data-table" style={{ width: '100%', background: 'var(--bg-card)', fontSize: 13 }}>
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
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>— เลือกหัวหน้างาน —</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>พนักงานลูกทีม</label>
                <div style={{ width: 280 }}>
                  <SearchableSelect 
                    options={users.filter(u => u.role !== 'admin' && u.role !== 'manager').map(u => ({ value: u.user_id, label: `${u.firstname} ${u.lastname}` }))}
                    placeholder="เพิ่มพนักงาน..."
                    value=""
                    resetOnSelect={true}
                    onSelect={val => {
                      if (val && !formData.assigned_user_ids?.includes(val)) {
                        const newAssignees = [...(formData.assigned_user_ids || []), val];
                        setFormData({...formData, assigned_user_ids: newAssignees});
                        setAssigneePage(Math.ceil(newAssignees.length / ITEMS_PER_PAGE));
                      }
                    }}
                  />
                </div>
              </div>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                <table className="data-table" style={{ width: '100%', background: 'var(--bg-card)', fontSize: 13 }}>
                  <thead>
                    <tr><th style={{ width: 60 }}>ลำดับ</th><th>รหัสพนักงาน</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th><th style={{ width: 60, textAlign: 'center' }}>ลบ</th></tr>
                  </thead>
                  <tbody>
                    {currentAssignees.length > 0 ? (
                      currentAssignees.map((uid, index) => {
                        const globalIndex = (activeAssigneePage - 1) * ITEMS_PER_PAGE + index + 1;
                        const u = users.find(x => x.user_id === uid);
                        return u ? (
                          <tr key={uid}>
                            <td>{globalIndex}</td>
                            <td>{u.user_id}</td>
                            <td>{u.firstname} {u.lastname}</td>
                            <td style={{ textTransform: 'capitalize' }}>{u.role === 'technician' ? 'ช่างเทคนิค' : u.role === 'staff' ? 'พนักงานทั่วไป' : u.role}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button onClick={() => setFormData({...formData, assigned_user_ids: formData.assigned_user_ids!.filter(id => id !== uid)})} style={{ background: 'var(--accent-rose)', color: '#fff', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                                <X size={16} strokeWidth={3} />
                              </button>
                            </td>
                          </tr>
                        ) : null;
                      })
                    ) : (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>— ยังไม่ได้เลือกพนักงาน —</td></tr>
                    )}
                  </tbody>
                </table>
                {totalAssigneePages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', fontSize: 13 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }} onClick={() => setAssigneePage(p => Math.max(1, p - 1))} disabled={activeAssigneePage === 1}>ก่อนหน้า</button>
                    <span style={{ alignSelf: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>หน้า {activeAssigneePage} จาก {totalAssigneePages}</span>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }} onClick={() => setAssigneePage(p => Math.min(totalAssigneePages, p + 1))} disabled={activeAssigneePage === totalAssigneePages}>ถัดไป</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Equipment Requests */}
          {formData.job_status === 'pending' && (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '20px 24px', background: 'var(--bg-secondary)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={18} color="var(--accent-blue)" /> เบิกอุปกรณ์สำหรับงานนี้
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                 <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>เลือกอุปกรณ์ (ที่มีในคลัง)</label>
                 <div style={{ width: 320 }}>
                   <SearchableSelect 
                     options={equipment.filter(e => e.remain_qty > 0).map(e => ({ value: e.equip_id, label: `${e.name} (คงเหลือ: ${e.remain_qty})` }))}
                     placeholder="ค้นหาอุปกรณ์..."
                     value=""
                     resetOnSelect={true}
                     onSelect={val => {
                       if (val) {
                         const existing = formData.equipment_requests?.find(r => r.equip_id === val);
                         if (!existing) {
                           const newEquips = [...(formData.equipment_requests || []), { equip_id: val, qty: 1 }];
                           setFormData({
                             ...formData, 
                             equipment_requests: newEquips
                           });
                           setEquipPage(Math.ceil(newEquips.length / ITEMS_PER_PAGE));
                         }
                       }
                     }}
                   />
                 </div>
              </div>

              {formData.equipment_requests && formData.equipment_requests.length > 0 && (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                  <table className="data-table" style={{ width: '100%', background: 'var(--bg-card)', fontSize: 13 }}>
                    <thead>
                      <tr><th style={{ width: 60 }}>ลำดับ</th><th>ชื่ออุปกรณ์</th><th style={{ width: 120, textAlign: 'center' }}>จำนวนเบิก</th><th style={{ width: 60, textAlign: 'center' }}>ลบ</th></tr>
                    </thead>
                    <tbody>
                      {currentEquip.map((req, index) => {
                        const globalIndex = (activeEquipPage - 1) * ITEMS_PER_PAGE + index + 1;
                        const item = equipment.find(e => e.equip_id === req.equip_id);
                        return item ? (
                          <tr key={req.equip_id}>
                            <td>{globalIndex}</td>
                            <td>{item.name} <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 8 }}>(เหลือ {item.remain_qty} ชิ้น)</span></td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="number" min="1" max={item.remain_qty} className="input" style={{ width: 80, padding: '6px 10px', textAlign: 'center' }} value={req.qty} onChange={e => {
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
                              <button onClick={() => setFormData({...formData, equipment_requests: formData.equipment_requests!.filter(r => r.equip_id !== req.equip_id)})} style={{ background: 'var(--accent-rose)', color: '#fff', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                                <X size={16} strokeWidth={3} />
                              </button>
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                  {totalEquipPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', fontSize: 13 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }} onClick={() => setEquipPage(p => Math.max(1, p - 1))} disabled={activeEquipPage === 1}>ก่อนหน้า</button>
                      <span style={{ alignSelf: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>หน้า {activeEquipPage} จาก {totalEquipPages}</span>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }} onClick={() => setEquipPage(p => Math.min(totalEquipPages, p + 1))} disabled={activeEquipPage === totalEquipPages}>ถัดไป</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 16, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-ghost" style={{ padding: '12px 24px', fontSize: 15 }} onClick={() => router.push('/jobs')}>ยกเลิก</button>
            <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 15 }} onClick={handleSave}>มอบหมายงาน</button>
          </div>
      </div>
    </>
  );
}
