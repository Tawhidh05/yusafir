import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import Icon from '../ui/Icon';

const publicLinks = [
  { to: '/news', label: 'News' },
  { to: '/explore', label: 'Destination' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Fixed, full-width navbar. Over a hero image (`overlay`) it is transparent with white text
 * until the page scrolls or the mobile menu opens, then it becomes a solid bar.
 */
export default function Navbar({ overlay }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = overlay && !scrolled && !open;
  const links = user ? [...publicLinks, { to: '/dashboard', label: 'Dashboard' }] : publicLinks;

  const search = (e) => {
    e.preventDefault();
    navigate(`/explore${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
    setQuery('');
  };

  const linkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-base font-medium transition ${isActive ? 'underline decoration-brand decoration-2 underline-offset-8' : 'hover:text-brand-text'} ${transparent ? 'hover:!text-brand' : ''}`;

  const menuItems = [
    { label: 'Dashboard', to: '/dashboard', icon: <Icon name="dashboard" className="size-4" /> },
    { label: 'Profile', to: '/dashboard/profile', icon: <Icon name="user" className="size-4" /> },
    { label: 'Settings', to: '/dashboard/settings', icon: <Icon name="settings" className="size-4" /> },
    { label: 'Logout', onClick: logout, icon: <Icon name="logout" className="size-4" /> },
  ];

  const searchForm = (
    <form onSubmit={search} role="search" className="relative w-full lg:max-w-sm">
      <label htmlFor="nav-search" className="sr-only">Search your destination</label>
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-current opacity-80" />
      <input
        id="nav-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your Destination..."
        className="h-11 w-full rounded-xl border border-current/60 bg-transparent pl-11 pr-3 text-base outline-none placeholder:text-current placeholder:opacity-80 focus:border-brand"
      />
    </form>
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors ${transparent ? 'bg-transparent text-white' : 'border-b border-line bg-surface/95 text-ink backdrop-blur'}`}>
      <div className="container-page flex h-20 items-center gap-4 lg:gap-8">
        <Logo light={transparent} className="h-14" />

        {overlay && <div className="hidden flex-1 lg:block">{searchForm}</div>}
        {!overlay && <div className="hidden flex-1 lg:block" />}

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <div className="hidden lg:block">
            {user ? (
              <Dropdown
                items={menuItems}
                trigger={
                  <span className="flex items-center gap-2 px-1 py-1">
                    <Avatar user={user} />
                    <span className="max-w-32 truncate font-bold">{user.name}</span>
                    <Icon name="chevronDown" className="size-4" />
                  </span>
                }
              />
            ) : (
              <Button to="/login">Login</Button>
            )}
          </div>
          <button type="button" onClick={() => setOpen((o) => !o)} className="grid size-10 place-items-center rounded-xl hover:bg-black/10 dark:hover:bg-white/10 lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="container-page flex flex-col gap-2 border-t border-line pb-5 pt-4 lg:hidden">
          {searchForm}
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `rounded-xl px-3 py-3 font-medium ${isActive ? 'bg-subtle' : ''}`}>
                {link.label}
              </NavLink>
            ))}
            {user && (
              <>
                <NavLink to="/dashboard/profile" className="rounded-xl px-3 py-3 font-medium">Profile</NavLink>
                <button type="button" onClick={logout} className="rounded-xl px-3 py-3 text-left font-medium">Logout</button>
              </>
            )}
          </nav>
          {!user && <Button to="/login" className="w-full">Login</Button>}
        </div>
      )}
    </header>
  );
}
