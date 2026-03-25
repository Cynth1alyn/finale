'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Equipment } from '@/app/lib/types';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { api } from '@/app/lib/api';

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { equipment, departments, units, updateEquipment, deleteEquipment } = useAppContext();
  const [equipId, setEquipId] = useState<string>('');

  useEffect(() => {
    params.then(p => setEquipId(p.id));
  }, [params]);

  const equip = equipment.find(e => e.equip_id === equipId);
  const dept = equip ? departments.find(d => d.dept_id === equip.dept_id) : null;
  const unit = equip ? units.find(u => u.unit_id === equip.unit_id) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  useEffect(() => {
    if (equip) {
      setFormData(equip);
    }
  }, [equip]);

  if (!equip) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        ไม่พบอุปกรณ์ #{equipId}
        <br />
        <Link href="/equipment" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          ← กลับ
        </Link>
      </div>
    );
  }

  const usage = formData.total_qty ? Math.round(((formData.total_qty - (formData.remain_qty || 0)) / formData.total_qty) * 100) : 0;
  const stockStatus = formData.remain_qty === 0 ? 'หมด' : formData.remain_qty! <= 3 ? 'เหลือน้อย' : 'พอ';
  const statusColor = formData.remain_qty === 0 ? 'var(--accent-rose)' : formData.remain_qty! <= 3 ? '#F59E0B' : 'var(--accent-emerald)';

  const handleSave = () => {
    if (!formData.name) return alert('กรุณาระบุชื่ออุปกรณ์');
    updateEquipment(formData as Equipment);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`คุณต้องการลบอุปกรณ์ "${equip.name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้`)) {
      deleteEquipment(equipId);
      router.push('/equipment');
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/equipment" className="btn btn-ghost btn-sm">← กลับ</Link>
          <div>
            <div className="page-title">{equip.name}</div>
            <div className="page-subtitle">รหัส: {equip.equip_id}</div>
          </div>
        </div>
        <div style={{
          padding: '8px 12px',
          borderRadius: 6,
          background: statusColor,
          color: '#fff',
          fontSize: 13,
          fontWeight: 600
        }}>
          {stockStatus} ({formData.remain_qty}/{formData.total_qty})
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Info Card */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ข้อมูลอุปกรณ์
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    background: 'var(--accent-blue)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  แก้ไข
                </button>
              )}
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>ชื่ออุปกรณ์</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>ประเภท</label>
                  <select
                    className="input"
                    value={formData.type_category || ''}
                    onChange={e => setFormData({...formData, type_category: e.target.value})}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>จำนวนทั้งหมด</label>
                    <input
                      type="number"
                      min="0"
                      className="input"
                      value={formData.total_qty || 0}
                      onChange={e => setFormData({...formData, total_qty: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>จำนวนที่เหลือ</label>
                    <input
                      type="number"
                      min="0"
                      className="input"
                      value={formData.remain_qty || 0}
                      onChange={e => setFormData({...formData, remain_qty: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(equip);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 4,
                      background: 'var(--bg-hover)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 4,
                      background: 'var(--accent-emerald)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>ประเภท</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    {formData.type_category === 'hardware' && 'ฮาร์ดแวร์'}
                    {formData.type_category === 'software' && 'ซอฟต์แวร์'}
                    {formData.type_category === 'networking' && 'เครือข่าย'}
                    {formData.type_category === 'peripherals' && 'อุปกรณ์เสริม'}
                    {formData.type_category === 'storage' && 'การเก็บข้อมูล'}
                    {formData.type_category === 'tools' && 'เครื่องมือ'}
                    {formData.type_category === 'consumables' && 'วัสดุสิ้นเปลืองใช้'}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>จำนวนทั้งหมด</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{formData.total_qty}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>จำนวนเหลือ</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: statusColor }}>{formData.remain_qty}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Usage Bar */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              การใช้งาน
            </h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--text-primary)' }}>ความเสริม</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{usage}%</span>
              </div>
              <div style={{
                width: '100%',
                height: 8,
                background: 'var(--bg-hover)',
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${usage}%`,
                  height: '100%',
                  background: usage > 80 ? 'var(--accent-rose)' : usage > 50 ? '#F59E0B' : 'var(--accent-emerald)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              ใช้แล้ว: {(formData.total_qty || 0) - (formData.remain_qty || 0)} /{' '}
              {formData.total_qty}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>รหัสอุปกรณ์</div>
            <div style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-blue-light)' }}>{equip.equip_id}</div>
          </div>

          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>แผนก</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {dept?.dept_name || '—'}
            </div>
            {dept && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {dept.dept_id}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>หน่วยนับ</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {unit?.unit_name || '—'}
            </div>
          </div>

          {/* History Section */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ประวัติความเคลื่อนไหว
            </h3>
            
            <EquipmentHistoryList equipId={equipId} />
          </div>

          <button
            onClick={handleDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              background: 'var(--accent-rose)',
              color: '#fff',
              border: 'none',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: 'auto',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Trash2 size={16} /> ลบอุปกรณ์
          </button>
        </div>
      </div>
    </>
  );
}

function EquipmentHistoryList({ equipId }: { equipId: string }) {
  const { users } = useAppContext();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (equipId) {
      api.equipment.getEquipmentHistory(equipId)
        .then(setHistory)
        .finally(() => setLoading(false));
    }
  }, [equipId]);

  if (loading) return <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>กำลังโหลดประวัติ...</div>;
  if (history.length === 0) return <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>ยังไม่มีประวัติการทำรายการ</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {history.map((h, i) => {
        const user = users.find(u => u.user_id === h.user_id);
        const actionColors: Record<string, string> = {
          'check-out': 'var(--accent-blue)',
          'check-in': 'var(--accent-emerald)',
          'maintenance': 'var(--accent-amber)',
          'repair': 'var(--accent-rose)',
          'retired': 'var(--text-muted)',
        };

        return (
          <div key={h.id} style={{ display: 'flex', gap: 12, position: 'relative' }}>
            {i < history.length - 1 && (
              <div style={{ position: 'absolute', left: 5, top: 20, bottom: -12, width: 2, background: 'var(--border-color)' }} />
            )}
            <div style={{ 
              width: 12, height: 12, borderRadius: '50%', 
              background: actionColors[h.action] || 'var(--accent-blue)', 
              marginTop: 4, zIndex: 1,
              boxShadow: `0 0 0 4px var(--bg-card)`
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {h.action === 'check-out' && 'ยืมอุปกรณ์'}
                  {h.action === 'check-in' && 'คืนอุปกรณ์'}
                  {h.action === 'maintenance' && 'บำรุงรักษา'}
                  {h.action === 'repair' && 'ซ่อมแซม'}
                  {h.action === 'retired' && 'ปลดระวาง'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.date}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                โดย: {user ? `${user.firstname} ${user.lastname}` : '—'}
              </div>
              {h.notes && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  "{h.notes}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
