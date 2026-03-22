'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import { User, UserRole } from '@/app/lib/mock-data';
import Modal from '@/app/components/Modal';

const roleColors: Record<string, string> = {
  admin: '#F43F5E', manager: '#8B5CF6', technician: '#3B82F6', staff: '#10B981',
};
const roleLabels: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ', manager: 'ผู้จัดการ', technician: 'ช่างเทคนิค', staff: 'พนักงาน',
};
const avatarColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#EC4899','#14B8A6','#F97316','#A855F7'];

export default function UsersPage() {
  const { users, departments, addUser, updateUser, deleteUser } = useAppContext();
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<User>>({});

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      user_id: `U${String(users.length + 1).padStart(3, '0')}`,
      firstname: '',
      lastname: '',
      email: '',
      tel: '',
      role: 'staff',
      dept_id: departments[0]?.dept_id || 'D001',
      avatar_color: avatarColors[Math.floor(Math.random() * avatarColors.length)]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) {
      deleteUser(id);
    }
  };

  const handleSave = () => {
    if (!formData.firstname || !formData.lastname) return alert('กรุณาระบุชื่อและนามสกุล');
    if (editingUser) {
      updateUser(formData as User);
    } else {
      addUser(formData as User);
    }
    setIsModalOpen(false);
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [u.firstname, u.lastname, u.email, u.tel].some(v => v.toLowerCase().includes(q));
    }
    return true;
  });

  const roles = ['all', 'admin', 'manager', 'technician', 'staff'];
  const roleCount = (r: string) => r === 'all' ? users.length : users.filter(u => u.role === r).length;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">จัดการผู้ใช้งาน</div>
          <div className="page-subtitle">ทั้งหมด {users.length} คน ใน {departments.length} แผนก</div>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ เพิ่มผู้ใช้ใหม่</button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {roles.map(r => (
          <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setRoleFilter(r)}>
            {r === 'all' ? 'ทั้งหมด' : roleLabels[r]} ({roleCount(r)})
          </button>
        ))}
      </div>

      <div className="search-box" style={{ maxWidth: 340, marginBottom: 20 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
        <input placeholder="ค้นหาชื่อ อีเมล เบอร์โทร..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map((u, i) => {
          const dept = departments.find(d => d.dept_id === u.dept_id);
          return (
            <div key={u.user_id} className="card animate-fade-in" style={{ padding: '18px 20px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => openEditModal(u)}>✎</button>
                <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--accent-rose)' }} onClick={() => handleDelete(u.user_id)}>✕</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div className="avatar avatar-lg" style={{ background: u.avatar_color || avatarColors[i % avatarColors.length] }}>
                  {u.firstname[0]}{(u.lastname || ' ')[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', paddingRight: 40 }}>{u.firstname} {u.lastname}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span className="badge" style={{ background: `${roleColors[u.role]}18`, color: roleColors[u.role], border: `1px solid ${roleColors[u.role]}35`, fontSize: 10 }}>
                  {roleLabels[u.role]}
                </span>
              </div>
              <div className="divider" style={{ marginBottom: 12 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span>🏢</span> {dept?.dept_name ?? '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span>📞</span> {u.tel}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: 10 }}>ID:</span> <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{u.user_id}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>ไม่พบผู้ใช้งาน</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ชื่อ</label>
              <input type="text" className="input" value={formData.firstname || ''} onChange={e => setFormData({...formData, firstname: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>นามสกุล</label>
              <input type="text" className="input" value={formData.lastname || ''} onChange={e => setFormData({...formData, lastname: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>อีเมล</label>
              <input type="email" className="input" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>เบอร์โทรศัพท์</label>
              <input type="text" className="input" value={formData.tel || ''} onChange={e => setFormData({...formData, tel: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>บทบาท</label>
              <select className="input" value={formData.role || 'staff'} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="staff">พนักงาน</option>
                <option value="technician">ช่างเทคนิค</option>
                <option value="manager">ผู้จัดการ</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>แผนก</label>
              <select className="input" value={formData.dept_id || ''} onChange={e => setFormData({...formData, dept_id: e.target.value})} style={{ width: '100%', padding: '8px 12px' }}>
                {departments.map(d => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
              </select>
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
