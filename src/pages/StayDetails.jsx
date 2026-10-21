import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useApi } from '../api/hooks';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import useTitle from '../hooks/useTitle';
import { formatDate, money, nightsBetween, plural, todayISO } from '../lib/format';
import { compact, requiredError } from '../lib/validators';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Icon from '../components/ui/Icon';
import Input from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import StarRating from '../components/stays/StarRating';
import StayCard from '../components/stays/StayCard';
import ListingGrid from '../components/ui/ListingGrid';

function Gallery({ images, title }) {
  const [active, setActive] = useState(0);
  const step = (dir) => setActive((i) => (i + dir + images.length) % images.length);
  return (
    <div>
      <div className="relative overflow-hidden rounded-xl">
        <img src={images[active]} alt={`${title}, photo ${active + 1} of ${images.length}`} className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl bg-white text-black hover:bg-brand"><Icon name="chevronLeft" /></button>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl bg-white text-black hover:bg-brand"><Icon name="chevronRight" /></button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button type="button" onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === active} className={`block w-full overflow-hidden rounded-xl ring-2 ${i === active ? 'ring-brand' : 'ring-transparent'}`}>
                <img src={src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BookingWidget({ stay }) {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const validate = ({ checkIn, checkOut, guests }) => compact({
    checkIn: !checkIn ? 'Choose a check-in date' : checkIn < todayISO() ? 'Check-in cannot be in the past' : '',
    checkOut: !checkOut ? 'Choose a check-out date' : checkOut <= checkIn ? 'Check-out must be after check-in' : '',
    guests: !guests || guests < 1 ? 'At least 1 guest' : guests > stay.guests ? `This stay fits up to ${stay.guests} guests` : '',
  });

  const form = useForm({ checkIn: params.get('from') || '', checkOut: params.get('to') || '', guests: Math.min(Number(params.get('guests')) || 1, stay.guests) }, validate);
  const nights = nightsBetween(form.values.checkIn, form.values.checkOut);

  const book = useMutation({ mutationFn: (payload) => api.post('/bookings', payload) });
  const onSubmit = form.submit(async (v) => {
    await book.mutateAsync({ stayId: stay._id, checkIn: v.checkIn, checkOut: v.checkOut, guests: Number(v.guests), origin: params.get('origin') || '' });
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    queryClient.invalidateQueries({ queryKey: ['stats-dashboard'] });
    navigate('/dashboard/bookings', { state: { booked: stay.title } });
  });

  return (
    <Card as="form" onSubmit={onSubmit} noValidate className="space-y-4 p-5 lg:sticky lg:top-28">
      <p className="text-2xl font-bold">{money(stay.pricePerNight)}<span className="text-base font-normal text-mute"> / night</span></p>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Check-in" type="date" min={todayISO()} {...form.field('checkIn')} />
        <Input label="Check-out" type="date" min={form.values.checkIn || todayISO()} {...form.field('checkOut')} />
      </div>
      <Input label="Guests" type="number" min="1" max={stay.guests} inputMode="numeric" hint={`Up to ${stay.guests}`} {...form.field('guests')} />
      {nights > 0 && (
        <p className="flex justify-between border-t border-line pt-3 text-sm">
          <span>{money(stay.pricePerNight)} x {plural(nights, 'night')}</span>
          <span className="font-semibold">{money(nights * stay.pricePerNight)}</span>
        </p>
      )}
      <Alert>{form.formError}</Alert>
      {user ? (
        <Button type="submit" size="lg" className="w-full" loading={form.loading}>Book now</Button>
      ) : (
        <Button to="/login" state={{ from: location.pathname + location.search }} size="lg" className="w-full">Log in to book</Button>
      )}
    </Card>
  );
}

function Reviews({ stayId }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useApi('reviews', `/stays/${stayId}/reviews`);
  const form = useForm({ rating: '5', comment: '' }, (v) => compact({ comment: requiredError(v.comment, 'Review', 10) }));
  const onSubmit = form.submit(async ({ rating, comment }) => {
    await api.post(`/stays/${stayId}/reviews`, { rating: Number(rating), comment });
    form.setValues({ rating: '5', comment: '' });
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
    queryClient.invalidateQueries({ queryKey: ['stay'] });
  });

  return (
    <section aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="mb-4 text-xl font-bold">Reviews</h2>
      {isLoading && <Skeleton className="h-24" />}
      {data?.items.length === 0 && <EmptyState title="No reviews yet">Be the first to share how your stay went.</EmptyState>}
      <ul className="space-y-4">
        {data?.items.map((r) => (
          <li key={r._id} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{r.userName}</p>
              <StarRating value={r.rating} count={1} />
            </div>
            <p className="mt-2 text-sm text-mute">{r.comment}</p>
            <p className="mt-2 text-xs text-mute">{formatDate(r.createdAt)}</p>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 rounded-xl border border-line p-4">
          <h3 className="font-semibold">Write a review</h3>
          <Input as="select" label="Rating" {...form.field('rating')}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{plural(n, 'star')}</option>)}
          </Input>
          <Input as="textarea" label="Your review" placeholder="What did you like, and what could be better?" {...form.field('comment')} />
          <Alert>{form.formError}</Alert>
          <Button type="submit" loading={form.loading}>Post review</Button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-mute"><Link to="/login" className="font-semibold text-brand-text underline">Log in</Link> to write a review.</p>
      )}
    </section>
  );
}

export default function StayDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useApi('stay', `/stays/${id}`);
  const stay = data?.stay;
  useTitle(stay?.title ?? 'Stay');

  if (isLoading) return <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_22rem]"><Skeleton className="h-96" /><Skeleton className="h-72" /></div>;
  if (error || !stay) {
    return (
      <div className="container-page py-16">
        <EmptyState title="We could not find this stay" action={<Button to="/explore">Browse stays</Button>}>It may have been removed.</EmptyState>
      </div>
    );
  }

  const specs = [
    ['users', plural(stay.guests, 'guest')], ['building', plural(stay.bedrooms, 'bedroom')],
    ['ticket', plural(stay.beds, 'bed')], ['user', plural(stay.baths, 'bath')],
  ];

  return (
    <div className="container-page py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-mute">
        <Link to="/explore" className="hover:text-ink">Stays</Link> / <Link to={`/explore?destination=${stay.destination}`} className="hover:text-ink">{stay.location}</Link>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-10">
          <Gallery images={stay.images} title={stay.title} />
          <header>
            <h1 className="h-page">{stay.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mute">
              <span className="inline-flex items-center gap-1"><Icon name="pin" className="size-4" />{stay.location}</span>
              <StarRating value={stay.ratingAvg} count={stay.ratingCount} className="text-ink" />
              <Badge>{stay.category}</Badge>
            </div>
          </header>

          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="mb-3 text-xl font-bold">Overview</h2>
            <p className="max-w-3xl leading-relaxed text-mute">{stay.overview}</p>
          </section>

          <section aria-labelledby="specs-title">
            <h2 id="specs-title" className="mb-3 text-xl font-bold">Key information</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(([icon, label]) => (
                <li key={label} className="flex items-center gap-2 rounded-xl bg-subtle p-3 text-sm font-medium"><Icon name={icon} className="size-5 text-brand-text" />{label}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm"><span className="font-semibold">Amenities:</span> <span className="text-mute">{stay.amenities.join(', ')}</span></p>
            <p className="mt-1 text-sm"><span className="font-semibold">Cancellation:</span> <span className="text-mute">{stay.flexibleCancellation ? 'Flexible cancellation available' : 'Standard cancellation policy'}</span></p>
          </section>

          <Reviews stayId={stay._id} />
        </div>
        <aside aria-label="Book this stay"><BookingWidget stay={stay} /></aside>
      </div>

      {data.related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-5 text-xl font-bold">More stays in {stay.location}</h2>
          <ListingGrid items={data.related} render={(s) => <StayCard stay={s} />} />
        </section>
      )}
    </div>
  );
}
