import { formatDate } from '../lib/format';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';

export default function PostCard({ post }) {
  return (
    <Card as="article" className="flex h-full flex-col overflow-hidden">
      <img src={post.image} alt="" loading="lazy" width="540" height="832" className="aspect-[4/3] w-full object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={post.category === 'news' ? 'brand' : 'neutral'}>{post.category === 'news' ? 'News' : 'Travel guide'}</Badge>
          <span className="text-xs text-mute">{formatDate(post.publishedAt)}</span>
        </div>
        <h3 className="line-clamp-2 min-h-12 font-semibold">{post.title}</h3>
        <p className="line-clamp-3 text-sm text-mute">{post.excerpt}</p>
        <Button to={`/blog/${post.slug}`} variant="outline" className="mt-auto w-full">View Details</Button>
      </div>
    </Card>
  );
}
