'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch — only render after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a fixed-size placeholder to prevent layout shift
    return <div style={{ width: 38, height: 38 }} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'เปลี่ยนเป็น Light Mode' : 'เปลี่ยนเป็น Dark Mode'}
      style={{
        width: 38,
        height: 38,
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'background 0.15s, color 0.15s, transform 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--border-light)';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      {isDark ? (
        <Moon size={17} strokeWidth={2} />
      ) : (
        <Sun size={17} strokeWidth={2} />
      )}
    </button>
  );
}
