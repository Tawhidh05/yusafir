import { Link } from 'react-router-dom';
import { site } from '../../lib/config';
import Logo from './Logo';

const columns = [
  { title: 'Explore', links: [['/explore', 'Destinations'], ['/news', 'News'], ['/blog', 'Blog'], ['/about', 'About us']] },
  { title: 'Account', links: [['/login', 'Login'], ['/register', 'Create an account'], ['/contact', 'Contact']] },
];

export default function Footer() {
  const { email, phone, address } = site.contact;
  return (
    <footer className="border-t border-line bg-subtle">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-14" />
          <p className="mt-4 max-w-xs text-sm text-mute">Discover Bangladesh&apos;s best destinations and book your stay in a few clicks.</p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-3 font-bold">{col.title}</h2>
            <ul className="space-y-2 text-sm text-mute">
              {col.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-ink">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-3 font-bold">Contact</h2>
          <ul className="space-y-2 text-sm text-mute">
            {email && <li><a href={`mailto:${email}`} className="hover:text-ink">{email}</a></li>}
            {phone && <li><a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-ink">{phone}</a></li>}
            {address && <li>{address}</li>}
          </ul>
          {site.social.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
              {site.social.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="text-brand-text hover:underline">{s.label}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-sm text-mute">&copy; {new Date().getFullYear()} Yusafir. All rights reserved.</div>
    </footer>
  );
}
