import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import useRowActions from '../../hooks/useRowActions';
import useTitle from '../../hooks/useTitle';
import { formatDate, money, plural } from '../../lib/format';
import DataTable, { RowAction } from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import Alert from '../../components/ui/Alert';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Modal from '../../components/ui/Modal';

const statusOptions = ['pending', 'confirmed', 'cancelled'].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }));

/** Admins see and manage every booking; users see their own and can cancel them. */
export default function Bookings() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  useTitle(isAdmin ? 'Bookings' : 'My bookings');
  const { notice, setNotice, run, busy } = useRowActions(['bookings', 'stats-dashboard']);
  const [viewing, setViewing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const justBooked = location.state?.booked;

  const setStatus = (row, status) => run(() => api.patch(`/bookings/${row._id}/status`, { status }), `Booking ${status}`);

  const columns = [
    { key: 'stayTitle', label: 'Stay', sortable: true, render: (r) => <Link to={`/stays/${r.stayId}`} className="font-medium hover:text-brand-text">{r.stayTitle}</Link> },
    ...(isAdmin ? [{ key: 'userName', label: 'Guest' }] : []),
    { key: 'destination', label: 'Destination' },
    { key: 'checkIn', label: 'Dates', sortable: true, render: (r) => `${formatDate(r.checkIn, { day: 'numeric', month: 'short' })} - ${formatDate(r.checkOut, { day: 'numeric', month: 'short', year: 'numeric' })}` },
    { key: 'total', label: 'Total', sortable: true, render: (r) => money(r.total) },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader title={isAdmin ? 'Bookings' : 'My bookings'} text={isAdmin ? 'Confirm, cancel or remove guest bookings.' : 'Follow the status of your trips.'} />
      {justBooked && !notice && <Alert type="success" className="mb-4">Your booking for {justBooked} was sent. We will confirm it soon.</Alert>}
      {notice && <Alert type={notice.type} className="mb-4">{notice.text}</Alert>}

      <DataTable queryKey="bookings" endpoint="/bookings" columns={columns} searchPlaceholder="Stay, destination or guest" emptyTitle="No bookings yet"
        filters={[{ name: 'status', label: 'Status', options: statusOptions }]}
        actions={(row) => (
          <>
            <RowAction icon="eye" label="View booking" onClick={() => setViewing(row)} />
            {isAdmin && row.status === 'pending' && <RowAction icon="check" label="Confirm booking" onClick={() => setStatus(row, 'confirmed')} />}
            {row.status !== 'cancelled' && <RowAction icon="x" label="Cancel booking" onClick={() => setStatus(row, 'cancelled')} />}
            {isAdmin && <RowAction icon="trash" label="Delete booking" danger onClick={() => setRemoving(row)} />}
          </>
        )} />

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Booking details">
        {viewing && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {[['Stay', viewing.stayTitle], ['Destination', viewing.destination], ['Travelling from', viewing.origin || 'Not provided'], ['Check-in', formatDate(viewing.checkIn)], ['Check-out', formatDate(viewing.checkOut)],
              ['Guests', plural(viewing.guests, 'guest')], ['Nights', viewing.nights], ['Price per night', money(viewing.pricePerNight)], ['Total', money(viewing.total)], ['Booked on', formatDate(viewing.createdAt)]].map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-mute">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
            <dt className="text-mute">Status</dt><dd><StatusBadge status={viewing.status} /></dd>
          </dl>
        )}
      </Modal>
      <ConfirmModal open={Boolean(removing)} title="Delete this booking?" message="This permanently removes the booking record." loading={busy} onClose={() => setRemoving(null)}
        onConfirm={async () => { if (await run(() => api.delete(`/bookings/${removing._id}`), 'Booking deleted')) setRemoving(null); }} />
    </>
  );
}
