import { Link } from 'react-router-dom';
import { useApi } from '../../api/hooks';
import { plural } from '../../lib/format';
import { Skeleton } from '../ui/Skeleton';
import Section from './Section';

export default function CategoriesSection() {
  const { data, isLoading } = useApi('categories', '/destinations/categories', null, { staleTime: 5 * 60_000 });
  return (
    <Section id="categories" title="Browse by type of trip" subtitle="Pick the landscape first, then choose where to stay.">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-40" />)
          : data.items.map((c) => (
              <Link key={c.category} to={`/explore?category=${encodeURIComponent(c.category)}`} className="group relative block h-40 overflow-hidden rounded-xl">
                <img src={c.image} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="block font-display text-3xl tracking-wide">{c.category}</span>
                  <span className="text-sm">{plural(c.stays, 'stay')}</span>
                </span>
              </Link>
            ))}
      </div>
    </Section>
  );
}
