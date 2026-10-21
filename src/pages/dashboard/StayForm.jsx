import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { useApi, useDestinations } from '../../api/hooks';
import useForm from '../../hooks/useForm';
import useTitle from '../../hooks/useTitle';
import { compact, requiredError } from '../../lib/validators';
import PageHeader from '../../components/dashboard/PageHeader';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';

const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);
const list = (text) => text.split(',').map((l) => l.trim()).filter(Boolean);
const urlOrPath = /^(https?:\/\/|\/)\S+$/;

const numberError = (value, label, min, max) => {
  const n = Number(value);
  if (value === '' || Number.isNaN(n)) return `${label} is required`;
  if (n < min || n > max) return `${label} must be between ${min} and ${max}`;
  return '';
};

function validate(v) {
  const images = lines(v.images);
  return compact({
    title: requiredError(v.title, 'Title', 5),
    destination: v.destination ? '' : 'Choose a destination',
    description: requiredError(v.description, 'Short description', 20),
    overview: requiredError(v.overview, 'Overview', 40),
    pricePerNight: numberError(v.pricePerNight, 'Price per night', 1, 10000),
    guests: numberError(v.guests, 'Guests', 1, 20),
    bedrooms: numberError(v.bedrooms, 'Bedrooms', 0, 20),
    beds: numberError(v.beds, 'Beds', 1, 30),
    baths: numberError(v.baths, 'Baths', 1, 20),
    amenities: list(v.amenities).length ? '' : 'Add at least one amenity',
    images: !images.length ? 'Add at least one image' : images.every((i) => urlOrPath.test(i)) ? '' : 'Each image must be a link or a path starting with /',
  });
}

function Form({ initial, id }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: dests } = useDestinations({ limit: 50 });
  const form = useForm(initial, validate);

  const onSubmit = form.submit(async (v) => {
    const payload = {
      ...v,
      pricePerNight: Number(v.pricePerNight), guests: Number(v.guests), bedrooms: Number(v.bedrooms), beds: Number(v.beds), baths: Number(v.baths),
      amenities: list(v.amenities), images: lines(v.images),
    };
    await (id ? api.put(`/stays/${id}`, payload) : api.post('/stays', payload));
    ['stays', 'stay', 'categories', 'stats-dashboard'].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    navigate('/dashboard/stays');
  });

  return (
    <Card as="form" onSubmit={onSubmit} noValidate className="max-w-3xl space-y-5 p-6">
      <Alert>{form.formError}</Alert>
      <Input label="Title" {...form.field('title')} />
      <Input as="select" label="Destination" {...form.field('destination')}>
        <option value="">Choose a destination</option>
        {(dests?.items ?? []).map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
      </Input>
      <Input as="textarea" label="Short description" hint="Shown on cards. 20 to 200 characters." className="[&_textarea]:min-h-20" {...form.field('description')} />
      <Input as="textarea" label="Overview" {...form.field('overview')} />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        <Input label="Price per night ($)" type="number" min="1" {...form.field('pricePerNight')} />
        <Input label="Guests" type="number" min="1" {...form.field('guests')} />
        <Input label="Bedrooms" type="number" min="0" {...form.field('bedrooms')} />
        <Input label="Beds" type="number" min="1" {...form.field('beds')} />
        <Input label="Baths" type="number" min="1" {...form.field('baths')} />
      </div>
      <Input label="Amenities" hint="Separate with commas, for example: Wifi, Air conditioning, Kitchen" {...form.field('amenities')} />
      <Input as="textarea" label="Images" hint="One link or /path per line. The first image is the cover." {...form.field('images')} />
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-[var(--brand)]" {...form.checkbox('flexibleCancellation')} /> Flexible cancellation</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-[var(--brand)]" {...form.checkbox('featured')} /> Show on the home page</label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={form.loading}>{id ? 'Save changes' : 'Create stay'}</Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/stays')}>Cancel</Button>
      </div>
    </Card>
  );
}

const blank = { title: '', destination: '', description: '', overview: '', pricePerNight: '', guests: '', bedrooms: '', beds: '', baths: '', amenities: '', images: '', flexibleCancellation: false, featured: false };

export default function StayForm() {
  const { id } = useParams();
  const { data, isLoading } = useApi('stay', `/stays/${id}`, null, { enabled: Boolean(id) });
  useTitle(id ? 'Edit stay' : 'Add stay');

  const initial = id && data?.stay
    ? { ...blank, ...data.stay, amenities: data.stay.amenities.join(', '), images: data.stay.images.join('\n') }
    : blank;

  return (
    <>
      <PageHeader title={id ? 'Edit stay' : 'Add stay'} />
      {id && isLoading ? <Skeleton className="h-96 max-w-3xl" /> : <Form key={id ?? 'new'} initial={initial} id={id} />}
    </>
  );
}
