'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import { Department } from '@/app/lib/types';
import Modal from '@/app/components/Modal';
import { Building2, Edit2, X } from 'lucide-react';

const deptColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E'];
const roleLabels: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ', manager: 'ผู้จัดการ', technician: 'ช่างเทคนิค', staff: 'พนักงาน',
};
const avatarColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#EC4899','#14B8A6','#F97316','#A855F7'];

export default function DepartmentsPage() {
  const { departments, users, addDepartment, updateDepartment, deleteDepartment } = useAppContext();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({});

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({
      dept_id: `D${String((departments.length > 0 ? Math.max(...departments.map(x => parseInt(x.dept_id.replace(/\\D/g, ''), 10) || 0)) : 0) + 1).padStart(3, '0')}`,
      dept_name: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setFormData(dept);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, memberCount: number) => {
    if (memberCount > 0) {
      alert('ไม่สามารถลบแผนกที่มีสมาชิกอยู่ได้ กรุณาย้ายสมาชิกออกก่อน');
      return;
    }
    if (confirm('คุณต้องการลบแผนกนี้ใช่หรือไม่?')) {
      deleteDepartment(id);
    }
  };

  const handleSave = () => {
    if (!formData.dept_name) return alert('กรุณาระบุชื่อแผนก');
    if (editingDept) {
      updateDepartment(formData as Department);
    } else {
      addDepartment(formData as Department);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">แผนก</div>
          <div className="page-subtitle">ทั้งหมด {departments.length} แผนก</div>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ เพิ่มแผนก</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {departments.map((dept, di) => {
          const members = users.filter(u => u.dept_id === dept.dept_id);
          const color = deptColors[di % deptColors.length];
          return (
            <div key={dept.dept_id} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4, zIndex: 2 }}>
                <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }} onClick={() => openEditModal(dept)}><Edit2 size={14}/></button>
                <button className="btn btn-ghost btn-sm" style={{ padding: '6px', color: 'var(--accent-rose)' }} onClick={() => handleDelete(dept.dept_id, members.length)}><X size={14}/></button>
              </div>

              {/* Header */}
              <div style={{ padding: '18px 20px', background: `${color}12`, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12, paddingRight: 90 }}>
                <div style={{ width: 40, height: 40, background: `${color}25`, border: `1px solid ${color}40`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                  <Building2 size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{dept.dept_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>รหัส: {dept.dept_id}</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: color, lineHeight: 1 }}>{members.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>คน</div>
                </div>
              </div>

              {/* Members */}
              <div style={{ padding: '14px 20px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>สมาชิก</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {members.map((u, i) => (
                    <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: u.avatar_color || avatarColors[i % avatarColors.length] }}>
                        {u.firstname[0]}{(u.lastname || ' ')[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{u.firstname} {u.lastname}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{roleLabels[u.role]}</span>
                    </div>
                  ))}
                  {members.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>ยังไม่มีสมาชิก</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? 'แก้ไขแผนก' : 'เพิ่มแผนกใหม่'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>รหัสแผนก</label>
            <input type="text" className="input" value={formData.dept_id || ''} disabled style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-hover)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ชื่อแผนก</label>
            <input type="text" className="input" value={formData.dept_name || ''} onChange={e => setFormData({...formData, dept_name: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
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
