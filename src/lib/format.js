export const money = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value ?? 0);

export const formatDate = (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  value ? new Date(value).toLocaleDateString('en-GB', { timeZone: 'UTC', ...options }) : '';

export const nightsBetween = (from, to) => {
  if (!from || !to) return 0;
  const diff = Math.round((new Date(to) - new Date(from)) / 86_400_000);
  return diff > 0 ? diff : 0;
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
