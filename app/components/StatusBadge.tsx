type StatusType = 'pending' | 'in-progress' | 'done' | 'cancelled' | 'open' | 'resolved' | 'closed' | 'approved' | 'rejected' | 'fulfilled';

const statusConfig: Record<StatusType, { label: string; className: string; dot: string }> = {
  pending:     { label: 'รอดำเนินการ', className: 'badge badge-amber',   dot: '#F59E0B' },
  'in-progress':{ label: 'กำลังดำเนินการ', className: 'badge badge-blue',    dot: '#3B82F6' },
  done:        { label: 'เสร็จสิ้น',   className: 'badge badge-emerald', dot: '#10B981' },
  cancelled:   { label: 'ยกเลิก',       className: 'badge badge-slate',  dot: '#64748B' },
  open:        { label: 'เปิด',         className: 'badge badge-rose',   dot: '#F43F5E' },
  resolved:    { label: 'แก้ไขแล้ว',   className: 'badge badge-emerald', dot: '#10B981' },
  closed:      { label: 'ปิด',          className: 'badge badge-slate',  dot: '#64748B' },
  approved:    { label: 'อนุมัติ',      className: 'badge badge-emerald', dot: '#10B981' },
  rejected:    { label: 'ปฏิเสธ',       className: 'badge badge-rose',   dot: '#F43F5E' },
  fulfilled:   { label: 'จัดส่งแล้ว',  className: 'badge badge-cyan',   dot: '#06B6D4' },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status as StatusType] ?? { label: status, className: 'badge badge-slate', dot: '#64748B' };
  return (
    <span className={cfg.className}>
      <span style={{ width: 6, height: 6, background: cfg.dot, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}
