import useTitle from '../hooks/useTitle';
import Button from '../components/ui/Button';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <div className="container-page py-24 text-center">
      <p className="h-display">404</p>
      <h1 className="h-page mt-4">This page does not exist</h1>
      <p className="mt-2 text-mute">The link may be broken or the page may have moved.</p>
      <Button to="/" className="mt-6">Back to home</Button>
    </div>
  );
}
