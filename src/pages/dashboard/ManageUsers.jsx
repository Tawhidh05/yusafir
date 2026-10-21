import { useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import useRowActions from '../../hooks/useRowActions';
import useTitle from '../../hooks/useTitle';
import { formatDate } from '../../lib/format';
import DataTable, { RowAction } from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function ManageUsers() {
  useTitle('Manage users');
  const { user: me } = useAuth();
  const { notice, run, busy } = useRowActions(['users', 'stats-dashboard']);
  const [removing, setRemoving] = useState(null);

  const columns = [
    { key: 'firstName', label: 'Name', sortable: true, render: (u) => `${u.firstName} ${u.lastName}` },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (u) => <Badge variant={u.role === 'admin' ? 'brand' : 'neutral'} className="capitalize">{u.role}</Badge> },
    { key: 'createdAt', label: 'Joined', sortable: true, render: (u) => formatDate(u.createdAt) },
  ];

  return (
    <>
      <PageHeader title="Manage users" text="Change roles or remove accounts." />
      {notice && <Alert type={notice.type} className="mb-4">{notice.text}</Alert>}
      <DataTable queryKey="users" endpoint="/users" columns={columns} searchPlaceholder="Name or email"
        filters={[{ name: 'role', label: 'Role', options: [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }] }]}
        actions={(u) => u._id === me.id ? <span className="px-2 text-xs text-mute">You</span> : (
          <>
            <RowAction icon="user" label={u.role === 'admin' ? 'Make regular user' : 'Make admin'} onClick={() => run(() => api.patch(`/users/${u._id}/role`, { role: u.role === 'admin' ? 'user' : 'admin' }), 'Role updated')} />
            <RowAction icon="trash" label="Delete user" danger onClick={() => setRemoving(u)} />
          </>
        )} />
      <ConfirmModal open={Boolean(removing)} title="Delete this user?" message={`${removing?.firstName} ${removing?.lastName} and their bookings and reviews will be removed.`} loading={busy} onClose={() => setRemoving(null)}
        onConfirm={async () => { if (await run(() => api.delete(`/users/${removing._id}`), 'User deleted')) setRemoving(null); }} />
    </>
  );
}
