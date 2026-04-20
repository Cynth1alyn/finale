'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/app/lib/AppContext';
import { RequestStatus } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';

export default function RequestDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { id } = params;
  const router = useRouter();

  const { requests, users, equipment: equipmentList, updateRequest } = useAppContext();
  const request = requests.find(r => r.req_id === id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (!request) return;
    const action = newStatus === RequestStatus.APPROVED ? 'อนุมัติ' : 'ปฏิเสธ';
    if (!confirm(`ยืนยันการ${action}คำขอนี้?`)) return;
    setIsSubmitting(true);
    try {
      await updateRequest({ ...request, req_status: newStatus });
      router.refresh();
    } catch (err) {
      console.error('Failed to update request status:', err);
      alert(`เกิดข้อผิดพลาดในการ${action}คำขอ`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        ไม่พบคำขอ #{id}
        <br /><Link href="/requests" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>← กลับ</Link>
      </div>
    );
  }

  const requester = request ? users.find(u => u.user_id === request.user_id) : null;
  const items = request.items ?? [];
  const isPending = request.req_status === RequestStatus.PENDING;

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/requests" className="btn btn-ghost btn-sm">← กลับ</Link>
          <div>
            <div className="page-title">คำขอ {request.req_id}</div>
            <div className="page-subtitle">วันที่ขอ: {request.req_date}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <StatusBadge status={request.req_status} />
          {isPending && (
            <>
              <button
                className="btn btn-primary btn-sm"
                disabled={isSubmitting}
                onClick={() => handleStatusChange(RequestStatus.APPROVED)}
              >
                {isSubmitting ? '...' : '✓ อนุมัติ'}
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={isSubmitting}
                onClick={() => handleStatusChange(RequestStatus.REJECTED)}
              >
                {isSubmitting ? '...' : '✕ ปฏิเสธ'}
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: 15 }}>รายการที่ขอ ({items.length} รายการ)</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่ออุปกรณ์</th>
                <th>ประเภท</th>
                <th>หน่วย</th>
                <th style={{ textAlign: 'right' }}>จำนวนที่ขอ</th>
                <th style={{ textAlign: 'right' }}>คงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const equip = equipmentList.find(e => e.equip_id === item.equip_id);
                const stockOk = equip && equip.remain_qty >= item.qty;
                return (
                  <tr key={item.item_id || `${item.equip_id}-${i}`}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{equip?.name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.equip_id}</div>
                    </td>
                    <td><span className="badge badge-slate">{equip?.type_category ?? '—'}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{equip?.unit_id ?? '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{item.qty}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: stockOk ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                        {equip?.remain_qty ?? '—'} {!stockOk && '⚠'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>ไม่มีรายการ</div>
          )}
        </div>

        {/* Side info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: '20px 22px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ข้อมูลคำขอ</h3>
            {[
              { label: 'รหัสคำขอ',  value: request.req_id },
              { label: 'วันที่ขอ',  value: request.req_date },
              { label: 'สถานะ',     value: <StatusBadge status={request.req_status} /> },
              { label: 'จำนวนรายการ', value: `${items.length} รายการ` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize: 13 }}>{r.value}</span>
              </div>
            ))}
          </div>

          {requester && (
            <div className="card" style={{ padding: '20px 22px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ผู้ขอ</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar avatar-md" style={{ background: requester.avatar_color, fontSize: 13 }}>
                  {requester.firstname[0]}{requester.lastname[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{requester.firstname} {requester.lastname}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{requester.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{requester.tel}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
