import { Link } from 'react-router-dom';

/** `light` renders the mark in white, for use on top of photography. */
export default function Logo({ light = false, className = 'h-12' }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center rounded-xl" aria-label="Yusafir home">
      <img
        src="/assets/images/logo.png"
        alt="Yusafir logo"
        width="48"
        height="48"
        className={`w-auto object-contain ${className} ${light ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'}`}
      />
    </Link>
  );
}
