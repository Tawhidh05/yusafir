import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-brand text-black hover:brightness-95',
  outline: 'border border-line bg-surface text-ink hover:bg-subtle',
  ghost: 'text-ink hover:bg-subtle',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  light: 'bg-white text-black hover:bg-white/90',
};
const sizes = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-5 text-base', lg: 'h-12 px-6 text-base' };

/** Renders a <Link> when `to` is given, otherwise a <button>. Disabled while `loading`. */
export default function Button({ to, variant = 'primary', size = 'md', loading = false, className = '', type = 'button', children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} disabled={props.disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}
