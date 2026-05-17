import zod from "zod";

export const registerUserSchema = zod.object({
  name: zod.string().min(1, "Full name is required"),
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

export const loginUserSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});
