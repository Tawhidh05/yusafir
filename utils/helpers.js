import { ObjectId } from 'mongodb';
import { ApiError } from '../middleware/error.js';

export const toObjectId = (value, label = 'id') => {
  if (!ObjectId.isValid(value)) throw new ApiError(400, `Invalid ${label}`);
  return new ObjectId(value);
};

export const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');

/** Reads ?page=&limit= safely and returns the values plus the skip offset. */
export function getPagination(query, defaultLimit = 10, maxLimit = 50) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
}

/** Builds a Mongo sort object from ?sort=field&order=asc|desc limited to an allow-list. */
export function getSort(query, allowed, fallback = { createdAt: -1 }) {
  if (!allowed.includes(query.sort)) return fallback;
  return { [query.sort]: query.order === 'asc' ? 1 : -1, _id: 1 };
}

export const pageResult = (items, total, { page, limit }) => ({
  items,
  total,
  page,
  limit,
  pages: Math.max(Math.ceil(total / limit), 1),
});

/** Whole nights between two dates (UTC midnight based). */
export const nightsBetween = (from, to) => Math.round((to - from) / 86_400_000);
