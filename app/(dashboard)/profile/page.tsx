'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import { User } from '@/app/lib/mock-data';

export default function ProfilePage() {
  const { users, updateUser, departments } = useAppContext();
  
  // Mock current user
  const currentUser = users.find(u => u.user_id === 'U001');
  
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isClient, setIsClient] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (currentUser) {
      setFormData(currentUser);
    }
  }, [currentUser]);

  if (!isClient || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstname || !formData.lastname || !formData.email) {
      return alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
    }
    updateUser(formData as User);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getDeptName = (deptId: string) => departments.find(d => d.dept_id === deptId)?.dept_name || 'ไม่ระบุแผนก';

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">โปรไฟล์ส่วนตัว</div>
          <div className="page-subtitle">จัดการข้อมูลส่วนตัวและตั้งค่าบัญชีของคุณ</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Profile Snapshot Card */}
        <div className="card" style={{ padding: '30px 20px', textAlign: 'center' }}>
          <div 
            style={{ 
              width: 100, height: 100, borderRadius: '50%', 
              background: formData.avatar_color || '#3B82F6', 
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, color: '#fff',
              boxShadow: `0 8px 24px ${formData.avatar_color || '#3B82F6'}40`
            }}
          >
            {formData.firstname?.[0]}{formData.lastname?.[0]}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {formData.firstname} {formData.lastname}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            {formData.email}
          </div>
          <span style={{ 
            display: 'inline-block', padding: '4px 12px', borderRadius: 20, 
            fontSize: 12, fontWeight: 600, background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', textTransform: 'uppercase' 
          }}>
            {formData.role}
          </span>
          
          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 24, paddingTop: 20, textAlign: 'left' }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>รหัสพนักงาน</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{formData.user_id}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>แผนก</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{getDeptName(formData.dept_id!)}</div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>ตั้งค่าข้อมูลพื้นฐาน</h3>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ชื่อจริง <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                <input 
                  type="text" className="input" 
                  value={formData.firstname || ''} 
                  onChange={e => setFormData({...formData, firstname: e.target.value})} 
                  style={{ width: '100%', padding: '10px 14px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>นามสกุล <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                <input 
                  type="text" className="input" 
                  value={formData.lastname || ''} 
                  onChange={e => setFormData({...formData, lastname: e.target.value})} 
                  style={{ width: '100%', padding: '10px 14px' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>อีเมล <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                <input 
                  type="email" className="input" 
                  value={formData.email || ''} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  style={{ width: '100%', padding: '10px 14px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>เบอร์โทรศัพท์</label>
                <input 
                  type="text" className="input" 
                  value={formData.tel || ''} 
                  onChange={e => setFormData({...formData, tel: e.target.value})} 
                  style={{ width: '100%', padding: '10px 14px' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>สีประจำตัวในระบบ</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4', '#EC4899', '#A855F7', '#14B8A6', '#F97316'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, avatar_color: color})}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: color, border: 'none', cursor: 'pointer',
                      boxShadow: formData.avatar_color === color ? `0 0 0 3px var(--bg-primary), 0 0 0 6px ${color}` : 'none',
                      transition: 'all 0.15s'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 10, paddingTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
              {isSaved && <span style={{ fontSize: 13, color: 'var(--accent-emerald)', fontWeight: 500 }} className="animate-fade-in">✓ บันทึกข้อมูลสำเร็จ</span>}
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 24px' }}>บันทึกการเปลี่ยนแปลง</button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}
