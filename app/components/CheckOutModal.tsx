'use client';

import React, { useState } from 'react';
import { User, Equipment } from '../lib/types';
import { X, User as UserIcon, Hash, FileText, Loader2 } from 'lucide-react';

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  users: User[];
  onCheckOut: (userId: string, qty: number, notes: string) => Promise<void>;
}

export default function CheckOutModal({ isOpen, onClose, equipment, users, onCheckOut }: CheckOutModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('กรุณาเลือกผู้รับ');
      return;
    }
    if (qty <= 0) {
      setError('กรุณาระบุจำนวนที่ถูกต้อง');
      return;
    }
    if (qty > equipment.remain_qty) {
      setError('สต็อกไม่เพียงพอ');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onCheckOut(selectedUserId, qty, notes);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'เกิดข้อผิดพลาดในการเบิก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
    }}>
      <div className="card animate-scale-in" style={{ width: '100%', maxWidth: 440, padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>เบิกอุปกรณ์: {equipment.name}</h3>
          <button onClick={onClose} className="btn-icon-ghost" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px dashed var(--border-color)' }}>
              คงเหลือในสต็อกขณะนี้: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{equipment.remain_qty} ชิ้น</span>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>ผู้รับอุปกรณ์</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><UserIcon size={16} /></span>
                <select 
                  className="input" 
                  style={{ paddingLeft: 38, width: '100%' }}
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  required
                >
                  <option value="">เลือกพนักงาน...</option>
                  {users.map(u => (
                    <option key={u.user_id} value={u.user_id}>{u.firstname} {u.lastname} ({u.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>จำนวนที่ต้องการเบิก</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Hash size={16} /></span>
                <input 
                  type="number" 
                  className="input" 
                  style={{ paddingLeft: 38, width: '100%' }}
                  min={1}
                  max={equipment.remain_qty}
                  value={qty}
                  onChange={e => setQty(parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label" style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>หมายเหตุ / โปรเจกต์</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '12px', color: 'var(--text-muted)' }}><FileText size={16} /></span>
                <textarea 
                  className="input" 
                  style={{ paddingLeft: 38, minHeight: 80, paddingTop: 10, width: '100%', resize: 'none' }}
                  placeholder="เช่น ห้องประชุมชั้น 3, เบิกให้ IT Support..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#FB7185', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>ยกเลิก</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'ยืนยันการเบิก →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
