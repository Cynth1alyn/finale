'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/app/lib/api';
import { Issue, User, IssueStatus } from '@/app/lib/types';
import StatusBadge from '@/app/components/StatusBadge';

const allStatuses = [IssueStatus.OPEN, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED, IssueStatus.CLOSED] as const;

export default function IssueDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { id } = params;
  const [issue, setIssue] = useState<Issue | null>(null);
  const [reporter, setReporter] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchIssue() {
      try {
        const fetchedIssue = await api.issues.getIssue(id);
        if (cancelled) return;
        setIssue(fetchedIssue);

        if (fetchedIssue.reporter_id) {
          try {
            const user = await api.users.getUser(fetchedIssue.reporter_id);
            if (!cancelled) setReporter(user);
          } catch (error) {
            console.warn('Reporter not found:', error);
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchIssue();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (notFound || !issue) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        ไม่พบรายการ #{id}
        <br /><Link href="/issues" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>← กลับ</Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/issues" className="btn btn-ghost btn-sm">← กลับ</Link>
          <div>
            <div className="page-title">{issue.topic}</div>
            <div className="page-subtitle">รหัส: {issue.issue_id} · แจ้งเมื่อ {issue.report_date}</div>
          </div>
        </div>
        <StatusBadge status={issue.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>รายละเอียดปัญหา</h3>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.8 }}>{issue.detail}</p>
          </div>

          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>วิธีแก้ไข</h3>
            {issue.solution ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent-emerald)', fontSize: 18, marginTop: 2 }}>✓</span>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.8 }}>{issue.solution}</p>
              </div>
            ) : (
              <div style={{ padding: '16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, fontSize: 13, color: 'var(--accent-amber)' }}>
                ⏳ ยังไม่ได้รับการแก้ไข — กำลังดำเนินการ
              </div>
            )}
          </div>

          <IssueStatusUpdater currentStatus={issue.status} />
        </div>

        <div className="card" style={{ padding: '20px 22px', alignSelf: 'start' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ข้อมูล</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'รหัส',       value: issue.issue_id },
              { label: 'หัวข้อ',     value: issue.topic },
              { label: 'วันที่แจ้ง', value: issue.report_date },
              { label: 'สถานะ',     value: <StatusBadge status={issue.status} /> },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize: 13 }}>{r.value}</span>
              </div>
            ))}
            {reporter && (
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>ผู้แจ้ง</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', fontSize: 13 }}>
                    {reporter.firstname[0]}{reporter.lastname[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{reporter.firstname} {reporter.lastname}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{reporter.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function IssueStatusUpdater({ currentStatus }: { currentStatus: string }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>อัปเดตสถานะ</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {allStatuses.map(s => (
          <button key={s}
            className={`btn btn-sm ${currentStatus === s ? 'btn-primary' : 'btn-ghost'}`}
          ><StatusBadge status={s} /></button>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="input-group">
          <label className="input-label">หมายเหตุการอัปเดต</label>
          <textarea className="input" rows={3} placeholder="บันทึกการอัปเดต..." style={{ resize: 'vertical' }} />
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }}>บันทึก</button>
      </div>
    </div>
  );
}
