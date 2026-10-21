import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Click-to-open menu. `items` are { label, to | onClick, icon }.
 * Closes on outside click, Escape, and after choosing an item.
 */
export default function Dropdown({ trigger, items, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const itemClass = 'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-subtle';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className="rounded-xl">
        {trigger}
      </button>
      {open && (
        <div role="menu" className={`absolute z-50 mt-2 min-w-48 rounded-xl border border-line bg-surface p-1 shadow-lg ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {items.map((item) =>
            item.to ? (
              <Link key={item.label} role="menuitem" to={item.to} className={itemClass} onClick={() => setOpen(false)}>
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <button key={item.label} type="button" role="menuitem" className={itemClass} onClick={() => { setOpen(false); item.onClick(); }}>
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
