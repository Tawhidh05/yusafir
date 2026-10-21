export default function Section({ id, title, subtitle, action, tone = 'plain', children }) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${tone === 'muted' ? 'bg-subtle' : ''}`} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id={id ? `${id}-title` : undefined} className="h-section">{title}</h2>
            {subtitle && <p className="mt-2 text-mute">{subtitle}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
