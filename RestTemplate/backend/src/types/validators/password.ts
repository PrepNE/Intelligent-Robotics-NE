import { z } from 'zod';

/**
 * Zod schema for validating a strong password between 8 and 16 characters.
 * A strong password is defined here as:
 * - At least 8 characters long.
 * - At most 16 characters long.
 * - Contains at least one uppercase letter.
 * - Contains at least one lowercase letter.
 * - Contains at least one digit.
 * - Contains at least one special character (non-alphanumeric).
 */
export const strongPasswordSchema = z.string()
  .min(8, {
    message: 'Password must be at least 8 characters long.'
  })
  .max(16, {
    message: 'Password must be at most 16 characters long.'
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.'
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.'
  })
  .regex(/[0-9]/, {
    message: 'Password must contain at least one number.'
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character (e.g., !@#$%^&*).',
  });