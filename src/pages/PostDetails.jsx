import { Link, useParams } from 'react-router-dom';
import { useApi } from '../api/hooks';
import useTitle from '../hooks/useTitle';
import { formatDate } from '../lib/format';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';

export default function PostDetails() {
  const { slug } = useParams();
  const { data, isLoading, error } = useApi('post', `/posts/${slug}`);
  const post = data?.post;
  useTitle(post?.title ?? 'Article');

  if (isLoading) return <div className="container-page max-w-3xl space-y-4 py-10"><Skeleton className="h-10" /><Skeleton className="h-64" /></div>;
  if (error || !post) return <div className="container-page py-16"><EmptyState title="Article not found" action={<Button to="/blog">Back to the blog</Button>} /></div>;

  return (
    <article className="container-page max-w-3xl py-10">
      <Link to={post.category === 'news' ? '/news' : '/blog'} className="text-sm text-mute hover:text-ink">&larr; Back</Link>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-mute">
        <Badge variant={post.category === 'news' ? 'brand' : 'neutral'}>{post.category === 'news' ? 'News' : 'Travel guide'}</Badge>
        <span>{formatDate(post.publishedAt)}</span><span>{post.readMinutes} min read</span><span>{post.author}</span>
      </div>
      <h1 className="h-page mt-3 sm:text-4xl">{post.title}</h1>
      <img src={post.image} alt="" className="mt-6 aspect-[16/9] w-full rounded-xl object-cover" />
      <div className="mt-8 space-y-5 text-lg leading-relaxed">
        {post.content.split('\n\n').map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
      </div>
    </article>
  );
}
