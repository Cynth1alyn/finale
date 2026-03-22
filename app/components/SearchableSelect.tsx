'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  placeholder?: string;
  value?: string;
  onSelect: (value: string) => void;
  resetOnSelect?: boolean;
}

export default function SearchableSelect({ options, placeholder = "ค้นหา...", value, onSelect, resetOnSelect = false }: Props) {
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
    <div ref={containerRef} style={{ position: 'relative', width: '220px' }}>
      <div 
        className="input"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '6px 12px', fontSize: 13, userSelect: 'none' }}
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
      >
        <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} color="var(--text-muted)" />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 100,
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
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
              <div 
                key={opt.value}
                className="hover-bg"
                style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)' }}
                onClick={() => {
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
