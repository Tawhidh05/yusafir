import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import useTitle from '../../hooks/useTitle';
import { formatDate } from '../../lib/format';
import PageHeader from '../../components/dashboard/PageHeader';
import Card from '../../components/ui/Card';

const options = [
  ['light', 'Light', 'Always use the light theme'],
  ['dark', 'Dark', 'Always use the dark theme'],
  ['system', 'System', 'Match your device setting'],
];

export default function Settings() {
  useTitle('Settings');
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid max-w-5xl gap-6 xl:grid-cols-2">
        <Card as="fieldset" className="p-6">
          <legend className="mb-3 px-0 text-lg font-bold">Appearance</legend>
          <div className="space-y-3">
            {options.map(([value, label, text]) => (
              <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${theme === value ? 'border-brand bg-brand/10' : 'border-line'}`}>
                <input type="radio" name="theme" value={value} checked={theme === value} onChange={() => setTheme(value)} className="mt-1 accent-[var(--brand)]" />
                <span><span className="block font-medium">{label}</span><span className="text-sm text-mute">{text}</span></span>
              </label>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-3 text-lg font-bold">Account</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-mute">Email</dt><dd className="font-medium">{user.email}</dd>
            <dt className="text-mute">Role</dt><dd className="font-medium capitalize">{user.role}</dd>
            <dt className="text-mute">Member since</dt><dd className="font-medium">{formatDate(user.createdAt)}</dd>
          </dl>
        </Card>
      </div>
    </>
  );
}
