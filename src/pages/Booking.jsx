import { useNavigate, useParams } from 'react-router-dom';
import { useApi, useDestinations } from '../api/hooks';
import useForm from '../hooks/useForm';
import useTitle from '../hooks/useTitle';
import { todayISO } from '../lib/format';
import { compact, requiredError } from '../lib/validators';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Input from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';

function validate({ origin, from, to }) {
  return compact({
    origin: requiredError(origin, 'Origin', 2),
    from: !from ? 'Choose a start date' : from < todayISO() ? 'Start date cannot be in the past' : '',
    to: !to ? 'Choose an end date' : from && to <= from ? 'End date must be after the start date' : '',
  });
}

/** Booking screen from the design: destination story on the left, trip form on the right. */
export default function Booking() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useApi('destination', `/destinations/${slug}`);
  const { data: all } = useDestinations();
  const destination = data?.destination;
  useTitle(destination ? `Book ${destination.name}` : 'Booking');

  const form = useForm({ origin: '', from: '', to: '' }, validate);
  const onSubmit = form.submit(async ({ origin, from, to }) => {
    const params = new URLSearchParams({ destination: slug, from, to, origin: origin.trim() });
    navigate(`/explore?${params}`);
  });

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-black text-white">
      {destination && <img src={destination.heroImage} alt="" aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-black/55" />

      <div className="container-page grid items-center gap-10 py-28 lg:grid-cols-[1fr_28rem] lg:gap-16">
        <div>
          {isLoading && <Skeleton className="h-40 bg-white/20" />}
          {error && <p role="alert" className="text-lg">We could not find that destination. <a className="underline" href="/explore">Browse all stays</a>.</p>}
          {destination && (
            <>
              <h1 className="h-display">{destination.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">{destination.overview}</p>
            </>
          )}
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl bg-surface p-6 text-ink">
          <Input variant="filled" label="Origin" placeholder="Where are you travelling from?" autoComplete="address-level2" {...form.field('origin')} />
          <Input variant="filled" as="select" label="Destination" value={slug} onChange={(e) => navigate(`/booking/${e.target.value}`, { replace: true })}>
            {(all?.items ?? []).map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
          </Input>
          <div className="grid grid-cols-2 gap-4">
            <Input variant="filled" type="date" label="From" min={todayISO()} {...form.field('from')} />
            <Input variant="filled" type="date" label="To" min={form.values.from || todayISO()} {...form.field('to')} />
          </div>
          <Button type="submit" size="lg" className="w-full" loading={form.loading} disabled={!destination}>
            <Icon name="calendar" className="size-5" /> Start Booking
          </Button>
        </form>
      </div>
    </section>
  );
}
