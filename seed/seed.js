import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDb, col, closeDb } from '../config/db.js';
import { destinations, stays, posts } from './data.js';

/**
 * Idempotent seed: safe to run repeatedly. Content is upserted by slug/title/email,
 * and ratings or accounts that already exist are not overwritten.
 */
const required = ['SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD', 'SEED_USER_EMAIL', 'SEED_USER_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) throw new Error(`Set these in server/.env before seeding: ${missing.join(', ')}`);

const base = Date.now() - 90 * 86_400_000;

await connectDb();

await col('destinations').bulkWrite(
  destinations.map((d, i) => ({
    updateOne: {
      filter: { slug: d.slug },
      update: { $set: d, $setOnInsert: { createdAt: new Date(base + i * 60_000) } },
      upsert: true,
    },
  })),
);

const byslug = Object.fromEntries(destinations.map((d) => [d.slug, d]));
await col('stays').bulkWrite(
  stays.map((s, i) => {
    const { ratingAvg, ratingCount, ...content } = s;
    const dest = byslug[s.destination];
    return {
      updateOne: {
        filter: { title: s.title },
        update: {
          $set: { ...content, location: dest.name, category: dest.category },
          $setOnInsert: { ratingAvg, ratingCount, createdAt: new Date(base + i * 60_000) },
        },
        upsert: true,
      },
    };
  }),
);

await col('posts').bulkWrite(posts.map((p) => ({ updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true } })));

const accounts = [
  { firstName: 'Yusafir', lastName: 'Admin', email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, role: 'admin' },
  { firstName: 'Sufi', lastName: 'Ahmed', email: process.env.SEED_USER_EMAIL, password: process.env.SEED_USER_PASSWORD, role: 'user' },
];
for (const { password, email, ...rest } of accounts) {
  await col('users').updateOne(
    { email: email.toLowerCase() },
    { $setOnInsert: { ...rest, email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12), image: '', createdAt: new Date() } },
    { upsert: true },
  );
}

console.log(`Seeded ${destinations.length} destinations, ${stays.length} stays, ${posts.length} posts and 2 demo accounts.`);
await closeDb();
