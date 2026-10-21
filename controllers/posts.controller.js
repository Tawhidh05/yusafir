import { col } from '../config/db.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { getPagination, pageResult } from '../utils/helpers.js';

export const listPosts = asyncHandler(async (req, res) => {
  const pager = getPagination(req.query, 6, 24);
  const filter = ['news', 'guide'].includes(req.query.category) ? { category: req.query.category } : {};
  const posts = col('posts');
  const [items, total] = await Promise.all([
    posts.find(filter, { projection: { content: 0 } }).sort({ publishedAt: -1 }).skip(pager.skip).limit(pager.limit).toArray(),
    posts.countDocuments(filter),
  ]);
  res.json(pageResult(items, total, pager));
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await col('posts').findOne({ slug: req.params.slug });
  if (!post) throw new ApiError(404, 'Article not found');
  res.json({ post });
});
