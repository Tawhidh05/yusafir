# Yusafir

A travel booking platform for Bangladesh. Visitors browse destinations and stays, create an account, and book. Admins manage destinations, stays, users and bookings from a role-based dashboard.

**Live site:** https://yusafir-eight.vercel.app<br>
**Front-end Repository:** [https://github.com/Tawhidh05/yusafir](https://github.com/Tawhidh05/yusafir/tree/main)<br>
**Back-end Repository:** [https://github.com/Tawhidh05/yusafir](https://github.com/Tawhidh05/yusafir/tree/serv)

## Tech stack
- **Frontend:** React 18, React Router, Tailwind CSS v4, Axios, TanStack Query, Recharts, Vite
- **Backend:** Node.js, Express, MongoDB (Atlas), JWT, bcrypt
- **Hosting:** Vercel (client), Render (server)

## Features
- Home page with destination slider, stats, featured stays, how-it-works, blog, FAQ and newsletter
- Booking form, explore page with search, filters, sorting and pagination
- Stay details with photo gallery, specifications, reviews and booking
- Register, login (JWT), remember me, protected routes, role-based access (user, admin)
- User dashboard: overview, bookings, profile, settings
- Admin dashboard: users, destinations, stays, bookings, messages, charts
- Light and dark mode, responsive layout

## Demo credentials
| Role  | Email               | Password |
|-------|---------------------|----------|
| User  | user@yusafir.com    | *Travel2024* |
| Admin | admin@yusafir.com   | *Yusafir1234* |


## Environment variables
- **server:** `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `DB_NAME`, `PORT`, `SEED_*`
- **client:** `VITE_API_URL`, `VITE_DEMO_*`, `VITE_CONTACT_*`, `VITE_SOCIAL_*`

## Project structure
```
server/   Express API: config, routes, controllers, middleware, seed
client/   React app: pages, components, hooks, context, api
```
