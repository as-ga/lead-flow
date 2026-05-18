import { z } from "zod";

// Auth Validation
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Lead Validation
export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  source: z.enum(["website", "instagram", "referral"], {
    message: "Source must be one of website, instagram, or referral",
  }),
  remarks: z.string().optional(),
});

export const updateLeadSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  status: z
    .enum(["new", "contacted", "qualified", "lost"], {
      message: "Status must be one of new, contacted, qualified, or lost",
    })
    .optional(),
  source: z
    .enum(["website", "instagram", "referral"], {
      message: "Source must be one of website, instagram, or referral",
    })
    .optional(),
  remarks: z.string().optional(),
});

// Types for form data
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
