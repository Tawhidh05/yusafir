import Section from './Section';

const steps = [
  { title: 'Choose a destination', text: 'Open a destination and enter where you are travelling from and your travel dates.' },
  { title: 'Compare stays', text: 'Filter by price, rating and guests, then open a stay to see photos, specifications and reviews.' },
  { title: 'Book and manage', text: 'Create an account, send your booking, and follow its status or cancel it from your dashboard.' },
];

export default function HowItWorks() {
  return (
    <Section id="how-it-works" title="How booking works">
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-xl border border-line p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand font-bold text-black" aria-hidden="true">{i + 1}</span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-mute">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
