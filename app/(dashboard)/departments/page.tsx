'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

const deptColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E'];
const roleLabels: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ', manager: 'ผู้จัดการ', technician: 'ช่างเทคนิค', staff: 'พนักงาน',
};
const avatarColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#EC4899','#14B8A6','#F97316','#A855F7'];

import RoleGuard from '@/app/components/RoleGuard';

function DepartmentsPageContent() {
  const router = useRouter();
  const { departments, users, deleteDepartment } = useAppContext();

  const handleDelete = (id: string, memberCount: number) => {
    if (memberCount > 0) {
      alert('ไม่สามารถลบแผนกที่มีสมาชิกอยู่ได้ กรุณาย้ายสมาชิกออกก่อน');
      return;
    }
    if (confirm('คุณต้องการลบแผนกนี้ใช่หรือไม่?')) {
      deleteDepartment(id);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">แผนก</div>
          <div className="page-subtitle">ทั้งหมด {departments.length} แผนก</div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/departments/new')}>+ เพิ่มแผนก</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {departments.map((dept, di) => {
          const members = users.filter(u => u.dept_id === dept.dept_id);
          const color = deptColors[di % deptColors.length];
          return (
            <Link 
              key={dept.dept_id} 
              href={`/departments/${dept.dept_id}`}
              className="card animate-fade-in"
              style={{ padding: 0, overflow: 'hidden', position: 'relative', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '')}
            >
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4, zIndex: 2 }} onClick={e => e.preventDefault()}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ padding: '6px' }} 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/departments/${dept.dept_id}`);
                  }}
                  title="ดูรายละเอียด"
                />
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ padding: '6px', color: 'var(--accent-rose)' }} 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(dept.dept_id, members.length);
                  }}
                  title="ลบแผนก"
                >
                  ✕
                </button>
              </div>

              {/* Header */}
              <div style={{ padding: '18px 20px', background: `${color}12`, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12, paddingRight: 90 }}>
                <div style={{ width: 40, height: 40, background: `${color}25`, border: `1px solid ${color}40`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                  <Building2 size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{dept.dept_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>รหัส: {dept.dept_id}</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: color, lineHeight: 1 }}>{members.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>คน</div>
                </div>
              </div>

              {/* Members */}
              <div style={{ padding: '14px 20px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>สมาชิก</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {members.map((u, i) => (
                    <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: u.avatar_color || avatarColors[i % avatarColors.length] }}>
                        {u.firstname[0]}{(u.lastname || ' ')[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{u.firstname} {u.lastname}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{roleLabels[u.role]}</span>
                    </div>
                  ))}
                  {members.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>ยังไม่มีสมาชิก</div>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default function DepartmentsPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'manager']}>
      <DepartmentsPageContent />
    </RoleGuard>
  );
}
