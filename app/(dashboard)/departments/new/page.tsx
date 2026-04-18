'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Department } from '@/app/lib/types';

export default function NewDepartmentPage() {
  const router = useRouter();
  const { departments, addDepartment } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<Department>>({
    dept_name: '',
    description: ''
  });

  useEffect(() => {
    // Generate new ID when component mounts
    const newId = `D${String((departments.length > 0 ? Math.max(...departments.map(x => parseInt(x.dept_id.replace(/\D/g, ''), 10) || 0)) : 0) + 1).padStart(3, '0')}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(prev => ({ ...prev, dept_id: newId }));
  }, [departments]);

  const handleSave = () => {
    if (!formData.dept_name) return alert('กรุณาระบุชื่อแผนก');
    
    addDepartment(formData as Department);
    router.push('/departments');
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">สร้างแผนกใหม่</div>
          <div className="page-subtitle">กรอกข้อมูลแผนกใหม่</div>
        </div>
      </div>

      <div className="card" style={{ padding: '30px 32px', maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>รหัสแผนก</label>
          <input 
            type="text" 
            disabled
            className="input" 
            value={formData.dept_id || ''} 
            style={{ width: '100%', padding: '10px 14px', color: 'var(--text-muted)' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>ชื่อแผนก <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
          <input 
            type="text" 
            className="input" 
            placeholder="ตัวอย่าง: IT Infrastructure, Software Development"
            value={formData.dept_name || ''} 
            onChange={e => setFormData({...formData, dept_name: e.target.value})}
            style={{ width: '100%', padding: '10px 14px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>คำอธิบาย</label>
          <textarea 
            className="input" 
            rows={4}
            placeholder="อธิบายบทบาทหน้าที่ของแผนก..."
            value={formData.description || ''} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', padding: '10px 14px' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              background: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--border-color)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              background: 'var(--accent-emerald)',
              color: '#fff',
              border: 'none',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            บันทึกแผนก
          </button>
        </div>
      </div>
    </>
  );
}
