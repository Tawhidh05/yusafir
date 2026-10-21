const variants = {
  neutral: 'bg-subtle text-ink',
  brand: 'bg-brand text-black',
  solid: 'bg-ink text-surface',
  outline: 'border border-line text-mute',
};

export default function Badge({ variant = 'neutral', className = '', children }) {
  return <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>{children}</span>;
}
