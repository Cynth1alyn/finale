'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/lib/AppContext';
import MapComponent, { MarkerData } from '@/app/components/MapComponent';
import { Search, X } from 'lucide-react';

export default function MapDashboard() {
  const { jobs, issues } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [listPage, setListPage] = useState(1);
  const LIST_PER_PAGE = 5;

  const getJobColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'var(--accent-rose)';
      case 'high': return 'var(--accent-amber)';
      case 'low': return 'var(--text-muted)';
      default: return 'var(--accent-blue)';
    }
  };

  const getIssueColor = (status: string) => {
    switch(status) {
      case 'open': return 'var(--accent-rose)';
      case 'in-progress': return 'var(--accent-amber)';
      case 'resolved': return 'var(--accent-emerald)';
      default: return 'var(--text-muted)';
    }
  };

  const jobMarkers: MarkerData[] = jobs
    .filter(j => j.lat && j.lng && j.job_status !== 'cancelled')
    .map(j => ({
      id: j.job_id,
      lat: j.lat!,
      lng: j.lng!,
      title: `งาน: ${j.job_title}`,
      subtitle: j.description,
      color: getJobColor(j.job_priority),
      link: `/jobs/${j.job_id}`
    }));

  const issueMarkers: MarkerData[] = issues
    .filter(i => i.lat && i.lng && i.status !== 'closed')
    .map(i => ({
      id: i.issue_id,
      lat: i.lat!,
      lng: i.lng!,
      title: `ปัญหา: ${i.topic}`,
      subtitle: i.detail,
      color: getIssueColor(i.status),
      link: `/issues/${i.issue_id}`
    }));

  const allMarkers = [...jobMarkers, ...issueMarkers];

  const filteredMarkers = allMarkers.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (m.subtitle && m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalListPages = Math.max(1, Math.ceil(filteredMarkers.length / LIST_PER_PAGE));
  const activeListPage = Math.min(listPage, totalListPages);
  const pagedMarkers = filteredMarkers.slice((activeListPage - 1) * LIST_PER_PAGE, activeListPage * LIST_PER_PAGE);

  const handleSearch = (q: string) => { setSearchQuery(q); setListPage(1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="page-title">แผนที่แดชบอร์ด (ทั่วพื้นที่)</div>
          <div className="page-subtitle">ค้นหาและพิกัดงาน/ปัญหาทั้งหมดในระบบ</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'var(--bg-hover)', padding: '6px 12px', borderRadius: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-blue)' }} /> งานปกติ
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'var(--bg-hover)', padding: '6px 12px', borderRadius: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-rose)' }} /> เร่งด่วน / เปิดอยู่
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'var(--bg-hover)', padding: '6px 12px', borderRadius: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-amber)' }} /> กำลังดำเนินการ
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: 'var(--bg-hover)', padding: '6px 12px', borderRadius: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-emerald)' }} /> แก้ไขแล้ว
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
        {/* Search Panel */}
        <div className="card" style={{ width: 320, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
            <div className="search-box" style={{ width: '100%' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex' }}><Search size={16} /></span>
              <input 
                type="text" 
                placeholder="ค้นหางาน หรือ ปัญหา..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={16} /></button>
              )}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredMarkers.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>
                ไม่พบรายการที่ค้นหา
              </div>
            ) : (
              pagedMarkers.map(m => (
                <div 
                  key={m.id}
                  className="hover-bg"
                  onClick={() => setActiveMarkerId(m.id)}
                  style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid var(--border-color)', 
                    cursor: 'pointer',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: activeMarkerId === m.id ? 'var(--bg-hover)' : undefined
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: m.color, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.subtitle}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          {totalListPages > 1 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }} onClick={() => setListPage(p => Math.max(1, p - 1))} disabled={activeListPage === 1}>‹ ก่อน</button>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{activeListPage} / {totalListPages} ({filteredMarkers.length} รายการ)</span>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }} onClick={() => setListPage(p => Math.min(totalListPages, p + 1))} disabled={activeListPage === totalListPages}>ถัดไป ›</button>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="card" style={{ flex: 1, padding: 10 }}>
          {allMarkers.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              ยังไม่มีจุดที่ถูกปักหมุดบนแผนที่
            </div>
          ) : (
            <MapComponent 
              markers={allMarkers}
              readOnly={true}
              activeMarkerId={activeMarkerId}
              height="min(calc(100vh - 270px), 700px)"
            />
          )}
        </div>
      </div>
    </div>
  );
}
