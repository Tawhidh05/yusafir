import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import useTitle from '../hooks/useTitle';
import { compact, emailError, passwordError, requiredError } from '../lib/validators';
import AuthShell from '../components/layout/AuthShell';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const validate = (v) => compact({
  firstName: requiredError(v.firstName, 'First name', 2),
  lastName: requiredError(v.lastName, 'Last name', 2),
  email: emailError(v.email),
  password: passwordError(v.password),
  confirmPassword: !v.confirmPassword ? 'Confirm your password' : v.confirmPassword !== v.password ? 'Passwords do not match' : '',
});

export default function Register() {
  useTitle('Create an account');
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || '/dashboard';

  const form = useForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }, validate);
  const onSubmit = form.submit(async (values) => {
    await register(values);
    navigate(destination, { replace: true });
  });

  if (user) return <Navigate to={destination} replace />;

  return (
    <AuthShell title="Create an account">
      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
        <Alert>{form.formError}</Alert>
        <Input variant="underline" label="First Name" autoComplete="given-name" {...form.field('firstName')} />
        <Input variant="underline" label="Last Name" autoComplete="family-name" {...form.field('lastName')} />
        <Input variant="underline" label="Email" type="email" autoComplete="email" {...form.field('email')} />
        <Input variant="underline" label="Password" type="password" autoComplete="new-password" hint="At least 8 characters with an uppercase letter, a lowercase letter and a number." {...form.field('password')} />
        <Input variant="underline" label="Confirm Password" type="password" autoComplete="new-password" {...form.field('confirmPassword')} />
        <Button type="submit" size="lg" className="w-full" loading={form.loading}>Create an account</Button>
        <p className="text-center text-sm">Already have an account? <Link to="/login" state={location.state} className="font-medium text-brand-text underline">Login</Link></p>
      </form>
    </AuthShell>
  );
}
