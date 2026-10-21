export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-xl bg-subtle ${className}`} aria-hidden="true" />;

/** Placeholder with the same structure as a listing card, so layout does not jump on load. */
export const CardSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line" aria-hidden="true">
    <Skeleton className="aspect-[4/3] rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-11 w-full" />
    </div>
  </div>
);
