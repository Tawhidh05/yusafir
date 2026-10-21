import { useApi } from '../../api/hooks';
import Button from '../ui/Button';
import { CardSkeleton } from '../ui/Skeleton';
import PostCard from '../PostCard';
import Section from './Section';

export default function BlogPreview() {
  const { data, isLoading } = useApi('posts-preview', '/posts', { limit: 3 }, { staleTime: 60_000 });
  return (
    <Section id="blog" tone="muted" title="From the blog" subtitle="Travel guides and platform news."
      action={<Button to="/blog" variant="outline">Read the blog</Button>}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {isLoading ? Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />) : data.items.map((p) => <PostCard key={p._id} post={p} />)}
      </div>
    </Section>
  );
}
