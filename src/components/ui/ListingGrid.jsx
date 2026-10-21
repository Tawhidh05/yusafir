import { CardSkeleton } from './Skeleton';

/** Responsive grid: 1 / 2 / 4 columns. Shows skeleton cards while data loads. */
export default function ListingGrid({ loading, items, render, skeletons = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {loading ? Array.from({ length: skeletons }, (_, i) => <CardSkeleton key={i} />) : items.map((item) => <div key={item._id} className="min-w-0">{render(item)}</div>)}
    </div>
  );
}
