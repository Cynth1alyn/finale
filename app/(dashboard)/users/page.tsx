'use client';

import { useState } from 'react';
import { users, departments, getUsersInDept } from '@/app/lib/mock-data';
import StatusBadge from '@/app/components/StatusBadge';

const roleColors: Record<string, string> = {
  admin: '#F43F5E', manager: '#8B5CF6', technician: '#3B82F6', staff: '#10B981',
};
const roleLabels: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ', manager: 'ผู้จัดการ', technician: 'ช่างเทคนิค', staff: 'พนักงาน',
};
const avatarColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#EC4899','#14B8A6','#F97316','#A855F7'];

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

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
        <button className="btn btn-primary">+ เพิ่มผู้ใช้ใหม่</button>
      </div>

      {/* Role tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {roles.map(r => (
          <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setRoleFilter(r)}>
            {r === 'all' ? 'ทั้งหมด' : roleLabels[r]} ({roleCount(r)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-box" style={{ maxWidth: 340, marginBottom: 20 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
        <input placeholder="ค้นหาชื่อ อีเมล เบอร์โทร..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>}
      </div>

      {/* User cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map((u, i) => {
          const dept = departments.find(d => d.dept_id === u.dept_id);
          return (
            <div key={u.user_id} className="card animate-fade-in" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div className="avatar avatar-lg" style={{ background: avatarColors[i % avatarColors.length] }}>
                  {u.firstname[0]}{u.lastname[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{u.firstname} {u.lastname}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
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
    </>
  );
}
