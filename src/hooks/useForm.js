import { useCallback, useState } from 'react';
import { getErrorInfo } from '../api/client';

/**
 * Small form helper: controlled values, client validation, and server field errors.
 * `submit(onValid)` runs validate(values) first, then onValid(values); a rejected
 * request puts the server's field messages next to the inputs.
 */
export default function useForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const field = (name) => ({
    name,
    value: values[name] ?? '',
    error: errors[name],
    onChange: (e) => set(name, e.target.value),
  });

  const checkbox = (name) => ({ name, checked: Boolean(values[name]), onChange: (e) => set(name, e.target.checked) });

  const submit = (onValid) => async (event) => {
    event.preventDefault();
    setFormError('');
    const found = validate ? validate(values) : {};
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      await onValid(values);
    } catch (error) {
      const { message, fields } = getErrorInfo(error);
      setErrors(fields || {});
      setFormError(fields ? '' : message);
    } finally {
      setLoading(false);
    }
  };

  return { values, setValues, set, field, checkbox, errors, formError, setFormError, loading, submit };
}
