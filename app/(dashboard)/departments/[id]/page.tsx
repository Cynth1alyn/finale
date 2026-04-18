'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';
import { Department } from '@/app/lib/types';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { departments, users, updateDepartment, deleteDepartment } = useAppContext();
  const [deptId, setDeptId] = useState<string>('');

  useEffect(() => {
    params.then(p => setDeptId(p.id));
  }, [params]);

  const dept = departments.find(d => d.dept_id === deptId);
  const deptUsers = users.filter(u => u.dept_id === deptId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({});

  useEffect(() => {
    if (dept) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(dept);
    }
  }, [dept]);

  if (!dept) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        ไม่พบแผนก #{deptId}
        <br />
        <Link href="/departments" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          ← กลับ
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    if (!formData.dept_name) return alert('กรุณาระบุชื่อแผนก');
    updateDepartment(formData as Department);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`คุณต้องการลบแผนก "${dept.dept_name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้`)) {
      deleteDepartment(deptId);
      router.push('/departments');
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/departments" className="btn btn-ghost btn-sm">← กลับ</Link>
          <div>
            <div className="page-title">{dept.dept_name}</div>
            <div className="page-subtitle">รหัสแผนก: {dept.dept_id}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Info Card */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ข้อมูลแผนก
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>ชื่อแผนก</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.dept_name || ''}
                    onChange={e => setFormData({...formData, dept_name: e.target.value})}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>คำอธิบาย</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 13 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(dept);
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
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>ชื่อแผนก</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{formData.dept_name}</div>
                </div>
                {formData.description && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>คำอธิบาย</div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{formData.description}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Users in Department */}
          <div className="card" style={{ padding: '22px 24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              สมาชิกแผนก ({deptUsers.length})
            </h3>
            {deptUsers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {deptUsers.slice(0, 5).map(user => (
                  <div key={user.user_id} style={{
                    padding: '10px 12px',
                    background: 'var(--bg-hover)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: user.avatar_color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                        {user.firstname} {user.lastname}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--border-color)', padding: '4px 8px', borderRadius: 4 }}>
                      {user.role}
                    </div>
                  </div>
                ))}
                {deptUsers.length > 5 && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 8 }}>
                    และอีก {deptUsers.length - 5} คน
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                ไม่มีสมาชิกในแผนกนี้
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>รหัสแผนก</div>
            <div style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-blue-light)' }}>{dept.dept_id}</div>
          </div>

          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>สมาชิก</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-emerald)' }}>{deptUsers.length}</div>
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
            <Trash2 size={16} /> ลบแผนก
          </button>
        </div>
      </div>
    </>
  );
}
