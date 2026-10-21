import { logger } from '../utils/logger.js';

export class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors; // field -> message map for form validation errors
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let { status = 500, message, errors = null } = err;

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    message = `That ${field} is already in use`;
    errors = { [field]: message };
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'The request is too large';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'The request body is not valid JSON';
  }

  if (status >= 500) {
    logger.error(err);
    message = 'Something went wrong on our side. Please try again.';
  }
  res.status(status).json({ message, errors });
};
