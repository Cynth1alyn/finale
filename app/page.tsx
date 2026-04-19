'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap, Package, AlertTriangle } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif' // assuming Inter from previous context
    }}>
      {/* Navbar */}
      <nav style={{
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#fff',
            boxShadow: '0 8px 16px rgba(59,130,246,0.3)',
          }}>T</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            TechJob
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost">เข้าสู่ระบบ</Link>
          <Link href="/home" className="btn btn-primary" style={{
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            border: 'none',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
          }}>แดชบอร์ด →</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Gradients */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0, pointerEvents: 'none'
        }} />

        <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 1, maxWidth: 800 }}>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: 24
          }}>
            จัดการงาน IT <br />
            <span style={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>ได้อย่างครบวงจร</span>
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 48,
            maxWidth: 600,
            marginInline: 'auto'
          }}>
            ระบบเดียวที่ตอบโจทย์ทุกขั้นตอนของฝ่าย IT ตั้งแต่แจ้งปัญหา, มอบหมายงาน, 
            เบิกอุปกรณ์, ไปจนถึงการจัดการอุปกรณ์และบุคลากร
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/home" className="btn btn-primary" style={{
              fontSize: 18,
              padding: '16px 32px',
              borderRadius: 30,
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              เริ่มต้นใช้งานฟรี
            </Link>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="animate-slide-up" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          width: '100%',
          maxWidth: 1000,
          marginTop: 80,
          zIndex: 1
        }}>
          {[
            { tag: 'Jobs', title: 'จัดการงานแบบเรียลไทม์', icon: <Zap size={32} /> },
            { tag: 'Assets', title: 'ควบคุมสต็อกอุปกรณ์แม่นยำ', icon: <Package size={32} /> },
            { tag: 'Issues', title: 'ติดตามการแจ้งปัญหาได้ทันที', icon: <AlertTriangle size={32} /> }
          ].map((feature, i) => (
            <div key={i} className="card" style={{
              padding: 32,
              cursor: 'default'
            }}
            >
              <div style={{ marginBottom: 16, color: 'var(--text-primary)' }}>{feature.icon}</div>
              <div style={{ fontSize: 13, color: 'var(--accent-blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{feature.tag}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{feature.title}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
