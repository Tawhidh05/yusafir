import { useState } from 'react';
import api from '../api/client';
import useForm from '../hooks/useForm';
import useTitle from '../hooks/useTitle';
import { site } from '../lib/config';
import { compact, emailError, requiredError } from '../lib/validators';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const validate = (v) => compact({
  name: requiredError(v.name, 'Name', 2),
  email: emailError(v.email),
  subject: requiredError(v.subject, 'Subject', 3),
  message: requiredError(v.message, 'Message', 10),
});

export default function Contact() {
  useTitle('Contact');
  const [success, setSuccess] = useState('');
  const form = useForm({ name: '', email: '', subject: '', message: '' }, validate);
  const onSubmit = form.submit(async (values) => {
    const { data } = await api.post('/messages', values);
    setSuccess(data.message);
    form.setValues({ name: '', email: '', subject: '', message: '' });
  });
  const { email, phone, address } = site.contact;

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_2fr]">
      <div>
        <h1 className="h-page">Contact us</h1>
        <p className="mt-2 text-mute">Questions about a booking or a destination? Send us a message and we will reply by email.</p>
        <ul className="mt-6 space-y-2 text-sm">
          {email && <li><a href={`mailto:${email}`} className="font-medium text-brand-text underline">{email}</a></li>}
          {phone && <li>{phone}</li>}
          {address && <li>{address}</li>}
        </ul>
      </div>
      <Card as="form" onSubmit={onSubmit} noValidate className="space-y-5 p-6">
        <Alert type="success">{success}</Alert>
        <Alert>{form.formError}</Alert>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Name" autoComplete="name" {...form.field('name')} />
          <Input label="Email" type="email" autoComplete="email" {...form.field('email')} />
        </div>
        <Input label="Subject" {...form.field('subject')} />
        <Input as="textarea" label="Message" className="[&_textarea]:min-h-40" {...form.field('message')} />
        <Button type="submit" size="lg" loading={form.loading}>Send message</Button>
      </Card>
    </div>
  );
}
