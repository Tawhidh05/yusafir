import { useRef, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import useTitle from '../../hooks/useTitle';
import { compact, passwordError, requiredError } from '../../lib/validators';
import PageHeader from '../../components/dashboard/PageHeader';
import Avatar from '../../components/layout/Avatar';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

/** Crops to a square and shrinks the photo in the browser so the stored avatar stays small. */
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('That file could not be read as an image'));
    img.src = url;
  });
}

function ProfileForm() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [success, setSuccess] = useState('');
  const form = useForm({ firstName: user.firstName, lastName: user.lastName, image: user.image },
    (v) => compact({ firstName: requiredError(v.firstName, 'First name', 2), lastName: requiredError(v.lastName, 'Last name', 2) }));

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setFormError('');
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return form.setFormError('Upload a PNG, JPG or WebP image');
    try {
      form.set('image', await resizeImage(file));
    } catch (err) {
      form.setFormError(err.message);
    }
  };

  const onSubmit = form.submit(async (v) => {
    const { data } = await api.put('/auth/me', v);
    updateUser(data.user);
    setSuccess('Profile updated');
  });

  return (
    <Card as="form" onSubmit={onSubmit} noValidate className="space-y-5 p-6">
      <h2 className="text-lg font-bold">Your details</h2>
      <Alert type="success">{success}</Alert>
      <Alert>{form.formError}</Alert>
      <div className="flex items-center gap-4">
        <Avatar user={{ ...user, image: form.values.image }} className="size-20 text-2xl" />
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} id="avatar" type="file" accept="image/png,image/jpeg,image/webp" onChange={pick} className="sr-only" />
          <Button variant="outline" size="sm" onClick={() => fileRef.current.click()}>Upload photo</Button>
          {form.values.image && <Button variant="ghost" size="sm" onClick={() => form.set('image', '')}>Remove</Button>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" autoComplete="given-name" {...form.field('firstName')} />
        <Input label="Last name" autoComplete="family-name" {...form.field('lastName')} />
      </div>
      <Input label="Email" value={user.email} readOnly hint="Email cannot be changed." />
      <Button type="submit" loading={form.loading}>Save changes</Button>
    </Card>
  );
}

function PasswordForm() {
  const [success, setSuccess] = useState('');
  const empty = { currentPassword: '', newPassword: '', confirmPassword: '' };
  const form = useForm(empty, (v) => compact({
    currentPassword: requiredError(v.currentPassword, 'Current password'),
    newPassword: passwordError(v.newPassword, 'New password'),
    confirmPassword: v.confirmPassword !== v.newPassword ? 'Passwords do not match' : '',
  }));
  const onSubmit = form.submit(async (v) => {
    await api.put('/auth/password', v);
    form.setValues(empty);
    setSuccess('Password updated');
  });

  return (
    <Card as="form" onSubmit={onSubmit} noValidate className="space-y-5 p-6">
      <h2 className="text-lg font-bold">Change password</h2>
      <Alert type="success">{success}</Alert>
      <Alert>{form.formError}</Alert>
      <Input label="Current password" type="password" autoComplete="current-password" {...form.field('currentPassword')} />
      <Input label="New password" type="password" autoComplete="new-password" hint="At least 8 characters with an uppercase letter, a lowercase letter and a number." {...form.field('newPassword')} />
      <Input label="Confirm new password" type="password" autoComplete="new-password" {...form.field('confirmPassword')} />
      <Button type="submit" loading={form.loading}>Update password</Button>
    </Card>
  );
}

export default function Profile() {
  useTitle('Profile');
  return (
    <>
      <PageHeader title="Profile" text="Update your details, photo and password." />
      <div className="grid max-w-5xl gap-6 xl:grid-cols-2">
        <ProfileForm />
        <PasswordForm />
      </div>
    </>
  );
}
