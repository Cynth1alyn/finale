'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('กรุณากรอกอีเมลและรหัสผ่าน'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.10) 0%, transparent 60%), var(--bg-primary)',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Back Button */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <Link href="/" className="btn btn-ghost" style={{ borderRadius: '99px', padding: '8px 16px', gap: 6 }}>
          <ArrowLeft size={16} /> กลับหน้าหลัก
        </Link>
      </div>

      {/* Theme Toggle */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <ThemeToggle />
      </div>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage:
          'linear-gradient(var(--grid-pattern) 1px,transparent 1px),linear-gradient(90deg,var(--grid-pattern) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* Glowing orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, background: 'rgba(59,130,246,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 250, height: 250, background: 'rgba(139,92,246,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div className="animate-scale-in" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#fff',
            margin: '0 auto 14px',
            boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
          }}>T</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>TechJob</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>ระบบจัดการงาน IT — เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        {/* Card */}
        <div className="card" style={{ borderRadius: 20, padding: '32px 28px', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24, textAlign: 'center' }}>เข้าสู่ระบบ</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="input-group">
              <label className="input-label">อีเมล</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Mail size={15} /></span>
                <input
                  className="input"
                  type="email"
                  placeholder="example@techjob.th"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">รหัสผ่าน</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={15} /></span>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#FB7185', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ marginTop: 4, width: '100%', boxShadow: '0 4px 16px rgba(59,130,246,0.35)', position: 'relative', overflow: 'hidden' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : 'เข้าสู่ระบบ →'}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--accent-blue-light)', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Lightbulb size={12} /> Demo</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>กรอกอีเมลและรหัสผ่านใดก็ได้เพื่อเข้าสู่ระบบ</div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
          © 2026 TechJob IT Management System
        </p>
      </div>
    </div>
  );
}
