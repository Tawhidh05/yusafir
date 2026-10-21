const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailError = (value) => {
  if (!value?.trim()) return 'Email is required';
  return EMAIL.test(value.trim()) ? '' : 'Enter a valid email address';
};

export const passwordError = (value, label = 'Password') => {
  if (!value) return `${label} is required`;
  if (value.length < 8) return `${label} must be at least 8 characters`;
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
    return `${label} needs an uppercase letter, a lowercase letter and a number`;
  }
  return '';
};

export const requiredError = (value, label, min = 1) => {
  const text = String(value ?? '').trim();
  if (!text) return `${label} is required`;
  return text.length < min ? `${label} must be at least ${min} characters` : '';
};

/** Removes empty messages so `Object.keys(errors).length` tells whether the form is valid. */
export const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
