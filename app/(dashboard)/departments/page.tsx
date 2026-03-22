import { departments, getUsersInDept } from '@/app/lib/mock-data';

const deptColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E'];
const roleLabels: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ', manager: 'ผู้จัดการ', technician: 'ช่างเทคนิค', staff: 'พนักงาน',
};
const avatarColors = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#EC4899','#14B8A6','#F97316','#A855F7'];

export default function DepartmentsPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">แผนก</div>
          <div className="page-subtitle">ทั้งหมด {departments.length} แผนก</div>
        </div>
        <button className="btn btn-primary">+ เพิ่มแผนก</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {departments.map((dept, di) => {
          const members = getUsersInDept(dept.dept_id);
          const color = deptColors[di % deptColors.length];
          return (
            <div key={dept.dept_id} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '18px 20px', background: `${color}12`, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: `${color}25`, border: `1px solid ${color}40`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  🏢
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{dept.dept_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>รหัส: {dept.dept_id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: color }}>{members.length}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>สมาชิก</div>
                </div>
              </div>

              {/* Members */}
              <div style={{ padding: '14px 20px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>สมาชิก</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {members.map((u, i) => (
                    <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: avatarColors[i % avatarColors.length] }}>
                        {u.firstname[0]}{u.lastname[0]}
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
            </div>
          );
        })}
      </div>
    </>
  );
}
