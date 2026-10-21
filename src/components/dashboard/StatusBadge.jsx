import Badge from '../ui/Badge';

const variants = { pending: 'brand', confirmed: 'solid', cancelled: 'outline' };

export default function StatusBadge({ status }) {
  return <Badge variant={variants[status] ?? 'neutral'} className="capitalize">{status}</Badge>;
}
