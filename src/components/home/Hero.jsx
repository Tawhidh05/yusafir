import { useEffect, useRef, useState } from 'react';
import { useDestinations } from '../../api/hooks';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { Skeleton } from '../ui/Skeleton';

/**
 * Hero (70% of the viewport): the active destination drives the background, heading,
 * description and Booking link. The card slider scrolls and can be driven by the arrows or by touch.
 */
export default function Hero() {
  const { data, isLoading } = useDestinations({ limit: 8 });
  const items = data?.items ?? [];
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const active = items[index];

  const go = (next) => items.length && setIndex((next + items.length) % items.length);

  // Keep the active card at the start of the slider.
  useEffect(() => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft - 4, behavior: 'smooth' });
  }, [index]);

  return (
    <section className="relative isolate h-[70vh] max-h-[46rem] min-h-[32rem] overflow-hidden bg-black text-white" aria-label="Featured destinations">
      {items.map((d, i) => (
        <img key={d.slug} src={d.heroImage} alt="" aria-hidden="true" loading={i === 0 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : undefined}
          className={`absolute inset-0 -z-20 size-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className="absolute inset-0 -z-10 bg-black/55" />

      <div className="container-page flex h-full flex-col justify-end gap-5 pb-8 pt-24 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pb-10">
        <div className="lg:w-[44%] lg:shrink-0">
          {isLoading || !active ? (
            <div className="space-y-4"><Skeleton className="h-16 w-3/4 bg-white/20" /><Skeleton className="h-16 w-full bg-white/20" /></div>
          ) : (
            <div aria-live="polite">
              <h1 className="h-display">{active.name}</h1>
              <p className="mt-3 line-clamp-2 max-w-lg text-base lg:mt-5 lg:line-clamp-3 lg:text-lg">{active.summary}</p>
              <Button to={`/booking/${active.slug}`} size="lg" className="mt-5 lg:mt-7">
                Booking <Icon name="arrowRight" />
              </Button>
            </div>
          )}
        </div>

        <div className="min-w-0 lg:flex-1">
          <div ref={trackRef} className="flex gap-4 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Choose a destination">
            {items.map((d, i) => (
              <button key={d.slug} type="button" ref={(el) => (cardRefs.current[i] = el)} onClick={() => setIndex(i)} aria-pressed={i === index} aria-label={`Show ${d.name}`}
                className={`relative h-40 w-28 shrink-0 overflow-hidden rounded-xl text-left ring-4 transition sm:h-56 sm:w-40 lg:h-80 lg:w-56 ${i === index ? 'ring-brand' : 'ring-transparent hover:ring-white/40'}`}>
                <img src={d.image} alt="" loading="lazy" className="size-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-10 font-display text-xl tracking-wide sm:text-2xl lg:px-5 lg:text-3xl">{d.name}</span>
              </button>
            ))}
            {isLoading && Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-40 w-28 shrink-0 bg-white/20 sm:h-56 sm:w-40 lg:h-80 lg:w-56" />)}
          </div>
          <div className="mt-3 flex gap-3 lg:mt-5">
            <button type="button" onClick={() => go(index - 1)} className="grid size-10 place-items-center rounded-xl bg-white text-black transition hover:bg-brand lg:size-12" aria-label="Previous destination"><Icon name="chevronLeft" /></button>
            <button type="button" onClick={() => go(index + 1)} className="grid size-10 place-items-center rounded-xl bg-white text-black transition hover:bg-brand lg:size-12" aria-label="Next destination"><Icon name="chevronRight" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
