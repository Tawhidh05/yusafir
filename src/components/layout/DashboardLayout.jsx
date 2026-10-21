import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import Icon from '../ui/Icon';
import Spinner from '../ui/Spinner';

const userMenu = [
  { to: '/dashboard', label: 'Overview', icon: 'dashboard', end: true },
  { to: '/dashboard/bookings', label: 'My Bookings', icon: 'ticket' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'user' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

const adminMenu = [
  { to: '/dashboard', label: 'Overview', icon: 'dashboard', end: true },
  { to: '/dashboard/users', label: 'Manage Users', icon: 'users' },
  { to: '/dashboard/destinations', label: 'Manage Destinations', icon: 'pin' },
  { to: '/dashboard/stays', label: 'Manage Stays', icon: 'building' },
  { to: '/dashboard/bookings', label: 'Bookings', icon: 'ticket' },
  { to: '/dashboard/messages', label: 'Messages', icon: 'mail' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'user' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

export default function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const menu = isAdmin ? adminMenu : userMenu;

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-3 px-2">
        <Avatar user={user} className="size-11" />
        <div className="min-w-0">
          <p className="truncate font-bold">{user.name}</p>
          <p className="text-xs capitalize text-mute">{user.role}</p>
        </div>
      </div>
      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand text-black' : 'text-ink hover:bg-subtle'}`}
          >
            <Icon name={item.icon} className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button type="button" onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-subtle">
        <Icon name="logout" className="size-5" /> Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-subtle lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-surface lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="relative h-full w-72 max-w-[85vw] bg-surface shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-subtle lg:hidden" aria-label="Open dashboard menu">
              <Icon name="menu" />
            </button>
            <Logo className="h-10" />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/explore" className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-subtle">Browse stays</Link>
            <ThemeToggle />
          </div>
        </header>
        <main id="main" className="p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<div className="grid min-h-[50vh] place-items-center"><Spinner className="size-8" /></div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
