import { useState } from 'react';
import { useTableApi } from '../../api/hooks';
import useDebounce from '../../hooks/useDebounce';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Icon from '../ui/Icon';
import Input from '../ui/Input';
import Pagination from '../ui/Pagination';
import Table from '../ui/Table';

/** Small icon button for table rows. */
export function RowAction({ icon, label, onClick, danger = false, ...props }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} {...props}
      className={`grid size-9 place-items-center rounded-xl transition hover:bg-subtle ${danger ? 'text-red-600 dark:text-red-400' : 'text-ink'}`}>
      <Icon name={icon} className="size-4" />
    </button>
  );
}

/**
 * Server-driven table: search, filters, sorting and pagination are sent to the API as query params.
 * filters: [{ name, label, options: [{ value, label }] }]
 */
export default function DataTable({ queryKey, endpoint, columns, filters = [], searchPlaceholder = 'Search', defaultSort = { key: 'createdAt', dir: 'desc' }, actions, emptyTitle = 'Nothing here yet', toolbar }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(defaultSort);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const q = useDebounce(search);

  const params = { page, limit: 8, q: q || undefined, sort: sort.key, order: sort.dir, ...filterValues };
  const { data, isLoading, error } = useTableApi(queryKey, endpoint, params);

  const onSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
    setPage(1);
  };

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <Input label="Search" type="search" placeholder={searchPlaceholder} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="min-w-48 flex-1" />
        {filters.map((f) => (
          <Input key={f.name} as="select" label={f.label} value={filterValues[f.name] ?? ''} className="min-w-36"
            onChange={(e) => { setFilterValues((v) => ({ ...v, [f.name]: e.target.value || undefined })); setPage(1); }}>
            <option value="">All</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Input>
        ))}
        {toolbar}
      </div>

      {error ? (
        <EmptyState title="Could not load data">Refresh the page to try again.</EmptyState>
      ) : !isLoading && data?.items.length === 0 ? (
        <EmptyState title={emptyTitle}>Try changing the search or filters.</EmptyState>
      ) : (
        <Table columns={columns} rows={data?.items ?? []} sort={sort} onSort={onSort} loading={isLoading} actions={actions} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mute">{data ? `${data.total} total` : ''}</p>
        <Pagination page={data?.page ?? 1} pages={data?.pages ?? 1} onChange={setPage} />
      </div>
    </Card>
  );
}
