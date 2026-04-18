'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHref?: (row: T) => string;
  searchKeys?: string[];
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowHref,
  searchKeys = [],
  emptyMessage = 'ไม่พบข้อมูล',
}: DataTableProps<T>) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(row =>
        searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = String(a[sortKey] ?? '');
        const bv = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv, 'th') : bv.localeCompare(av, 'th');
      });
    }
    return rows;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  return (
    <div>
      {/* Toolbar */}
      {searchKeys.length > 0 && (
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="search-box" style={{ maxWidth: 320 }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex' }}><SearchIcon size={16} /></span>
            <input
              placeholder="ค้นหา..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={16} /></button>
            )}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} รายการ</span>
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key} 
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{ 
                    textAlign: col.align || 'left', 
                    width: col.width,
                    cursor: col.sortable !== false ? 'pointer' : 'default'
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span style={{ marginLeft: 4, opacity: 0.7 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
              {rowHref && <th style={{ width: 60 }}></th>}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowHref ? 1 : 0)} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : paged.map((row, i) => (
              <tr 
                key={i}
                onClick={e => {
                  // Prevent navigation if clicking inside an interactive element
                  if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
                  if (rowHref) router.push(rowHref(row));
                }}
                style={{ cursor: rowHref ? 'pointer' : 'default' }}
                className={rowHref ? 'hover-row' : ''}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                  </td>
                ))}
                {rowHref && (
                  <td>
                    <Link href={rowHref(row)} className="btn btn-ghost btn-sm">ดู →</Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            หน้า {page} / {totalPages} (ทั้งหมด {filtered.length} รายการ)
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← ก่อนหน้า</button>
            <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>ถัดไป →</button>
          </div>
        </div>
      )}
    </div>
  );
}
