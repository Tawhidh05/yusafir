import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import useRowActions from '../../hooks/useRowActions';
import useTitle from '../../hooks/useTitle';
import DataTable, { RowAction } from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Icon from '../../components/ui/Icon';

export default function ManageDestinations() {
  useTitle('Manage destinations');
  const navigate = useNavigate();
  const { notice, run, busy } = useRowActions(['destinations', 'categories', 'stats-dashboard']);
  const [removing, setRemoving] = useState(null);

  const columns = [
    { key: 'name', label: 'Destination', sortable: true, render: (d) => <span className="flex items-center gap-3"><img src={d.image} alt="" className="size-10 rounded-xl object-cover" /><span className="font-medium">{d.name}</span></span> },
    { key: 'category', label: 'Type', sortable: true, render: (d) => <Badge>{d.category}</Badge> },
    { key: 'region', label: 'Region', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Manage destinations" text="Destinations appear in the home hero and the booking page." action={<Button to="/dashboard/destinations/new"><Icon name="plus" className="size-4" /> Add destination</Button>} />
      {notice && <Alert type={notice.type} className="mb-4">{notice.text}</Alert>}
      <DataTable queryKey="destinations" endpoint="/destinations" columns={columns} defaultSort={{ key: 'createdAt', dir: 'asc' }} searchPlaceholder="Name or region"
        actions={(d) => (
          <>
            <RowAction icon="eye" label="View booking page" onClick={() => navigate(`/booking/${d.slug}`)} />
            <RowAction icon="edit" label="Edit destination" onClick={() => navigate(`/dashboard/destinations/${d.slug}/edit`)} />
            <RowAction icon="trash" label="Delete destination" danger onClick={() => setRemoving(d)} />
          </>
        )} />
      <ConfirmModal open={Boolean(removing)} title="Delete this destination?" message={`${removing?.name} will be removed. Destinations that still have stays cannot be deleted.`} loading={busy} onClose={() => setRemoving(null)}
        onConfirm={async () => { if (await run(() => api.delete(`/destinations/${removing.slug}`), 'Destination deleted')) setRemoving(null); else setRemoving(null); }} />
    </>
  );
}
