import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useDestinations } from '../../api/hooks';
import useRowActions from '../../hooks/useRowActions';
import useTitle from '../../hooks/useTitle';
import { money } from '../../lib/format';
import DataTable, { RowAction } from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Icon from '../../components/ui/Icon';

export default function ManageStays() {
  useTitle('Manage stays');
  const navigate = useNavigate();
  const { data: dests } = useDestinations({ limit: 50 });
  const { notice, run, busy } = useRowActions(['stays', 'categories', 'stats-dashboard']);
  const [removing, setRemoving] = useState(null);

  const columns = [
    { key: 'title', label: 'Stay', sortable: true, render: (s) => <span className="flex items-center gap-3"><img src={s.images[0]} alt="" className="size-10 rounded-xl object-cover" /><span className="line-clamp-1 max-w-64 font-medium">{s.title}</span></span> },
    { key: 'location', label: 'Destination', sortable: true },
    { key: 'pricePerNight', label: 'Price/night', sortable: true, render: (s) => money(s.pricePerNight) },
    { key: 'ratingAvg', label: 'Rating', sortable: true, render: (s) => (s.ratingCount ? `${s.ratingAvg.toFixed(1)} (${s.ratingCount})` : 'New') },
    { key: 'featured', label: 'Featured', render: (s) => (s.featured ? <Badge variant="brand">Featured</Badge> : <span className="text-mute">-</span>) },
  ];

  return (
    <>
      <PageHeader title="Manage stays" text="Add, edit or remove the stays guests can book." action={<Button to="/dashboard/stays/new"><Icon name="plus" className="size-4" /> Add stay</Button>} />
      {notice && <Alert type={notice.type} className="mb-4">{notice.text}</Alert>}
      <DataTable queryKey="stays" endpoint="/stays" columns={columns} searchPlaceholder="Title or place"
        filters={[{ name: 'destination', label: 'Destination', options: (dests?.items ?? []).map((d) => ({ value: d.slug, label: d.name })) }]}
        actions={(s) => (
          <>
            <RowAction icon="eye" label="View stay" onClick={() => navigate(`/stays/${s._id}`)} />
            <RowAction icon="edit" label="Edit stay" onClick={() => navigate(`/dashboard/stays/${s._id}/edit`)} />
            <RowAction icon="trash" label="Delete stay" danger onClick={() => setRemoving(s)} />
          </>
        )} />
      <ConfirmModal open={Boolean(removing)} title="Delete this stay?" message={`${removing?.title} and its reviews will be removed. Existing bookings keep their record.`} loading={busy} onClose={() => setRemoving(null)}
        onConfirm={async () => { await run(() => api.delete(`/stays/${removing._id}`), 'Stay deleted'); setRemoving(null); }} />
    </>
  );
}
