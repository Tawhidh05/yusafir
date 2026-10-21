import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function CtaSection() {
  const { user } = useAuth();
  return (
    <section className="py-14 sm:py-20" aria-labelledby="cta-title">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-xl bg-black px-6 py-14 text-center text-white sm:px-12">
          <img src="/assets/images/destinations/coxs-bazar-hero.webp" alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-black/65" />
          <h2 id="cta-title" className="h-section">Ready for your next trip?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Pick a destination, compare stays and book in a few minutes.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/explore" size="lg">Find a stay</Button>
            {!user && <Button to="/register" size="lg" variant="light">Create an account</Button>}
          </div>
        </div>
      </div>
    </section>
  );
}
