import { z } from "zod";

export const changelogSchema = z.object({
  version: z.string().min(1, "Version is required"),
  changes: z.string().min(1, "Changes description is required"),
  releaseDate: z.string().or(z.date()).optional(),
});

export const changelogUpdateSchema = changelogSchema.partial();

export type ChangelogInput = z.infer<typeof changelogSchema>;
export type ChangelogUpdateInput = z.infer<typeof changelogUpdateSchema>;

