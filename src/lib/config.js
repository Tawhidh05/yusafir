const env = import.meta.env;

export const site = {
  name: 'Yusafir',
  contact: { email: env.VITE_CONTACT_EMAIL, phone: env.VITE_CONTACT_PHONE, address: env.VITE_CONTACT_ADDRESS },
  social: [
    { label: 'Facebook', href: env.VITE_SOCIAL_FACEBOOK },
    { label: 'Instagram', href: env.VITE_SOCIAL_INSTAGRAM },
    { label: 'YouTube', href: env.VITE_SOCIAL_YOUTUBE },
  ].filter((s) => s.href),
};

export const demoAccounts = {
  user: { email: env.VITE_DEMO_USER_EMAIL, password: env.VITE_DEMO_USER_PASSWORD },
  admin: { email: env.VITE_DEMO_ADMIN_EMAIL, password: env.VITE_DEMO_ADMIN_PASSWORD },
};
