import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name").max(80),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SORT_OPTIONS = [
  "recommended",
  "price_asc",
  "price_desc",
  "rating_desc",
  "newest",
] as const;

export const courseQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(""),
  grade: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().max(60).optional().default(""),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(SORT_OPTIONS).optional().default("recommended"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(48).optional().default(12),
});

export type CourseQuery = z.infer<typeof courseQuerySchema>;
