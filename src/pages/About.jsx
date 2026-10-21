import { useApi } from '../api/hooks';
import useTitle from '../hooks/useTitle';
import Button from '../components/ui/Button';

export default function About() {
  useTitle('About us');
  const { data } = useApi('stats-public', '/stats/public', null, { staleTime: 60_000 });
  return (
    <div className="container-page max-w-4xl py-10">
      <h1 className="h-page sm:text-4xl">About Yusafir</h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed">
        <p>Yusafir helps travellers discover destinations in Bangladesh and book a place to stay. Each destination page explains what the place is known for, and each stay lists its price, size, amenities and cancellation policy before you book.</p>
        <p>You choose where you are travelling from and your dates, compare stays by price, rating and number of guests, and send a booking from your account. Our team confirms it, and you can follow or cancel it from your dashboard.</p>
        {data && <p>Right now Yusafir covers {data.destinations} destinations with {data.stays} stays to choose from.</p>}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button to="/explore">Explore stays</Button>
        <Button to="/contact" variant="outline">Contact us</Button>
      </div>
    </div>
  );
}
