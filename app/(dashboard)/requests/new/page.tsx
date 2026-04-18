'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Request, RequestStatus } from '@/app/lib/types';
import { X, Plus } from 'lucide-react';

export default function NewRequestPage() {
  const router = useRouter();
  const { requests, users, equipment, addRequest } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<Request>>({
    req_date: new Date().toISOString().split('T')[0],
    req_status: RequestStatus.PENDING,
    user_id: users[0]?.user_id || 'U001',
    items: []
  });

  const [itemsPage, setItemsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const requestItems = formData.items || [];
  const totalItemsPages = Math.max(1, Math.ceil(requestItems.length / ITEMS_PER_PAGE));
  const activeItemsPage = Math.min(itemsPage, totalItemsPages);
  const currentItems = requestItems.slice((activeItemsPage - 1) * ITEMS_PER_PAGE, activeItemsPage * ITEMS_PER_PAGE);

  useEffect(() => {
    // Generate new ID when component mounts
    const newId = `R${String((requests.length > 0 ? Math.max(...requests.map(x => parseInt(x.req_id?.replace(/\D/g, ''), 10) || 0)) : 0) + 1).padStart(3, '0')}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(prev => ({ ...prev, req_id: newId }));
  }, [requests]);

  const handleAddItem = () => {
    const newItem = {
      item_id: `I${Date.now()}`,
      req_id: formData.req_id || '',
      equip_id: equipment[0]?.equip_id || '',
      qty: 1
    };
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(i => i.item_id !== itemId)
    }));
  };

  const handleUpdateItem = (itemId: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map(i => 
        i.item_id === itemId ? { ...i, [field]: value } : i
      )
    }));
  };

  const handleSave = () => {
    if (!formData.req_id) return alert('ไม่สามารถสร้างรหัสคำขอได้');
    if (!formData.items || formData.items.length === 0) return alert('กรุณาเพิ่มรายการอุปกรณ์อย่างน้อย 1 รายการ');

    addRequest(formData as Request);
    router.push('/requests');
  };



  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">สร้างคำขออุปกรณ์ใหม่</div>
          <div className="page-subtitle">กรอกข้อมูลและเลือกอุปกรณ์ที่ต้องการขอ</div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px 32px', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
        {/* ข้อมูลพื้นฐาน */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>รหัสคำขอ</label>
            <input 
              type="text" 
              disabled
              className="input" 
              value={formData.req_id || ''} 
              style={{ width: '100%', padding: '10px 14px', color: 'var(--text-muted)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>ผู้ขอ</label>
            <select 
              className="input" 
              value={formData.user_id || ''} 
              onChange={e => setFormData({...formData, user_id: e.target.value})}
              style={{ width: '100%', padding: '10px 14px' }}
            >
              {users.map(u => (
                <option key={u.user_id} value={u.user_id}>
                  {u.firstname} {u.lastname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>วันที่ขอ</label>
            <input 
              type="date"
              className="input"
              value={formData.req_date || ''}
              onChange={e => setFormData({...formData, req_date: e.target.value})}
              style={{ width: '100%', padding: '10px 14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>สถานะเบื้องต้น</label>
            <select 
              className="input" 
              value={formData.req_status || RequestStatus.PENDING} 
              onChange={e => setFormData({...formData, req_status: e.target.value as RequestStatus})}
              style={{ width: '100%', padding: '10px 14px' }}
            >
              <option value={RequestStatus.PENDING}>รอพิจารณา</option>
              <option value={RequestStatus.APPROVED}>อนุมัติ</option>
              <option value={RequestStatus.REJECTED}>ปฏิเสธ</option>
              <option value={RequestStatus.FULFILLED}>จัดส่งแล้ว</option>
            </select>
          </div>
        </div>

        {/* รายการอุปกรณ์ */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>รายการอุปกรณ์ที่ขอ</h3>
            <button 
              onClick={handleAddItem}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 6,
                background: 'var(--accent-blue)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Plus size={16} /> เพิ่มรายการ
            </button>
          </div>

          {currentItems.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {currentItems.map(item => (
                <div 
                  key={item.item_id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 60px',
                    gap: 12,
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'var(--bg-hover)',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <select
                    value={item.equip_id}
                    onChange={e => handleUpdateItem(item.item_id, 'equip_id', e.target.value)}
                    style={{ fontSize: 13, padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border-color)' }}
                  >
                    {equipment.map(e => (
                      <option key={e.equip_id} value={e.equip_id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={e => handleUpdateItem(item.item_id, 'qty', parseInt(e.target.value))}
                    style={{ fontSize: 13, padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border-color)' }}
                    placeholder="จำนวน"
                  />
                  
                  <button
                    onClick={() => handleRemoveItem(item.item_id)}
                    style={{
                      padding: '8px 10px',
                      background: 'var(--accent-rose)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {requestItems.length > 0 && totalItemsPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setItemsPage(Math.max(1, itemsPage - 1))}
                disabled={itemsPage === 1}
                style={{
                  padding: '6px 10px',
                  borderRadius: 4,
                  background: itemsPage === 1 ? 'var(--bg-hover)' : 'var(--accent-blue)',
                  color: itemsPage === 1 ? 'var(--text-muted)' : '#fff',
                  border: 'none',
                  fontSize: 12,
                  cursor: itemsPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← ก่อนหน้า
              </button>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 8px' }}>
                หน้า {activeItemsPage}/{totalItemsPages}
              </span>
              <button
                onClick={() => setItemsPage(Math.min(totalItemsPages, itemsPage + 1))}
                disabled={itemsPage === totalItemsPages}
                style={{
                  padding: '6px 10px',
                  borderRadius: 4,
                  background: itemsPage === totalItemsPages ? 'var(--bg-hover)' : 'var(--accent-blue)',
                  color: itemsPage === totalItemsPages ? 'var(--text-muted)' : '#fff',
                  border: 'none',
                  fontSize: 12,
                  cursor: itemsPage === totalItemsPages ? 'not-allowed' : 'pointer'
                }}
              >
                ถัดไป →
              </button>
            </div>
          )}

          {requestItems.length === 0 && (
            <div style={{
              padding: 40,
              textAlign: 'center',
              color: 'var(--text-muted)',
              background: 'var(--bg-hover)',
              borderRadius: 8,
              border: '1px dashed var(--border-color)'
            }}>
              ยังไม่มีรายการอุปกรณ์ <br /> คลิก &quot;เพิ่มรายการ&quot; เพื่อเริ่มต้น
            </div>
          )}
        </div>

        {/* ปุ่มบันทึก */}
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
            บันทึกคำขอ
          </button>
        </div>
      </div>
    </>
  );
}
