'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Issue, IssueStatus } from '@/app/lib/types';
import { useAppContext } from '@/app/lib/AppContext';
import MapComponent from '@/app/components/MapComponent';

export default function NewIssuePage() {
  const router = useRouter();
  const { issues, users, addIssue } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<Issue>>({
    topic: '',
    detail: '',
    solution: '',
    status: IssueStatus.OPEN,
    report_date: new Date().toISOString().split('T')[0],
    reporter_id: '',
    lat: 13.736717,
    lng: 100.523186,
  });

  useEffect(() => {
    const newId = `I${String((issues.length > 0 ? Math.max(...issues.map(x => parseInt(x.issue_id.replace(/\D/g, ''), 10) || 0)) : 0) + 1).padStart(3, '0')}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(prev => ({ ...prev, issue_id: newId }));
  }, [issues]);

  useEffect(() => {
    if (users.length > 0 && !formData.reporter_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, reporter_id: users[0].user_id }));
    }
  }, [users, formData.reporter_id]);

  const handleSave = async () => {
    if (!formData.topic) return alert('กรุณาระบุหัวข้อปัญหา');
    await addIssue(formData as Issue);
    router.push('/issues');
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">แจ้งปัญหาใหม่</div>
          <div className="page-subtitle">กรอกข้อมูลเพื่อรายงานปัญหาหรือแจ้งเหตุขัดข้อง</div>
        </div>
      </div>

      <div className="card" style={{ padding: 30, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>หัวข้อปัญหา <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <input type="text" className="input" value={formData.topic || ''} onChange={e => setFormData({...formData, topic: e.target.value})} style={{ width: '100%', padding: '12px 16px', fontSize: 15 }} placeholder="ตัวอย่าง: อินเทอร์เน็ตใช้งานไม่ได้, เครื่องพิมพ์กระดาษติด" />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>รายละเอียด</label>
            <textarea className="input" rows={5} value={formData.detail || ''} onChange={e => setFormData({...formData, detail: e.target.value})} style={{ width: '100%', padding: '12px 16px', fontSize: 15 }} placeholder="อธิบายปัญหาที่พบเพิ่มเติม..." />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>พิกัดจุดเกิดเหตุ (คลิกบนแผนที่เพื่อปักหมุด)</label>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <MapComponent 
                height="320px" 
                selectedPos={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : null}
                onPositionSelect={(lat, lng) => setFormData({...formData, lat, lng})}
              />
            </div>
            {formData.lat && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
              ละติจูด: {formData.lat.toFixed(6)}, ลองจิจูด: {formData.lng!.toFixed(6)}
            </div>}
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>วันที่แจ้ง</label>
              <input type="date" className="input" value={formData.report_date || ''} onChange={e => setFormData({...formData, report_date: e.target.value})} style={{ width: '100%', padding: '12px 16px', fontSize: 15 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>สถานะเบื้องต้น</label>
              <select className="input" value={formData.status || 'open'} onChange={e => setFormData({...formData, status: e.target.value as IssueStatus})} style={{ width: '100%', padding: '12px 16px', fontSize: 15 }}>
                <option value="open">เปิด (รอรับเรื่อง)</option>
                <option value="in-progress">กำลังแก้ไข</option>
                <option value="resolved">แก้ไขแล้ว</option>
                <option value="closed">ปิด</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--text-secondary)' }}>ผู้แจ้ง</label>
            <select className="input" value={formData.reporter_id || ''} onChange={e => setFormData({...formData, reporter_id: e.target.value})} style={{ width: '100%', padding: '12px 16px', fontSize: 15 }}>
              {users.map(u => <option key={u.user_id} value={u.user_id}>{u.firstname} {u.lastname} ({u.role})</option>)}
            </select>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 16, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-ghost" onClick={() => router.push('/issues')} style={{ padding: '10px 24px', fontSize: 15 }}>ยกเลิก</button>
            <button className="btn btn-primary" onClick={handleSave} style={{ padding: '10px 24px', fontSize: 15 }}>ส่งข้อมูลแจ้งปัญหา</button>
          </div>
        </div>
      </div>
    </>
  );
}
