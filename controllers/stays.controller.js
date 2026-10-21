import { col } from '../config/db.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { isUrlOrPath } from '../middleware/validate.js';
import { escapeRegex, getPagination, getSort, pageResult, toObjectId } from '../utils/helpers.js';

export const staySchema = {
  title: { type: 'string', required: true, label: 'Title', min: 5, max: 100 },
  destination: { type: 'string', required: true, label: 'Destination' },
  description: { type: 'string', required: true, label: 'Short description', min: 20, max: 200 },
  overview: { type: 'string', required: true, label: 'Overview', min: 40, max: 3000 },
  pricePerNight: { type: 'number', required: true, label: 'Price per night', min: 1, max: 10000 },
  guests: { type: 'number', required: true, label: 'Guests', int: true, min: 1, max: 20 },
  bedrooms: { type: 'number', required: true, label: 'Bedrooms', int: true, min: 0, max: 20 },
  beds: { type: 'number', required: true, label: 'Beds', int: true, min: 1, max: 30 },
  baths: { type: 'number', required: true, label: 'Baths', int: true, min: 1, max: 20 },
  amenities: { type: 'array', required: true, label: 'Amenities', max: 20 },
  images: { type: 'array', required: true, label: 'Images', max: 8, item: isUrlOrPath, message: 'Each image must be a link or a path starting with /' },
  flexibleCancellation: { type: 'boolean', default: false },
  featured: { type: 'boolean', default: false },
};

export const reviewSchema = {
  rating: { type: 'number', required: true, label: 'Rating', int: true, min: 1, max: 5 },
  comment: { type: 'string', required: true, label: 'Review', min: 10, max: 600 },
};

const num = (value) => (value !== undefined && value !== '' && Number.isFinite(Number(value)) ? Number(value) : null);

export const listStays = asyncHandler(async (req, res) => {
  const { q, destination, category, featured } = req.query;
  const pager = getPagination(req.query, 6, 24);
  const filter = {};

  if (q) {
    const rx = new RegExp(escapeRegex(String(q).slice(0, 60)), 'i');
    filter.$or = [{ title: rx }, { location: rx }, { description: rx }];
  }
  if (destination) filter.destination = String(destination);
  if (category) filter.category = String(category);
  if (featured === 'true') filter.featured = true;
  if (num(req.query.maxPrice) !== null) filter.pricePerNight = { $lte: num(req.query.maxPrice) };
  if (num(req.query.minRating) !== null) filter.ratingAvg = { $gte: num(req.query.minRating) };
  if (num(req.query.guests) !== null) filter.guests = { $gte: num(req.query.guests) };

  const sort = getSort(req.query, ['title', 'location', 'pricePerNight', 'ratingAvg', 'guests', 'createdAt']);
  const stays = col('stays');
  const [items, total] = await Promise.all([
    stays.find(filter).sort(sort).skip(pager.skip).limit(pager.limit).toArray(),
    stays.countDocuments(filter),
  ]);
  res.json(pageResult(items, total, pager));
});

export const getStay = asyncHandler(async (req, res) => {
  const _id = toObjectId(req.params.id, 'stay id');
  const stay = await col('stays').findOne({ _id });
  if (!stay) throw new ApiError(404, 'Stay not found');
  const related = await col('stays')
    .find({ destination: stay.destination, _id: { $ne: _id } })
    .sort({ ratingAvg: -1 })
    .limit(4)
    .toArray();
  res.json({ stay, related });
});

async function resolveDestination(slug) {
  const destination = await col('destinations').findOne({ slug });
  if (!destination) throw new ApiError(422, 'Please fix the highlighted fields', { destination: 'Choose an existing destination' });
  return { destination: slug, location: destination.name, category: destination.category };
}

export const createStay = asyncHandler(async (req, res) => {
  const place = await resolveDestination(req.valid.destination);
  const doc = { ...req.valid, ...place, ratingAvg: 0, ratingCount: 0, createdBy: req.user._id, createdAt: new Date() };
  const { insertedId } = await col('stays').insertOne(doc);
  res.status(201).json({ stay: { ...doc, _id: insertedId } });
});

export const updateStay = asyncHandler(async (req, res) => {
  const _id = toObjectId(req.params.id, 'stay id');
  const place = await resolveDestination(req.valid.destination);
  const { matchedCount } = await col('stays').updateOne({ _id }, { $set: { ...req.valid, ...place, updatedAt: new Date() } });
  if (!matchedCount) throw new ApiError(404, 'Stay not found');
  res.json({ message: 'Stay updated' });
});

export const deleteStay = asyncHandler(async (req, res) => {
  const _id = toObjectId(req.params.id, 'stay id');
  const { deletedCount } = await col('stays').deleteOne({ _id });
  if (!deletedCount) throw new ApiError(404, 'Stay not found');
  await col('reviews').deleteMany({ stayId: _id });
  res.json({ message: 'Stay deleted' });
});

export const listReviews = asyncHandler(async (req, res) => {
  const items = await col('reviews').find({ stayId: toObjectId(req.params.id, 'stay id') }).sort({ createdAt: -1 }).limit(50).toArray();
  res.json({ items });
});

export const createReview = asyncHandler(async (req, res) => {
  const stayId = toObjectId(req.params.id, 'stay id');
  const stay = await col('stays').findOne({ _id: stayId });
  if (!stay) throw new ApiError(404, 'Stay not found');
  if (await col('reviews').findOne({ stayId, userId: req.user._id })) {
    throw new ApiError(409, 'You have already reviewed this stay');
  }
  const { rating, comment } = req.valid;
  const review = {
    stayId,
    userId: req.user._id,
    userName: `${req.user.firstName} ${req.user.lastName}`.trim(),
    rating,
    comment,
    createdAt: new Date(),
  };
  await col('reviews').insertOne(review);
  // Running average keeps the stored rating consistent with the review count.
  const count = stay.ratingCount || 0;
  await col('stays').updateOne(
    { _id: stayId },
    { $set: { ratingAvg: ((stay.ratingAvg || 0) * count + rating) / (count + 1) }, $inc: { ratingCount: 1 } },
  );
  res.status(201).json({ review });
});
