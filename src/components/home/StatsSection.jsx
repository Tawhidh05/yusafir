import { useApi } from '../../api/hooks';
import { Skeleton } from '../ui/Skeleton';
import Section from './Section';

export default function StatsSection() {
  const { data, isLoading } = useApi('stats-public', '/stats/public', null, { staleTime: 60_000 });
  const stats = [
    { label: 'Destinations', value: data?.destinations },
    { label: 'Stays to book', value: data?.stays },
    { label: 'Travellers', value: data?.users },
    { label: 'Bookings made', value: data?.bookings },
  ];

  return (
    <Section id="stats" title="Yusafir in numbers" subtitle="Live figures from our platform.">
      <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-l-4 border-brand pl-4">
            <dd className="font-display text-5xl leading-none">{isLoading ? <Skeleton className="h-12 w-20" /> : (s.value ?? 0).toLocaleString()}</dd>
            <dt className="mt-1 text-sm text-mute">{s.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
