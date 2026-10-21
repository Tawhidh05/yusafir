import { useState } from 'react';
import { useTableApi } from '../api/hooks';
import useTitle from '../hooks/useTitle';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { CardSkeleton } from '../components/ui/Skeleton';
import PostCard from '../components/PostCard';

const copy = {
  news: { title: 'News', text: 'Updates about new destinations, stays and features on Yusafir.' },
  guide: { title: 'Blog', text: 'Travel guides to the destinations you can book on Yusafir.' },
};

/** Shared by /news (platform updates) and /blog (travel guides). */
export default function Posts({ category }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useTableApi('posts', '/posts', { category, page, limit: 6 });
  useTitle(copy[category].title);

  return (
    <div className="container-page py-10">
      <h1 className="h-page">{copy[category].title}</h1>
      <p className="mb-8 mt-1 text-mute">{copy[category].text}</p>
      {error && <EmptyState title="Articles could not be loaded">Refresh the page to try again.</EmptyState>}
      {data?.items.length === 0 && <EmptyState title="Nothing published yet">Check back soon.</EmptyState>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />) : data?.items.map((p) => <PostCard key={p._id} post={p} />)}
      </div>
      <Pagination className="mt-10" page={data?.page ?? 1} pages={data?.pages ?? 1} onChange={setPage} />
    </div>
  );
}
