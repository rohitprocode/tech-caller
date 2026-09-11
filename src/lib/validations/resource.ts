import { z } from "zod";
import { siteConfig } from "@/lib/config";
import { fileExtension, normalizeYouTubeUrl, slugify } from "@/lib/utils";

const baseResourceSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  description: z.string().trim().min(20, "Description must be at least 20 characters.").max(1000),
  instructions: z.string().trim().max(4000).optional().nullable(),
  category_id: z.string().uuid("Choose a valid category.").optional().nullable(),
  youtube_url: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => normalizeYouTubeUrl(value || null))
    .refine((value) => value === null || value.startsWith("https://www.youtube.com/watch?v="), {
      message: "Enter a valid YouTube watch URL."
    }),
  is_featured: z.boolean(),
  is_published: z.boolean()
});

export const resourceCreateSchema = baseResourceSchema;
export const resourceUpdateSchema = baseResourceSchema.extend({
  id: z.string().uuid()
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required.").max(80),
  slug: z
    .string()
    .trim()
    .min(2, "Category slug is required.")
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  description: z.string().trim().max(500).optional().nullable()
});

export function validateFile(file: File, kind: "resource" | "thumbnail" = "resource") {
  const maxSize = kind === "thumbnail" ? siteConfig.maxThumbnailSize : siteConfig.maxFileSize;
  const extension = fileExtension(file.name);

  if (file.size <= 0) return "The selected file is empty.";
  if (file.size > maxSize) return `The selected file is larger than ${Math.round(maxSize / 1024 / 1024)} MB.`;
  if (kind === "thumbnail" && !["png", "jpg", "jpeg", "svg"].includes(extension)) {
    return "Thumbnails must be PNG, JPG, JPEG or SVG files.";
  }
  if (kind === "resource" && !siteConfig.allowedExtensions.includes(extension as never)) {
    return "This file extension is not allowed.";
  }
  if (kind === "resource" && file.type && !siteConfig.allowedMimeTypes.includes(file.type as never)) {
    return "This file type is not allowed.";
  }
  return null;
}

export function defaultSlugFromTitle(title: string) {
  return slugify(title) || "resource";
}
