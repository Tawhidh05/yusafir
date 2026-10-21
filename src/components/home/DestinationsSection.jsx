import { useDestinations } from '../../api/hooks';
import Button from '../ui/Button';
import ListingGrid from '../ui/ListingGrid';
import DestinationCard from '../stays/DestinationCard';
import Section from './Section';

export default function DestinationsSection() {
  const { data, isLoading } = useDestinations({ limit: 4 });
  return (
    <Section id="destinations" tone="muted" title="Featured destinations" subtitle="Beaches, tea gardens, mangroves and hills across Bangladesh."
      action={<Button to="/explore" variant="outline">Explore all stays</Button>}>
      <ListingGrid loading={isLoading} items={data?.items ?? []} render={(d) => <DestinationCard destination={d} />} />
    </Section>
  );
}