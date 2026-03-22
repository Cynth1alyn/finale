'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import { Equipment } from '@/app/lib/mock-data';
import Modal from '@/app/components/Modal';
import DataTable from '@/app/components/DataTable';
import { Package, AlertTriangle, XCircle, Edit2, X } from 'lucide-react';

const categoryColors: Record<string, string> = {
  Network: '#3B82F6', Hardware: '#8B5CF6', Consumable: '#F59E0B', Storage: '#10B981', Security: '#F43F5E',
};

export default function EquipmentPage() {
  const { equipment, units, addEquipment, updateEquipment, deleteEquipment } = useAppContext();
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
    return true;
  });

  const totalItems = equipment.length;
  const lowStock = equipment.filter(e => e.remain_qty <= e.total_qty * 0.2).length;
  const outOfStock = equipment.filter(e => e.remain_qty === 0).length;

  const tableData = filtered.map(e => {
    const unit = units.find(u => u.unit_id === e.unit_id);
    return {
      ...e,
      _unit_name: unit?.unit_name ?? '—',
    };
  });

  const columns = [
    {
      key: 'name',
      label: 'ชื่ออุปกรณ์',
      render: (row: typeof tableData[0]) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{row.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{row.equip_id}</div>
        </div>
      ),
    },
    {
      key: 'type_category',
      label: 'ประเภท',
      render: (row: typeof tableData[0]) => (
        <span className="badge" style={{
          background: `${categoryColors[row.type_category] ?? '#64748B'}18`,
          color: categoryColors[row.type_category] ?? '#94A3B8',
          border: `1px solid ${categoryColors[row.type_category] ?? '#64748B'}30`,
        }}>{row.type_category.toUpperCase()}</span>
      ),
    },
    { key: '_unit_name', label: 'หน่วย', render: (row: typeof tableData[0]) => <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row._unit_name}</span> },
    { key: 'total_qty', label: 'จำนวนทั้งหมด', align: 'center', render: (row: typeof tableData[0]) => <div style={{ fontSize: 14, fontWeight: 600 }}>{row.total_qty}</div> },
    {
      key: 'remain_qty',
      label: 'คงเหลือ',
      align: 'center',
      render: (row: typeof tableData[0]) => {
        const ratio = row.total_qty > 0 ? row.remain_qty / row.total_qty : 0;
        const color = row.remain_qty === 0 ? '#F43F5E' : ratio <= 0.2 ? '#F59E0B' : '#10B981';
        return <div style={{ fontSize: 14, fontWeight: 700, color }}>{row.remain_qty}</div>;
      },
    },
    {
      key: '_stock_progress',
      label: 'สต็อก',
      sortable: false,
      width: 160,
      render: (row: typeof tableData[0]) => {
        const ratio = row.total_qty > 0 ? row.remain_qty / row.total_qty : 0;
        const pct = Math.round(ratio * 100);
        const color = row.remain_qty === 0 ? '#F43F5E' : ratio <= 0.2 ? '#F59E0B' : '#10B981';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="progress-bar-track" style={{ flex: 1, minWidth: 60 }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>{pct}%</span>
          </div>
        );
      },
    },
    {
      key: '_status',
      label: 'สถานะ',
      sortable: false,
      render: (row: typeof tableData[0]) => {
        const ratio = row.total_qty > 0 ? row.remain_qty / row.total_qty : 0;
        return (
          <span style={{
            fontSize: 11, fontWeight: 600,
            padding: '3px 9px', borderRadius: 999,
            background: row.remain_qty === 0 ? 'rgba(244,63,94,0.12)' : ratio <= 0.2 ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
            color: row.remain_qty === 0 ? '#FB7185' : ratio <= 0.2 ? '#FCD34D' : '#34D399',
            border: `1px solid ${row.remain_qty === 0 ? 'rgba(244,63,94,0.25)' : ratio <= 0.2 ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
          }}>
            {row.remain_qty === 0 ? 'หมดสต็อก' : ratio <= 0.2 ? 'สต็อกต่ำ' : 'ปกติ'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'จัดการ',
      sortable: false,
      align: 'right',
      render: (row: typeof tableData[0]) => (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }} onClick={() => openEditModal(row as Equipment)}><Edit2 size={14} /></button>
          <button className="btn btn-ghost btn-sm" style={{ padding: '6px', color: 'var(--accent-rose)' }} onClick={() => handleDelete(row.equip_id)}><X size={14} /></button>
        </div>
      ),
    },
  ];

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
          { label: 'รายการทั้งหมด', value: totalItems, color: '#3B82F6', icon: <Package size={20} color="#3B82F6" /> },
          { label: 'สต็อกต่ำ (≤20%)', value: lowStock,   color: '#F59E0B', icon: <AlertTriangle size={20} color="#F59E0B" /> },
          { label: 'หมดสต็อก',       value: outOfStock,  color: '#F43F5E', icon: <XCircle size={20} color="#F43F5E" /> },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, background: `${s.color}18`, border: `1px solid ${s.color}35`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
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

      <div className="card" style={{ padding: 20 }}>
        <DataTable
          data={tableData as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          searchKeys={['name', 'equip_id']}
        />
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
