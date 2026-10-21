import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi, useDestinations, useTableApi } from '../api/hooks';
import useDebounce from '../hooks/useDebounce';
import useTitle from '../hooks/useTitle';
import { formatDate, nightsBetween, plural } from '../lib/format';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import { CardSkeleton } from '../components/ui/Skeleton';
import StayCard from '../components/stays/StayCard';

const SORTS = {
  newest: { label: 'Newest', sort: 'createdAt', order: 'desc' },
  price_asc: { label: 'Price: low to high', sort: 'pricePerNight', order: 'asc' },
  price_desc: { label: 'Price: high to low', sort: 'pricePerNight', order: 'desc' },
  rating: { label: 'Top rated', sort: 'ratingAvg', order: 'desc' },
};

// Bounding box for the embedded map: Bangladesh by default, or a small window around the chosen destination.
const BANGLADESH = [88.0, 20.5, 92.8, 26.7];
const mapUrl = (dest) => {
  const box = dest ? [dest.lng - 0.15, dest.lat - 0.12, dest.lng + 0.15, dest.lat + 0.12] : BANGLADESH;
  const marker = dest ? `&marker=${dest.lat}%2C${dest.lng}` : '';
  return `https://www.openstreetmap.org/export/embed.html?bbox=${box.join('%2C')}&layer=mapnik${marker}`;
};

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const get = (key) => params.get(key) ?? '';
  const [search, setSearch] = useState(get('q'));
  const debounced = useDebounce(search);

  const update = (changes, keepPage = false) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value === '' || value == null ? next.delete(key) : next.set(key, value)));
    if (!keepPage) next.delete('page');
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (debounced !== get('q')) update({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const sortKey = SORTS[get('sort')] ? get('sort') : 'newest';
  const page = Math.max(parseInt(get('page'), 10) || 1, 1);
  const query = {
    q: get('q'), destination: get('destination'), category: get('category'), maxPrice: get('maxPrice'),
    minRating: get('minRating'), guests: get('guests'), sort: SORTS[sortKey].sort, order: SORTS[sortKey].order, page, limit: 6,
  };

  const { data, isLoading, isFetching, error } = useTableApi('stays', '/stays', query);
  const { data: dests } = useDestinations();
  const { data: cats } = useApi('categories', '/destinations/categories', null, { staleTime: 5 * 60_000 });

  const destination = dests?.items.find((d) => d.slug === get('destination'));
  const from = get('from');
  const to = get('to');
  const nights = nightsBetween(from, to);
  const guests = get('guests');
  useTitle(destination ? `Stay in ${destination.name}` : 'Explore stays');

  // Dates, guests and origin travel with the user from the booking form to the stay page.
  const carry = new URLSearchParams(['from', 'to', 'guests', 'origin'].filter((k) => get(k)).map((k) => [k, get(k)])).toString();
  const items = data?.items ?? [];
  const activeFilters = ['q', 'destination', 'category', 'maxPrice', 'minRating', 'guests', 'sort'].some((k) => get(k));

  return (
    <div className="container-page py-8">
      <p className="text-sm text-mute">
        {data ? plural(data.total, 'stay') : 'Loading stays'}
        {from && to && ` ${formatDate(from, { day: 'numeric', month: 'short' })} - ${formatDate(to, { day: 'numeric', month: 'short' })}`}
        {guests && ` ${plural(Number(guests), 'guest')}`}
      </p>
      <h1 className="h-page mb-5">{destination ? `Stay in ${destination.name}` : 'Explore stays'}</h1>

      <Card className="mb-6 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="Search" type="search" placeholder="Title or place" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:col-span-2 lg:col-span-2" />
        <Input as="select" label="Destination" value={get('destination')} onChange={(e) => update({ destination: e.target.value })}>
          <option value="">All destinations</option>
          {(dests?.items ?? []).map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
        </Input>
        <Input as="select" label="Type of trip" value={get('category')} onChange={(e) => update({ category: e.target.value })}>
          <option value="">All types</option>
          {(cats?.items ?? []).map((c) => <option key={c.category} value={c.category}>{c.category}</option>)}
        </Input>
        <Input label="Max price per night ($)" type="number" min="0" inputMode="numeric" value={get('maxPrice')} onChange={(e) => update({ maxPrice: e.target.value })} />
        <Input as="select" label="Minimum rating" value={get('minRating')} onChange={(e) => update({ minRating: e.target.value })}>
          <option value="">Any rating</option>
          {[4.5, 4, 3].map((r) => <option key={r} value={r}>{r}+ stars</option>)}
        </Input>
        <Input label="Guests" type="number" min="1" max="20" inputMode="numeric" value={get('guests')} onChange={(e) => update({ guests: e.target.value })} />
        <Input as="select" label="Sort by" value={sortKey} onChange={(e) => update({ sort: e.target.value })}>
          {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
        </Input>
        {activeFilters && (
          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <Button variant="ghost" onClick={() => { setSearch(''); setParams(new URLSearchParams(carry)); }}>Clear filters</Button>
          </div>
        )}
      </Card>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div aria-live="polite" className={isFetching && !isLoading ? 'opacity-70 transition' : 'transition'}>
          {error && <EmptyState title="Stays could not be loaded">Check your connection and refresh the page.</EmptyState>}
          {isLoading && <div className="space-y-4">{[0, 1, 2].map((i) => <CardSkeleton key={i} />)}</div>}
          {!isLoading && !error && items.length === 0 && (
            <EmptyState title="No stays match these filters" action={<Button variant="outline" onClick={() => { setSearch(''); setParams(new URLSearchParams(carry)); }}>Clear filters</Button>}>
              Try a higher price limit, fewer guests or a different destination.
            </EmptyState>
          )}
          <div className="space-y-4">
            {items.map((stay) => <StayCard key={stay._id} stay={stay} variant="row" search={carry} nights={nights} />)}
          </div>
          <Pagination className="mt-8" page={data?.page ?? 1} pages={data?.pages ?? 1} onChange={(p) => { update({ page: p }, true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>

        <div className="hidden lg:block">
          <iframe title={destination ? `Map of ${destination.name}` : 'Map of Bangladesh'} src={mapUrl(destination)} loading="lazy" className="sticky top-28 h-[70vh] w-full rounded-xl border border-line" />
        </div>
      </div>
    </div>
  );
}
