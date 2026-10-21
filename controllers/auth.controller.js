import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { col } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { PASSWORD_RULE } from '../middleware/validate.js';

const SALT_ROUNDS = 12;

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const publicUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  role: user.role,
  image: user.image || '',
  createdAt: user.createdAt,
});

const nameRule = (label) => ({ type: 'string', required: true, label, min: 2, max: 40 });

export const registerSchema = {
  firstName: nameRule('First name'),
  lastName: nameRule('Last name'),
  email: { type: 'string', required: true, label: 'Email', email: true, max: 120 },
  password: { ...PASSWORD_RULE, required: true, label: 'Password' },
  confirmPassword: { type: 'string', required: true, label: 'Confirm password' },
};

export const loginSchema = {
  email: { type: 'string', required: true, label: 'Email', email: true },
  password: { type: 'string', required: true, label: 'Password' },
};

export const profileSchema = {
  firstName: nameRule('First name'),
  lastName: nameRule('Last name'),
  // Avatars arrive as a small, client-resized data URL so no file storage is required.
  image: {
    type: 'string',
    max: 300_000,
    pattern: /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/,
    message: 'Upload a PNG, JPG or WebP image',
  },
};

export const passwordSchema = {
  currentPassword: { type: 'string', required: true, label: 'Current password' },
  newPassword: { ...PASSWORD_RULE, required: true, label: 'New password' },
  confirmPassword: { type: 'string', required: true, label: 'Confirm password' },
};

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.valid;
  if (password !== confirmPassword) {
    throw new ApiError(422, 'Please fix the highlighted fields', { confirmPassword: 'Passwords do not match' });
  }

  const user = {
    firstName,
    lastName,
    email,
    passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    role: 'user', // admins are never self-assigned
    image: '',
    createdAt: new Date(),
  };
  const { insertedId } = await col('users').insertOne(user);
  user._id = insertedId;

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.valid;
  const user = await col('users').findOne({ email });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) throw new ApiError(401, 'Incorrect email or password');

  res.json({ token: signToken(user), user: publicUser(user) });
});

export const me = (req, res) => res.json({ user: publicUser(req.user) });

export const updateMe = asyncHandler(async (req, res) => {
  const { firstName, lastName, image = '' } = req.valid;
  await col('users').updateOne({ _id: req.user._id }, { $set: { firstName, lastName, image, updatedAt: new Date() } });
  res.json({ user: publicUser({ ...req.user, firstName, lastName, image }) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.valid;
  if (newPassword !== confirmPassword) {
    throw new ApiError(422, 'Please fix the highlighted fields', { confirmPassword: 'Passwords do not match' });
  }
  const user = await col('users').findOne({ _id: req.user._id });
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new ApiError(422, 'Please fix the highlighted fields', { currentPassword: 'Current password is incorrect' });
  }
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await col('users').updateOne({ _id: user._id }, { $set: { passwordHash, updatedAt: new Date() } });
  res.json({ message: 'Password updated' });
});
