import { z } from "zod";

const rwandanPhoneRegex = /^(?:\+250|0)?(?:(?:7[2389]\d{7})|(?:7\d{8}))$/;

export const rwandaPhoneNumberSchema = z
  .string()
  .trim() // Remove leading/trailing whitespace
  .regex(rwandanPhoneRegex, {
    message:
      "Invalid Rwandan phone number format. Expected formats: 07xxxxxxxx, +2507xxxxxxxx, or 7xxxxxxxx.",
  })
  .refine(
    (value) => {
      const cleanedValue = value.replace(/^\+250|^0/, "");
      return cleanedValue.length === 9 && cleanedValue.startsWith("7");
    },
    {
      message:
        "Rwandan phone numbers must be 9 digits long after the country code (+250) or leading zero (0), and must start with 7.",
    }
  );
