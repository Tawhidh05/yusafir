import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { col } from '../config/db.js';
import { ApiError, asyncHandler } from './error.js';
import { toObjectId } from '../utils/helpers.js';

/** Verifies the Bearer token and attaches the current user (without password hash) to req.user. */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Please log in to continue');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (err) {
    throw new ApiError(401, err.name === 'TokenExpiredError' ? 'Your session has expired. Please log in again.' : 'Invalid session. Please log in again.');
  }

  const user = await col('users').findOne({ _id: toObjectId(payload.sub) }, { projection: { passwordHash: 0 } });
  if (!user) throw new ApiError(401, 'This account no longer exists');
  req.user = user;
  next();
});

/** Role-based access control: authorize('admin') after authenticate. */
export const authorize = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new ApiError(403, 'You do not have permission to do this'));
