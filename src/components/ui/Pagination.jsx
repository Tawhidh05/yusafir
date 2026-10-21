import Button from './Button';
import Icon from './Icon';

/** Compact pager: previous, a window of page numbers around the current page, next. */
export default function Pagination({ page, pages, onChange, className = '' }) {
  if (pages <= 1) return null;
  const start = Math.max(1, Math.min(page - 1, pages - 2));
  const numbers = Array.from({ length: Math.min(3, pages) }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-2 ${className}`}>
      <Button variant="outline" size="sm" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <Icon name="chevronLeft" className="size-4" />
      </Button>
      {numbers.map((n) => (
        <Button key={n} variant={n === page ? 'primary' : 'outline'} size="sm" onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} className="min-w-9">
          {n}
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">
        <Icon name="chevronRight" className="size-4" />
      </Button>
    </nav>
  );
}
