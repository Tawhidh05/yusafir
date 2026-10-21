import Icon from '../ui/Icon';
import Section from './Section';

const faqs = [
  ['Do I need an account to browse stays?', 'No. Destinations, stays, reviews and the blog are public. You need an account to book a stay or leave a review.'],
  ['What happens after I send a booking?', 'Your booking starts as pending. Our team confirms it, and you can follow the status on the My Bookings page.'],
  ['Can I cancel a booking?', 'Yes. Open My Bookings in your dashboard and cancel a pending or confirmed booking. Stays marked with flexible cancellation list that in their details.'],
  ['Does Yusafir take payments?', 'Not yet. Booking totals are calculated from the nightly price and number of nights, and no payment is collected on the site.'],
  ['How is a stay rating calculated?', 'It is the average of the one to five star ratings left by guests, shown with the number of reviews.'],
];

export default function FaqSection() {
  return (
    <Section id="faq" title="Frequently asked questions">
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-xl border border-line">
        {faqs.map(([q, a]) => (
          <details key={q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {q}
              <Icon name="chevronDown" className="size-5 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm text-mute">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
