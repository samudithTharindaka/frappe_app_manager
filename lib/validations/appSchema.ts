import { z } from "zod";

export const appSchema = z.object({
  name: z.string().min(1, "App name is required"),
  clientName: z.string().min(1, "Client/Company name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  githubRepoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  frappeCloudUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  version: z.string().default("1.0.0"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["Active", "Deprecated", "Internal"]).default("Active"),
});

export const appUpdateSchema = appSchema.partial();

export type AppInput = z.infer<typeof appSchema>;
export type AppUpdateInput = z.infer<typeof appUpdateSchema>;

