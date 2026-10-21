import { useState } from 'react';
import api from '../../api/client';
import useForm from '../../hooks/useForm';
import { emailError } from '../../lib/validators';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Section from './Section';

export default function Newsletter() {
  const [success, setSuccess] = useState('');
  const form = useForm({ email: '' }, (v) => (emailError(v.email) ? { email: emailError(v.email) } : {}));

  const onSubmit = form.submit(async ({ email }) => {
    const { data } = await api.post('/newsletter', { email });
    setSuccess(data.message);
    form.setValues({ email: '' });
  });

  return (
    <Section id="newsletter" tone="muted" title="Get travel updates" subtitle="New destinations, new stays and travel guides, sent to your inbox.">
      <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Input label="Email address" type="email" autoComplete="email" className="flex-1" {...form.field('email')} />
          <Button type="submit" loading={form.loading} className="sm:mt-[1.65rem]">Subscribe</Button>
        </div>
        <Alert>{form.formError}</Alert>
        <Alert type="success">{success}</Alert>
      </form>
    </Section>
  );
}
