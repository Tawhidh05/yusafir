import { useState } from 'react';
import api from '../../api/client';
import useRowActions from '../../hooks/useRowActions';
import useTitle from '../../hooks/useTitle';
import { formatDate } from '../../lib/format';
import DataTable, { RowAction } from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import Alert from '../../components/ui/Alert';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Modal from '../../components/ui/Modal';

export default function Messages() {
  useTitle('Messages');
  const { notice, run, busy } = useRowActions(['messages']);
  const [viewing, setViewing] = useState(null);
  const [removing, setRemoving] = useState(null);

  const columns = [
    { key: 'name', label: 'From', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'createdAt', label: 'Received', sortable: true, render: (m) => formatDate(m.createdAt) },
  ];

  return (
    <>
      <PageHeader title="Messages" text="Messages sent through the contact form." />
      {notice && <Alert type={notice.type} className="mb-4">{notice.text}</Alert>}
      <DataTable queryKey="messages" endpoint="/messages" columns={columns} searchPlaceholder="Name, email or subject" emptyTitle="No messages yet"
        actions={(m) => (
          <>
            <RowAction icon="eye" label="Read message" onClick={() => setViewing(m)} />
            <RowAction icon="trash" label="Delete message" danger onClick={() => setRemoving(m)} />
          </>
        )} />
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.subject ?? ''}>
        {viewing && (
          <div className="space-y-3 text-sm">
            <p><span className="text-mute">From:</span> <span className="font-medium">{viewing.name}</span> (<a className="text-brand-text underline" href={`mailto:${viewing.email}`}>{viewing.email}</a>)</p>
            <p className="whitespace-pre-wrap leading-relaxed">{viewing.message}</p>
          </div>
        )}
      </Modal>
      <ConfirmModal open={Boolean(removing)} title="Delete this message?" message="This cannot be undone." loading={busy} onClose={() => setRemoving(null)}
        onConfirm={async () => { await run(() => api.delete(`/messages/${removing._id}`), 'Message deleted'); setRemoving(null); }} />
    </>
  );
}
