import { z } from "zod";

export const docSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  order: z.number().default(0),
  type: z.enum(["readme", "changelog", "custom"]).default("custom"),
});

export const docUpdateSchema = docSchema.partial();

export type DocInput = z.infer<typeof docSchema>;
export type DocUpdateInput = z.infer<typeof docUpdateSchema>;

