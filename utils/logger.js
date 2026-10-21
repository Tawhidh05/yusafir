import { env } from '../config/env.js';

/** Console output is limited to development; production only reports unexpected errors. */
export const logger = {
  info: (...args) => !env.isProd && console.log(...args),
  error: (...args) => console.error(...args),
};
