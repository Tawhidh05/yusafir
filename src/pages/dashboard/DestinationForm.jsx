import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { useApi } from '../../api/hooks';
import useForm from '../../hooks/useForm';
import useTitle from '../../hooks/useTitle';
import { compact, requiredError } from '../../lib/validators';
import PageHeader from '../../components/dashboard/PageHeader';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';

const urlOrPath = /^(https?:\/\/|\/)\S+$/;
const coord = (value, label, limit) => {
  const n = Number(value);
  if (value === '' || Number.isNaN(n)) return `${label} is required`;
  return Math.abs(n) > limit ? `${label} must be between -${limit} and ${limit}` : '';
};

const validate = (v) => compact({
  name: requiredError(v.name, 'Name', 3),
  category: requiredError(v.category, 'Category', 3),
  region: requiredError(v.region, 'Region', 3),
  summary: requiredError(v.summary, 'Summary', 20),
  overview: requiredError(v.overview, 'Overview', 40),
  image: urlOrPath.test(v.image) ? '' : 'Enter a link or a path starting with /',
  heroImage: !v.heroImage || urlOrPath.test(v.heroImage) ? '' : 'Enter a link or a path starting with /',
  lat: coord(v.lat, 'Latitude', 90),
  lng: coord(v.lng, 'Longitude', 180),
});

const blank = { name: '', category: '', region: '', summary: '', overview: '', image: '', heroImage: '', lat: '', lng: '' };

function Form({ initial, slug }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm(initial, validate);

  const onSubmit = form.submit(async (v) => {
    const payload = { ...v, lat: Number(v.lat), lng: Number(v.lng) };
    await (slug ? api.put(`/destinations/${slug}`, payload) : api.post('/destinations', payload));
    ['destinations', 'destination', 'stays', 'categories', 'stats-dashboard'].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    navigate('/dashboard/destinations');
  });

  return (
    <Card as="form" onSubmit={onSubmit} noValidate className="max-w-3xl space-y-5 p-6">
      <Alert>{form.formError}</Alert>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Name" {...form.field('name')} />
        <Input label="Category" hint="For example: Beach, Hills, Tea gardens" {...form.field('category')} />
      </div>
      <Input label="Region" {...form.field('region')} />
      <Input as="textarea" label="Summary" hint="Shown on cards and in the home hero." className="[&_textarea]:min-h-20" {...form.field('summary')} />
      <Input as="textarea" label="Overview" hint="Shown on the booking page." {...form.field('overview')} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Card image" hint="Link or /path" {...form.field('image')} />
        <Input label="Hero image (optional)" hint="Defaults to the card image" {...form.field('heroImage')} />
        <Input label="Latitude" type="number" step="any" {...form.field('lat')} />
        <Input label="Longitude" type="number" step="any" {...form.field('lng')} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={form.loading}>{slug ? 'Save changes' : 'Create destination'}</Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/destinations')}>Cancel</Button>
      </div>
    </Card>
  );
}

export default function DestinationForm() {
  const { slug } = useParams();
  const { data, isLoading } = useApi('destination', `/destinations/${slug}`, null, { enabled: Boolean(slug) });
  useTitle(slug ? 'Edit destination' : 'Add destination');
  const initial = slug && data?.destination ? { ...blank, ...data.destination } : blank;

  return (
    <>
      <PageHeader title={slug ? 'Edit destination' : 'Add destination'} />
      {slug && isLoading ? <Skeleton className="h-96 max-w-3xl" /> : <Form key={slug ?? 'new'} initial={initial} slug={slug} />}
    </>
  );
}
