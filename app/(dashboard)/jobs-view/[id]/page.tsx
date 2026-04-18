'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import SearchableSelect from '@/app/components/SearchableSelect';
import StatusBadge from '@/app/components/StatusBadge';
import PriorityBadge from '@/app/components/PriorityBadge';
import { ArrowLeft, UserPlus, Package, Save, MapPin, Calendar, Briefcase, AlertTriangle, Loader2, X } from 'lucide-react';

export default function JobsViewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { jobs, users, equipment, updateJob, updateEquipment } = useAppContext();

  const job = jobs.find(j => j.job_id === id);

  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(job?.assigned_user_ids || []);
  const [equipRequests, setEquipRequests] = useState<{ equip_id: string; qty: number }[]>(job?.equipment_requests || []);
  const [isSaving, setIsSaving] = useState(false);

  if (!job) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>ไม่พบงานนี้</div>
        <div style={{ fontSize: 13, marginBottom: 24 }}>อาจถูกลบหรือรหัสงานไม่ถูกต้อง</div>
        <button className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => router.push('/jobs-view')}>
          <ArrowLeft size={16} /> กลับไปหน้าติดตามงาน
        </button>
      </div>
    );
  }

  const lead = users.find(u => u.user_id === job.assigned_lead_id);

  // Users assigned to OTHER active jobs = busy
  const busyUserIds = new Set(
    jobs
      .filter(j => j.job_id !== id && (j.job_status === 'pending' || j.job_status === 'in-progress'))
      .flatMap(j => j.assigned_user_ids || [])
  );

  // Build team options — green = available, red = busy (disabled), grey = already assigned
  const teamOptions = [...users]
    .filter(u => u.role !== 'admin' && u.role !== 'manager' && !assignedUserIds.includes(u.user_id))
    .sort((a, b) => {
      const aBusy = busyUserIds.has(a.user_id) ? 1 : 0;
      const bBusy = busyUserIds.has(b.user_id) ? 1 : 0;
      return aBusy - bBusy;
    })
    .map(u => {
      const isBusy = busyUserIds.has(u.user_id);
      return {
        value: u.user_id,
        label: `${isBusy ? '🔴' : '🟢'} ${u.firstname} ${u.lastname}`,
        disabled: isBusy,
        disabledReason: 'พนักงานคนนี้กำลังรับงานอื่นอยู่',
      };
    });

  const availableEquipOptions = equipment
    .filter(e => !equipRequests.find(r => r.equip_id === e.equip_id))
    .map(e => ({
      value: e.equip_id,
      label: `${e.name} (เหลือ: ${e.remain_qty})`,
      disabled: e.remain_qty <= 0,
      disabledReason: e.remain_qty <= 0 ? 'อุปกรณ์หมดคลัง' : undefined
    }));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const originalIds = new Set((job.equipment_requests || []).map(r => r.equip_id));
      for (const req of equipRequests) {
        if (!originalIds.has(req.equip_id)) {
          const item = equipment.find(e => e.equip_id === req.equip_id);
          if (item) {
            await updateEquipment({ ...item, remain_qty: Math.max(0, item.remain_qty - req.qty) });
          }
        }
      }
      await updateJob({ ...job, assigned_user_ids: assignedUserIds, equipment_requests: equipRequests });
      router.push('/jobs-view');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const overdue = new Date(job.due_date) < new Date() && job.job_status !== 'done' && job.job_status !== 'cancelled';

  const roleLabel = (role: string) => {
    if (role === 'technician') return 'ช่างเทคนิค';
    if (role === 'user') return 'ผู้ใช้งาน';
    if (role === 'manager') return 'ผู้จัดการ';
    if (role === 'admin') return 'ผู้ดูแลระบบ';
    return role;
  };

  return (
    <>
      {/* Header */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push('/jobs-view')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            <ArrowLeft size={16} /> กลับ
          </button>
          <div style={{ minWidth: 0 }}>
            <div className="page-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {job.job_title}
            </div>
            <div className="page-subtitle">รหัสงาน: {job.job_id}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <StatusBadge status={job.job_status} />
          <PriorityBadge priority={job.job_priority} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 40 }}>

        {/* ── Job Info ── */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={16} color="var(--accent-blue)" /> รายละเอียดงาน
          </h3>

          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
            {job.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>ไม่มีรายละเอียด</span>}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: overdue ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
              <Calendar size={14} />
              วันเริ่ม: {job.start_date} &nbsp;|&nbsp; กำหนดเสร็จ: {job.due_date}
              {overdue && <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}> ⚠ เกินกำหนด!</span>}
            </div>
            {job.customer_name && (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                ลูกค้า: <strong>{job.customer_name}</strong>
                {job.contact_number && <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>({job.contact_number})</span>}
              </div>
            )}
            {job.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--text-secondary)', maxWidth: '100%' }}>
                <MapPin size={13} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ wordBreak: 'break-word' }}>{job.address}</span>
              </div>
            )}
            {job.landmark && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--accent-amber)' }}>
                <AlertTriangle size={13} /> จุดสังเกต: {job.landmark}
              </div>
            )}
          </div>

          {/* Embedded Map */}
          {job.lat && job.lng && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} color="var(--accent-rose)" /> ตำแหน่งที่ตั้ง
              </div>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: 8 }}>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${job.lng - 0.01},${job.lat - 0.01},${job.lng + 0.01},${job.lat + 0.01}&layer=mapnik&marker=${job.lat},${job.lng}`}
                  style={{ width: '100%', height: 240, border: 'none', display: 'block' }}
                  title="ตำแหน่งงาน"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {job.lat.toFixed(6)}, {job.lng.toFixed(6)}
                </span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${job.lat}&mlon=${job.lng}#map=15/${job.lat}/${job.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}
                >
                  เปิดใน OpenStreetMap ↗
                </a>
              </div>
            </div>
          )}

          {lead && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar avatar-sm" style={{ background: lead.avatar_color || '#3B82F6', color: '#fff', fontSize: 11, flexShrink: 0 }}>
                {lead.firstname[0]}{lead.lastname[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>หัวหน้างาน: {lead.firstname} {lead.lastname}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{roleLabel(lead.role)}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Team Members ── */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, margin: 0, marginBottom: 6 }}>
                <UserPlus size={16} color="var(--accent-blue)" /> พนักงานลูกทีม
              </h3>
              {/* Color legend */}
              <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🟢 ว่าง (เลือกได้)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🔴 ไม่ว่าง (กำลังรับงานอื่น)</span>
              </div>
            </div>
            <div style={{ width: 260, flexShrink: 0 }}>
              <SearchableSelect
                options={teamOptions}
                placeholder="เพิ่มพนักงาน..."
                value=""
                resetOnSelect={true}
                onSelect={val => {
                  if (val && !assignedUserIds.includes(val)) {
                    setAssignedUserIds(prev => [...prev, val]);
                  }
                }}
              />
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
            <table className="data-table" style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ width: 48 }}>ลำดับ</th>
                  <th style={{ width: 80 }}>รหัส</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ตำแหน่ง</th>
                  <th style={{ width: 52, textAlign: 'center' }}>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {assignedUserIds.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>— ยังไม่มีพนักงาน —</td></tr>
                )}
                {assignedUserIds.map((uid, i) => {
                  const u = users.find(x => x.user_id === uid);
                  const isBusy = busyUserIds.has(uid);
                  return u ? (
                    <tr key={uid}>
                      <td>{i + 1}</td>
                      <td>{u.user_id}</td>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{isBusy ? '🔴' : '🟢'}</span>
                        {u.firstname} {u.lastname}
                      </td>
                      <td>{roleLabel(u.role)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => setAssignedUserIds(prev => prev.filter(x => x !== uid))}
                          style={{ background: 'var(--accent-rose)', color: '#fff', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Equipment Requests ── */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <Package size={16} color="var(--accent-blue)" /> เบิกอุปกรณ์
            </h3>
            <div style={{ width: 300, flexShrink: 0 }}>
              <SearchableSelect
                options={availableEquipOptions}
                placeholder="เลือกอุปกรณ์..."
                value=""
                resetOnSelect={true}
                onSelect={val => {
                  if (val && !equipRequests.find(r => r.equip_id === val)) {
                    setEquipRequests(prev => [...prev, { equip_id: val, qty: 1 }]);
                  }
                }}
              />
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
            <table className="data-table" style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ width: 48 }}>ลำดับ</th>
                  <th>ชื่ออุปกรณ์</th>
                  <th style={{ width: 120, textAlign: 'center' }}>จำนวนเบิก</th>
                  <th style={{ width: 52, textAlign: 'center' }}>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {equipRequests.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>— ยังไม่มีรายการเบิก —</td></tr>
                )}
                {equipRequests.map((req, i) => {
                  const item = equipment.find(e => e.equip_id === req.equip_id);
                  return item ? (
                    <tr key={req.equip_id}>
                      <td>{i + 1}</td>
                      <td>
                        {item.name}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>(คงเหลือ {item.remain_qty})</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="number" min={1} max={item.remain_qty}
                          className="input"
                          style={{ width: 72, padding: '4px 8px', textAlign: 'center' }}
                          value={req.qty}
                          onChange={e => {
                            const qty = Math.min(parseInt(e.target.value) || 1, item.remain_qty);
                            setEquipRequests(prev => prev.map(r => r.equip_id === req.equip_id ? { ...r, qty } : r));
                          }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => setEquipRequests(prev => prev.filter(r => r.equip_id !== req.equip_id))}
                          style={{ background: 'var(--accent-rose)', color: '#fff', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Save ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => router.push('/jobs-view')} disabled={isSaving}>
            ยกเลิก
          </button>
          <button
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px' }}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> กำลังบันทึก...</>
              : <><Save size={16} /> บันทึกการเปลี่ยนแปลง</>
            }
          </button>
        </div>

      </div>
    </>
  );
}
