export default function Alert({ type = 'error', children, className = '' }) {
  if (!children) return null;
  const styles =
    type === 'success'
      ? 'border-brand bg-brand/15 text-ink'
      : 'border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-300';
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${styles} ${className}`}>
      {children}
    </div>
  );
}
