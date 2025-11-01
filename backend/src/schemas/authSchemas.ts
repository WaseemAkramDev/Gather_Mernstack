import { z } from "zod";

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(32, "Username must be at most 32 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters")
      .refine(
        (v) => /[a-z]/.test(v),
        "Password must contain a lowercase letter"
      )
      .refine(
        (v) => /[A-Z]/.test(v),
        "Password must contain an uppercase letter"
      )
      .refine((v) => /\d/.test(v), "Password must contain a number"),
    type: z.enum(["admin", "user"]).default("user"),
  })
  .strict(); // disallow extra fields

export type SignupInput = z.infer<typeof signupSchema>;
