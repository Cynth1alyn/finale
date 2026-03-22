type Priority = 'low' | 'medium' | 'high' | 'urgent';

const priorityConfig: Record<Priority, { label: string; className: string; dot: string }> = {
  low:    { label: 'ต่ำ',       className: 'badge badge-slate', dot: '#64748B' },
  medium: { label: 'ปานกลาง', className: 'badge badge-blue',   dot: '#3B82F6' },
  high:   { label: 'สูง',      className: 'badge badge-amber',  dot: '#F59E0B' },
  urgent: { label: 'เร่งด่วน', className: 'badge badge-rose',   dot: '#F43F5E' },
};

interface PriorityBadgeProps {
  priority: string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const cfg = priorityConfig[priority as Priority] ?? { label: priority, className: 'badge badge-slate', dot: '#64748B' };
  return (
    <span className={cfg.className}>
      <span style={{ width: 6, height: 6, background: cfg.dot, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}
