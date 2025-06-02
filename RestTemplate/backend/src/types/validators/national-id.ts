import { z } from "zod";

/**
 * Zod schema for validating Rwandan National ID numbers.
 * Rwandan National IDs are typically 16 digits long and consist only of numbers.
 */
export const rwandaNationalIdSchema = z
  .string()
  .trim() 
  .length(16, {
    message: "Rwandan National ID must be exactly 16 characters long.",
  })
  .regex(/^\d{16}$/, {
    message: "Rwandan National ID must contain only digits (0-9).",
  });
  