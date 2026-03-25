'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Equipment, EquipmentStatus } from '@/app/lib/types';

export default function NewEquipmentPage() {
  const router = useRouter();
  const { equipment, departments, units, addEquipment } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    type_category: 'hardware',
    remain_qty: 1,
    total_qty: 1,
    unit_id: units[0]?.unit_id || 'U001',
    dept_id: departments[0]?.dept_id || 'D001'
  });

  useEffect(() => {
    // Generate new ID when component mounts
    const newId = `E${String((equipment.length > 0 ? Math.max(...equipment.map(x => parseInt(x.equip_id.replace(/\D/g, ''), 10) || 0)) : 0) + 1).padStart(3, '0')}`;
    setFormData(prev => ({ ...prev, equip_id: newId }));
  }, [equipment]);

  const handleSave = () => {
    if (!formData.name) return alert('กรุณาระบุชื่ออุปกรณ์');
    if (!formData.type_category) return alert('กรุณาเลือกประเภทอุปกรณ์');
    if (!formData.remain_qty || formData.remain_qty < 0) return alert('กรุณาระบุจำนวนที่เหลือให้ถูกต้อง');
    if (!formData.total_qty || formData.total_qty < 0) return alert('กรุณาระบุจำนวนทั้งหมดให้ถูกต้อง');
    
    addEquipment(formData as Equipment);
    router.push('/equipment');
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">เพิ่มอุปกรณ์ใหม่</div>
          <div className="page-subtitle">กรอกข้อมูลอุปกรณ์ที่ต้องการเพิ่มลงระบบ</div>
        </div>
      </div>

      <div className="card" style={{ padding: '30px 32px', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>รหัสอุปกรณ์</label>
          <input 
            type="text" 
            disabled
            className="input" 
            value={formData.equip_id || ''} 
            style={{ width: '100%', padding: '10px 14px', color: 'var(--text-muted)' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>ชื่ออุปกรณ์ <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
          <input 
            type="text" 
            className="input" 
            placeholder="ตัวอย่าง: MacBook Pro 14, Dell UltraSharp 27"
            value={formData.name || ''} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '10px 14px' }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>ประเภท <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <select 
              className="input" 
              value={formData.type_category || 'hardware'}
              onChange={e => setFormData({...formData, type_category: e.target.value})}
              style={{ width: '100%', padding: '10px 14px' }}
            >
              <option value="hardware">ฮาร์ดแวร์</option>
              <option value="software">ซอฟต์แวร์</option>
              <option value="networking">เครือข่าย</option>
              <option value="peripherals">อุปกรณ์เสริม</option>
              <option value="storage">การเก็บข้อมูล</option>
              <option value="tools">เครื่องมือ</option>
              <option value="consumables">วัสดุสิ้นเปลืองใช้</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>หน่วยนับ</label>
            <select 
              className="input" 
              value={formData.unit_id || ''}
              onChange={e => setFormData({...formData, unit_id: e.target.value})}
              style={{ width: '100%', padding: '10px 14px' }}
            >
              {units.map(u => (
                <option key={u.unit_id} value={u.unit_id}>
                  {u.unit_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>จำนวนทั้งหมด <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <input 
              type="number" 
              min="0"
              className="input" 
              value={formData.total_qty || 0}
              onChange={e => setFormData({...formData, total_qty: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '10px 14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>จำนวนที่เหลือ <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
            <input 
              type="number" 
              min="0"
              className="input" 
              value={formData.remain_qty || 0}
              onChange={e => setFormData({...formData, remain_qty: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '10px 14px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>แผนก</label>
          <select 
            className="input" 
            value={formData.dept_id || ''}
            onChange={e => setFormData({...formData, dept_id: e.target.value})}
            style={{ width: '100%', padding: '10px 14px' }}
          >
            {departments.map(d => (
              <option key={d.dept_id} value={d.dept_id}>
                {d.dept_name}
              </option>
            ))}
          </select>
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
            บันทึกอุปกรณ์
          </button>
        </div>
      </div>
    </>
  );
}
