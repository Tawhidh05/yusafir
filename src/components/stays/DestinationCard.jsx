import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

export default function DestinationCard({ destination }) {
  return (
    <Card as="article" className="flex h-full flex-col overflow-hidden">
      <img src={destination.image} alt="" loading="lazy" width="540" height="832" className="aspect-[4/3] w-full object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold">{destination.name}</h3>
        <p className="flex items-center gap-1 text-sm text-mute"><Icon name="pin" className="size-4" />{destination.region}</p>
        <p className="line-clamp-2 min-h-10 text-sm text-mute">{destination.summary}</p>
        <div className="pt-1"><Badge>{destination.category}</Badge></div>
        <Button to={`/booking/${destination.slug}`} className="mt-auto w-full">View Details</Button>
      </div>
    </Card>
  );
}
