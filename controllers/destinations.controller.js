import { col } from '../config/db.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { escapeRegex, getPagination, getSort, pageResult, slugify } from '../utils/helpers.js';

const pathRule = (label, required = false) => ({
  type: 'string',
  label,
  required,
  max: 300,
  pattern: /^(https?:\/\/|\/)[^\s]+$/,
  message: `${label} must be a link or a path starting with /`,
});

export const destinationSchema = {
  name: { type: 'string', required: true, label: 'Name', min: 3, max: 60 },
  category: { type: 'string', required: true, label: 'Category', min: 3, max: 40 },
  region: { type: 'string', required: true, label: 'Region', min: 3, max: 80 },
  summary: { type: 'string', required: true, label: 'Summary', min: 20, max: 260 },
  overview: { type: 'string', required: true, label: 'Overview', min: 40, max: 2000 },
  image: pathRule('Card image', true),
  heroImage: pathRule('Hero image'),
  lat: { type: 'number', required: true, label: 'Latitude', min: -90, max: 90 },
  lng: { type: 'number', required: true, label: 'Longitude', min: -180, max: 180 },
};

export const listDestinations = asyncHandler(async (req, res) => {
  const pager = getPagination(req.query, 12, 50);
  const filter = {};
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
    filter.$or = [{ name: rx }, { region: rx }];
  }
  const sort = getSort(req.query, ['name', 'category', 'region', 'createdAt'], { createdAt: 1 });
  const dest = col('destinations');
  const [items, total] = await Promise.all([
    dest.find(filter).sort(sort).skip(pager.skip).limit(pager.limit).toArray(),
    dest.countDocuments(filter),
  ]);
  res.json(pageResult(items, total, pager));
});

export const listCategories = asyncHandler(async (_req, res) => {
  const [dests, stays] = await Promise.all([
    col('destinations').aggregate([{ $group: { _id: '$category', destinations: { $sum: 1 }, image: { $first: '$image' } } }, { $sort: { _id: 1 } }]).toArray(),
    col('stays').aggregate([{ $group: { _id: '$category', stays: { $sum: 1 } } }]).toArray(),
  ]);
  const stayCount = Object.fromEntries(stays.map((s) => [s._id, s.stays]));
  res.json({ items: dests.map((d) => ({ category: d._id, destinations: d.destinations, stays: stayCount[d._id] || 0, image: d.image })) });
});

export const getDestination = asyncHandler(async (req, res) => {
  const destination = await col('destinations').findOne({ slug: req.params.slug });
  if (!destination) throw new ApiError(404, 'Destination not found');
  res.json({ destination });
});

export const createDestination = asyncHandler(async (req, res) => {
  const doc = { ...req.valid, heroImage: req.valid.heroImage || req.valid.image, slug: slugify(req.valid.name), createdAt: new Date() };
  await col('destinations').insertOne(doc);
  res.status(201).json({ destination: doc });
});

export const updateDestination = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const changes = { ...req.valid, heroImage: req.valid.heroImage || req.valid.image, updatedAt: new Date() };
  const { matchedCount } = await col('destinations').updateOne({ slug }, { $set: changes });
  if (!matchedCount) throw new ApiError(404, 'Destination not found');
  // Stays keep a denormalised copy of the destination name/category for fast listing.
  await col('stays').updateMany({ destination: slug }, { $set: { location: changes.name, category: changes.category } });
  res.json({ message: 'Destination updated' });
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (await col('stays').countDocuments({ destination: slug }, { limit: 1 })) {
    throw new ApiError(409, 'This destination still has stays. Delete or move them first.');
  }
  const { deletedCount } = await col('destinations').deleteOne({ slug });
  if (!deletedCount) throw new ApiError(404, 'Destination not found');
  res.json({ message: 'Destination deleted' });
});
