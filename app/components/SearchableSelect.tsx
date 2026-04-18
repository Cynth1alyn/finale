'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;    // NEW: if true, option is shown greyed out and unclickable
  disabledReason?: string; // optional tooltip hint
}

interface Props {
  options: Option[];
  placeholder?: string;
  value?: string;
  onSelect: (value: string) => void;
  resetOnSelect?: boolean;
  disabled?: boolean;   // disable the whole component
}

export default function SearchableSelect({
  options,
  placeholder = 'ค้นหา...',
  value,
  onSelect,
  resetOnSelect = false,
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.value.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(o => o.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        className="input"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: '6px 12px', fontSize: 13, userSelect: 'none',
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch('');
          }
        }}
      >
        <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </div>

      {isOpen && !disabled && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 200,
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8,
          boxShadow: 'var(--shadow-card)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              autoFocus
              type="text"
              placeholder="พิมพ์เพื่อค้นหา..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 13, color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
              <div
                key={opt.value}
                title={opt.disabled ? (opt.disabledReason || 'ไม่สามารถเลือกได้') : undefined}
                style={{
                  padding: '8px 12px',
                  fontSize: 13,
                  cursor: opt.disabled ? 'not-allowed' : 'pointer',
                  color: opt.disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                  background: 'transparent',
                  opacity: opt.disabled ? 0.55 : 1,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => {
                  if (!opt.disabled) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
                onClick={() => {
                  if (opt.disabled) return;
                  onSelect(opt.value);
                  setIsOpen(false);
                  if (resetOnSelect) setSearch('');
                }}
              >
                {opt.label}
              </div>
            )) : (
              <div style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>ไม่พบข้อมูล</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
