import { useApi } from '../../api/hooks';
import Button from '../ui/Button';
import ListingGrid from '../ui/ListingGrid';
import StayCard from '../stays/StayCard';
import Section from './Section';

export default function FeaturedStays() {
  const { data, isLoading } = useApi('stays-featured', '/stays', { featured: true, limit: 4, sort: 'ratingAvg', order: 'desc' }, { staleTime: 60_000 });
  return (
    <Section id="stays" tone="muted" title="Top-rated stays" subtitle="Highly rated places to stay, hand-picked by our team."
      action={<Button to="/explore" variant="outline">See all stays</Button>}>
      <ListingGrid loading={isLoading} items={data?.items ?? []} render={(s) => <StayCard stay={s} />} />
    </Section>
  );
}
