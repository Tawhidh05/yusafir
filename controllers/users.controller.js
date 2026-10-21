import { col } from '../config/db.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { escapeRegex, getPagination, getSort, pageResult, toObjectId } from '../utils/helpers.js';

export const roleSchema = { role: { type: 'string', required: true, label: 'Role', enum: ['user', 'admin'] } };

export const listUsers = asyncHandler(async (req, res) => {
  const pager = getPagination(req.query);
  const filter = {};
  if (['user', 'admin'].includes(req.query.role)) filter.role = req.query.role;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
    filter.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }];
  }
  const sort = getSort(req.query, ['firstName', 'email', 'role', 'createdAt']);
  const users = col('users');
  const [items, total] = await Promise.all([
    users.find(filter, { projection: { passwordHash: 0, image: 0 } }).sort(sort).skip(pager.skip).limit(pager.limit).toArray(),
    users.countDocuments(filter),
  ]);
  res.json(pageResult(items, total, pager));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const _id = toObjectId(req.params.id);
  if (_id.equals(req.user._id)) throw new ApiError(400, 'You cannot change your own role');
  const { matchedCount } = await col('users').updateOne({ _id }, { $set: { role: req.valid.role } });
  if (!matchedCount) throw new ApiError(404, 'User not found');
  res.json({ message: 'Role updated' });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const _id = toObjectId(req.params.id);
  if (_id.equals(req.user._id)) throw new ApiError(400, 'You cannot delete your own account');
  const { deletedCount } = await col('users').deleteOne({ _id });
  if (!deletedCount) throw new ApiError(404, 'User not found');
  await Promise.all([col('bookings').deleteMany({ userId: _id }), col('reviews').deleteMany({ userId: _id })]);
  res.json({ message: 'User deleted' });
});
