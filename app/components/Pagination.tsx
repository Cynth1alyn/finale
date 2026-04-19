import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
      <button 
        className="btn btn-ghost btn-sm" 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '4px 8px' }}
      >
        <ChevronLeft size={16} />
      </button>
      
      {pages.map(p => (
        <button
          key={p}
          className={`btn btn-sm ${currentPage === p ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onPageChange(p)}
          style={{ width: 32, padding: 0 }}
        >
          {p}
        </button>
      ))}

      <button 
        className="btn btn-ghost btn-sm" 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '4px 8px' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
