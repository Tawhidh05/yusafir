import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import useTitle from '../hooks/useTitle';
import { demoAccounts } from '../lib/config';
import { compact, emailError, requiredError } from '../lib/validators';
import AuthShell from '../components/layout/AuthShell';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  useTitle('Login');
  const { user, login, expired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [remember, setRemember] = useState(false);
  const destination = location.state?.from || '/dashboard';

  const form = useForm({ email: '', password: '' }, (v) => compact({ email: emailError(v.email), password: requiredError(v.password, 'Password') }));
  const onSubmit = form.submit(async ({ email, password }) => {
    await login({ email, password, remember });
    navigate(destination, { replace: true });
  });

  if (user) return <Navigate to={destination} replace />;

  const fillDemo = (role) => form.setValues({ email: demoAccounts[role].email ?? '', password: demoAccounts[role].password ?? '' });
  const hasDemo = demoAccounts.user.email && demoAccounts.user.password;

  return (
    <AuthShell
      title="Login"
      below={hasDemo && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-4 text-sm text-mute" role="separator"><span className="h-px flex-1 bg-line" />Or<span className="h-px flex-1 bg-line" /></div>
          <Button variant="outline" className="w-full" onClick={() => fillDemo('user')}>Fill demo user credentials</Button>
          <Button variant="outline" className="w-full" onClick={() => fillDemo('admin')}>Fill demo admin credentials</Button>
        </div>
      )}
    >
      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
        {expired && !form.formError && <Alert>Your session expired. Please log in again.</Alert>}
        <Alert>{form.formError}</Alert>
        <Input variant="underline" label="Email" type="email" autoComplete="email" {...form.field('email')} />
        <Input variant="underline" label="Password" type="password" autoComplete="current-password" {...form.field('password')} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 rounded accent-[var(--brand)]" />
          Remember me
        </label>
        <Button type="submit" size="lg" className="w-full" loading={form.loading}>Login</Button>
        <p className="text-center text-sm">Don&apos;t have an account? <Link to="/register" state={location.state} className="font-medium text-brand-text underline">Create an account</Link></p>
      </form>
    </AuthShell>
  );
}
