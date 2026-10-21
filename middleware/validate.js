import { ApiError } from './error.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Schema-based request validation. Trims strings, coerces numbers/dates and
 * exposes the cleaned values on req.valid. Failures return 422 with a
 * field -> message map the forms render next to each input.
 *
 * Rule options: type (string|number|date|array|boolean), required, label,
 * min, max, int, email, enum, pattern + message, item (array element check).
 */
export function validate(schema) {
  return (req, _res, next) => {
    const input = req.body ?? {};
    const out = {};
    const errors = {};

    for (const [key, rule] of Object.entries(schema)) {
      const label = rule.label || key;
      let value = input[key];
      if (typeof value === 'string') value = value.trim();

      if (value === undefined || value === null || value === '') {
        if (rule.required) errors[key] = `${label} is required`;
        else if (rule.default !== undefined) out[key] = rule.default;
        continue;
      }

      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') errors[key] = `${label} must be text`;
          else if (rule.min && value.length < rule.min) errors[key] = `${label} must be at least ${rule.min} characters`;
          else if (rule.max && value.length > rule.max) errors[key] = `${label} must be at most ${rule.max} characters`;
          else if (rule.email && !EMAIL.test(value)) errors[key] = 'Enter a valid email address';
          else if (rule.enum && !rule.enum.includes(value)) errors[key] = `${label} must be one of: ${rule.enum.join(', ')}`;
          else if (rule.pattern && !rule.pattern.test(value)) errors[key] = rule.message || `${label} is not valid`;
          else out[key] = rule.email ? value.toLowerCase() : value;
          break;
        case 'number': {
          const num = Number(value);
          if (!Number.isFinite(num)) errors[key] = `${label} must be a number`;
          else if (rule.int && !Number.isInteger(num)) errors[key] = `${label} must be a whole number`;
          else if (rule.min !== undefined && num < rule.min) errors[key] = `${label} must be at least ${rule.min}`;
          else if (rule.max !== undefined && num > rule.max) errors[key] = `${label} must be at most ${rule.max}`;
          else out[key] = num;
          break;
        }
        case 'date': {
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) errors[key] = `${label} must be a valid date`;
          else out[key] = date;
          break;
        }
        case 'array': {
          const list = Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : null;
          if (!list) errors[key] = `${label} must be a list`;
          else if (rule.max && list.length > rule.max) errors[key] = `${label} can have at most ${rule.max} items`;
          else if (rule.required && !list.length) errors[key] = `${label} is required`;
          else if (rule.item && !list.every(rule.item)) errors[key] = rule.message || `${label} has an invalid entry`;
          else out[key] = list;
          break;
        }
        case 'boolean':
          out[key] = value === true || value === 'true';
          break;
        default:
          out[key] = value;
      }
    }

    if (Object.keys(errors).length) return next(new ApiError(422, 'Please fix the highlighted fields', errors));
    req.valid = out;
    next();
  };
}

export const PASSWORD_RULE = {
  type: 'string',
  min: 8,
  max: 72,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
  message: 'Password needs an uppercase letter, a lowercase letter and a number',
};

export const isUrlOrPath = (v) => /^(https?:\/\/|\/)[^\s]+$/.test(v);
