import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
});

export const signInSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const taskInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(10000).default(""),
});

export type TaskInput = z.infer<typeof taskInputSchema>;