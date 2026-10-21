import Icon from './Icon';
import { Skeleton } from './Skeleton';

/**
 * Presentational table. columns: { key, label, sortable, render(row), className }.
 * Wide tables scroll inside their own container so the page never overflows sideways.
 */
export default function Table({ columns, rows, sort, onSort, loading, actions }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-subtle text-mute">
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th key={col.key} scope="col" className={`px-4 py-3 font-semibold ${col.className || ''}`} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {col.sortable ? (
                    <button type="button" onClick={() => onSort(col.key)} className="inline-flex items-center gap-1 hover:text-ink">
                      {col.label}
                      {active && <Icon name={sort.dir === 'asc' ? 'chevronUp' : 'chevronDown'} className="size-4" />}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
            {actions && <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {loading
            ? Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-3">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            : rows.map((row) => (
                <tr key={row._id} className="hover:bg-subtle/60">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 align-middle ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1">{actions(row)}</div></td>}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
