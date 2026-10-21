import Icon from '../ui/Icon';

export default function StarRating({ value, count, className = '' }) {
  if (!count) return <span className={`text-sm text-mute ${className}`}>New</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${className}`} aria-label={`Rated ${value.toFixed(1)} out of 5 from ${count} reviews`}>
      <Icon name="star" filled className="size-4 text-brand" />
      {value.toFixed(1)} <span className="font-normal text-mute">({count})</span>
    </span>
  );
}
