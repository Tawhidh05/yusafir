import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Spinner from '../ui/Spinner';

// Pages that open with a full-bleed photo draw the navbar over it.
const hasHero = (path) => path === '/' || path.startsWith('/booking/');

export default function MainLayout() {
  const { pathname } = useLocation();
  const overlay = hasHero(pathname);
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-xl bg-brand px-4 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Navbar overlay={overlay} />
      <main id="main" className={overlay ? '' : 'min-h-[70vh] pt-20'}>
        <Suspense fallback={<div className="grid min-h-[60vh] place-items-center"><Spinner className="size-8" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
