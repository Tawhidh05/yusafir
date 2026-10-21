import { Link } from 'react-router-dom';
import { money, plural } from '../../lib/format';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import StarRating from './StarRating';

/**
 * Listing card used for stays.
 * variant "grid": vertical card for the 4-up grids. variant "row": horizontal result row (Figma search page).
 * `search` carries dates/guests from the booking form through to the details page.
 */
export default function StayCard({ stay, variant = 'grid', search = '', nights = 0 }) {
  const href = `/stays/${stay._id}${search ? `?${search}` : ''}`;
  const specs = [plural(stay.guests, 'guest'), plural(stay.bedrooms, 'bedroom'), plural(stay.beds, 'bed'), plural(stay.baths, 'bath')];

  if (variant === 'row') {
    return (
      <Card as="article" className="flex flex-col gap-4 p-3 sm:flex-row sm:p-4">
        <Link to={href} className="block shrink-0 sm:w-56 lg:w-64" tabIndex={-1} aria-hidden="true">
          <img src={stay.images[0]} alt="" loading="lazy" width="540" height="376" className="aspect-[4/3] w-full rounded-xl object-cover sm:h-full" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="text-lg font-semibold leading-snug"><Link to={href} className="hover:text-brand-text">{stay.title}</Link></h3>
          <p className="text-sm text-mute">{specs.join('  ')}</p>
          <p className="text-sm text-mute">{stay.amenities.join('  ')}</p>
          {stay.flexibleCancellation && <p className="text-sm text-mute">Cancellation flexibility available</p>}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <StarRating value={stay.ratingAvg} count={stay.ratingCount} />
              <span className="text-lg font-semibold">{money(stay.pricePerNight)}<span className="font-normal text-mute">/night</span></span>
              {nights > 0 && <span className="text-sm text-mute">{money(nights * stay.pricePerNight)} total</span>}
            </div>
            <Button to={href} size="sm">View Details</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card as="article" className="flex h-full flex-col overflow-hidden">
      <Link to={href} tabIndex={-1} aria-hidden="true">
        <img src={stay.images[0]} alt="" loading="lazy" width="540" height="376" className="aspect-[4/3] w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold">{stay.title}</h3>
        <p className="flex items-center gap-1 text-sm text-mute"><Icon name="pin" className="size-4" />{stay.location}</p>
        <p className="line-clamp-2 min-h-10 text-sm text-mute">{stay.description}</p>
        <div className="flex items-center justify-between pt-1">
          <StarRating value={stay.ratingAvg} count={stay.ratingCount} />
          <span className="font-semibold">{money(stay.pricePerNight)}<span className="text-sm font-normal text-mute">/night</span></span>
        </div>
        <Button to={href} className="mt-auto w-full" variant="primary">View Details</Button>
      </div>
    </Card>
  );
}
