import { MongoClient } from 'mongodb';
import { env } from './env.js';

let client;
let db;

/** Opens the MongoDB connection and makes sure the indexes the API relies on exist. */
export async function connectDb() {
  client = new MongoClient(env.mongoUri);
  await client.connect();
  db = client.db(env.dbName);

  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('destinations').createIndex({ slug: 1 }, { unique: true }),
    db.collection('posts').createIndex({ slug: 1 }, { unique: true }),
    db.collection('newsletter').createIndex({ email: 1 }, { unique: true }),
    db.collection('reviews').createIndex({ stayId: 1, userId: 1 }, { unique: true }),
    db.collection('stays').createIndex({ destination: 1, pricePerNight: 1 }),
    db.collection('bookings').createIndex({ userId: 1, createdAt: -1 }),
  ]);
  return db;
}

export const col = (name) => {
  if (!db) throw new Error('Database is not connected');
  return db.collection(name);
};

export async function closeDb() {
  await client?.close();
}
