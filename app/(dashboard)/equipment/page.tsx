'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import { Equipment } from '@/app/lib/mock-data';
import Modal from '@/app/components/Modal';

const categoryColors: Record<string, string> = {
  Network: '#3B82F6', Hardware: '#8B5CF6', Consumable: '#F59E0B', Storage: '#10B981', Security: '#F43F5E',
};

export default function EquipmentPage() {
  const { equipment, units, addEquipment, updateEquipment, deleteEquipment } = useAppContext();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  const categories = ['all', ...Array.from(new Set(equipment.map(e => e.type_category)))];

  const openAddModal = () => {
    setEditingEquipment(null);
    setFormData({
      equip_id: `E${String((equipment.length > 0 ? Math.max(...equipment.map(x => parseInt(x.equip_id.replace(/\\D/g, ''), 10) || 0)) : 0) + 1).padStart(3, '0')}`,
      name: '',
      type_category: 'Hardware',
      remain_qty: 0,
      total_qty: 0,
      unit_id: units[0]?.unit_id || 'UN01',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (equip: Equipment) => {
    setEditingEquipment(equip);
    setFormData(equip);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบอุปกรณ์นี้ใช่หรือไม่?')) {
      deleteEquipment(id);
    }
  };

  const handleSave = () => {
    if (!formData.name) return alert('กรุณาระบุชื่ออุปกรณ์');
    if (editingEquipment) {
      updateEquipment(formData as Equipment);
    } else {
      addEquipment(formData as Equipment);
    }
    setIsModalOpen(false);
  };

  const filtered = equipment.filter(e => {
    if (categoryFilter !== 'all' && e.type_category !== categoryFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalItems = equipment.length;
  const lowStock = equipment.filter(e => e.remain_qty <= e.total_qty * 0.2).length;
  const outOfStock = equipment.filter(e => e.remain_qty === 0).length;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">อุปกรณ์ & วัสดุ</div>
          <div className="page-subtitle">ทั้งหมด {totalItems} รายการ · สต็อกต่ำ {lowStock} · หมด {outOfStock}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={openAddModal}>+ เพิ่มอุปกรณ์</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'รายการทั้งหมด', value: totalItems, color: '#3B82F6', icon: '📦' },
          { label: 'สต็อกต่ำ (≤20%)', value: lowStock,   color: '#F59E0B', icon: '⚠' },
          { label: 'หมดสต็อก',       value: outOfStock,  color: '#F43F5E', icon: '❌' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, background: `${s.color}18`, border: `1px solid ${s.color}35`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-box" style={{ maxWidth: 280 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
          <input placeholder="ค้นหาอุปกรณ์..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} className={`btn btn-sm ${categoryFilter === c ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setCategoryFilter(c)}
              style={categoryFilter === c ? {} : { borderColor: c !== 'all' ? `${categoryColors[c] ?? '#64748B'}50` : undefined }}>
              {c === 'all' ? 'ทั้งหมด' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่ออุปกรณ์</th>
              <th>ประเภท</th>
              <th>หน่วย</th>
              <th style={{ textAlign: 'right' }}>จำนวนทั้งหมด</th>
              <th style={{ textAlign: 'right' }}>คงเหลือ</th>
              <th style={{ minWidth: 160 }}>สต็อก</th>
              <th>สถานะ</th>
              <th style={{ textAlign: 'right' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const unit = units.find(u => u.unit_id === e.unit_id);
              const ratio = e.total_qty > 0 ? e.remain_qty / e.total_qty : 0;
              const pct = Math.round(ratio * 100);
              const color = e.remain_qty === 0 ? '#F43F5E' : ratio <= 0.2 ? '#F59E0B' : '#10B981';
              return (
                <tr key={e.equip_id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{e.equip_id}</div>
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: `${categoryColors[e.type_category] ?? '#64748B'}18`,
                      color: categoryColors[e.type_category] ?? '#94A3B8',
                      border: `1px solid ${categoryColors[e.type_category] ?? '#64748B'}30`,
                    }}>{e.type_category}</span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit?.unit_name ?? '—'}</td>
                  <td style={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>{e.total_qty}</td>
                  <td style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color }}>
                    {e.remain_qty}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar-track" style={{ flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      padding: '3px 9px', borderRadius: 999,
                      background: e.remain_qty === 0 ? 'rgba(244,63,94,0.12)' : ratio <= 0.2 ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                      color: e.remain_qty === 0 ? '#FB7185' : ratio <= 0.2 ? '#FCD34D' : '#34D399',
                      border: `1px solid ${e.remain_qty === 0 ? 'rgba(244,63,94,0.25)' : ratio <= 0.2 ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
                    }}>
                      {e.remain_qty === 0 ? 'หมดสต็อก' : ratio <= 0.2 ? 'สต็อกต่ำ' : 'ปกติ'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => openEditModal(e)}>✎</button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--accent-rose)' }} onClick={() => handleDelete(e.equip_id)}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>ไม่พบอุปกรณ์</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEquipment ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>รหัสอุปกรณ์</label>
            <input type="text" className="input" value={formData.equip_id || ''} disabled style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-hover)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ชื่ออุปกรณ์</label>
            <input type="text" className="input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px 12px' }} />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>ประเภท</label>
              <select className="input" value={formData.type_category || 'Hardware'} onChange={e => setFormData({...formData, type_category: e.target.value})} style={{ width: '100%', padding: '8px 12px' }}>
                <option value="Network">Network</option>
                <option value="Hardware">Hardware</option>
                <option value="Consumable">Consumable</option>
                <option value="Storage">Storage</option>
                <option value="Security">Security</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>หน่วยนับ</label>
              <select className="input" value={formData.unit_id || ''} onChange={e => setFormData({...formData, unit_id: e.target.value})} style={{ width: '100%', padding: '8px 12px' }}>
                {units.map(u => <option key={u.unit_id} value={u.unit_id}>{u.unit_name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>จำนวนทั้งหมด</label>
              <input type="number" className="input" value={formData.total_qty || 0} onChange={e => setFormData({...formData, total_qty: Number(e.target.value)})} style={{ width: '100%', padding: '8px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>จำนวนคงเหลือ</label>
              <input type="number" className="input" value={formData.remain_qty || 0} onChange={e => setFormData({...formData, remain_qty: Number(e.target.value)})} style={{ width: '100%', padding: '8px 12px' }} />
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
