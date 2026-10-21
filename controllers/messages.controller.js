import { col } from '../config/db.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { escapeRegex, getPagination, getSort, pageResult, toObjectId } from '../utils/helpers.js';

export const contactSchema = {
  name: { type: 'string', required: true, label: 'Name', min: 2, max: 80 },
  email: { type: 'string', required: true, label: 'Email', email: true, max: 120 },
  subject: { type: 'string', required: true, label: 'Subject', min: 3, max: 120 },
  message: { type: 'string', required: true, label: 'Message', min: 10, max: 2000 },
};

export const newsletterSchema = {
  email: { type: 'string', required: true, label: 'Email', email: true, max: 120 },
};

export const createMessage = asyncHandler(async (req, res) => {
  await col('messages').insertOne({ ...req.valid, createdAt: new Date() });
  res.status(201).json({ message: 'Thanks for reaching out. We will reply by email soon.' });
});

export const listMessages = asyncHandler(async (req, res) => {
  const pager = getPagination(req.query);
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { subject: rx }];
  }
  const sort = getSort(req.query, ['name', 'email', 'subject', 'createdAt']);
  const messages = col('messages');
  const [items, total] = await Promise.all([
    messages.find(filter).sort(sort).skip(pager.skip).limit(pager.limit).toArray(),
    messages.countDocuments(filter),
  ]);
  res.json(pageResult(items, total, pager));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { deletedCount } = await col('messages').deleteOne({ _id: toObjectId(req.params.id, 'message id') });
  if (!deletedCount) throw new ApiError(404, 'Message not found');
  res.json({ message: 'Message deleted' });
});

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.valid;
  const { upsertedCount } = await col('newsletter').updateOne({ email }, { $setOnInsert: { email, createdAt: new Date() } }, { upsert: true });
  res.status(upsertedCount ? 201 : 200).json({
    message: upsertedCount ? 'You are subscribed. Watch your inbox for travel updates.' : 'You are already subscribed.',
  });
});
