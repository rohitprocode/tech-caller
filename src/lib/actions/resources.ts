"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { categorySchema, resourceCreateSchema, resourceUpdateSchema, validateFile } from "@/lib/validations/resource";
import { isExternalDownloadUrl, normalizeExternalDownloadUrl, sanitizeFilename, slugify } from "@/lib/utils";

type ActionState = {
  ok: boolean;
  message: string;
};

function checkbox(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function externalFileSizeBytes(formData: FormData) {
  const raw = text(formData, "external_file_size_mb").trim();
  if (!raw) return null;
  const sizeMb = Number(raw);
  if (!Number.isFinite(sizeMb) || sizeMb <= 0) return null;
  return Math.round(sizeMb * 1024 * 1024);
}

async function uniqueResourceSlug(slug: string, currentId?: string) {
  const supabase = createAdminClient();
  const base = slugify(slug) || "resource";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const query = supabase.from("resources").select("id").eq("slug", candidate).maybeSingle();
    const { data } = await query;
    if (!data || data.id === currentId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

async function uploadStorageFile(file: File, folder: string) {
  const supabase = createAdminClient();
  const storageName = `${randomUUID()}-${sanitizeFilename(file.name)}`;
  const path = `resources/${folder}/${storageName}`;
  const { error } = await supabase.storage.from(siteConfig.resourcesBucket).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });
  if (error) throw new Error("Failed to upload file to storage.");
  return path;
}

async function removeStorageFile(path: string | null | undefined) {
  if (!path || isExternalDownloadUrl(path)) return;
  const supabase = createAdminClient();
  await supabase.storage.from(siteConfig.resourcesBucket).remove([path]);
}

export async function createResource(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const file = formData.get("file");
  const hasFile = file instanceof File && file.size > 0;
  const externalUrlInput = text(formData, "external_download_url");
  const externalDownloadUrl = normalizeExternalDownloadUrl(externalUrlInput);

  if (!hasFile && !externalUrlInput.trim()) {
    return { ok: false, message: "Upload a resource file or paste an external download URL." };
  }
  if (hasFile && externalUrlInput.trim()) {
    return { ok: false, message: "Use either an uploaded file or an external download URL, not both." };
  }
  if (externalUrlInput.trim() && !externalDownloadUrl) {
    return { ok: false, message: "Enter a valid external download URL starting with http:// or https://." };
  }
  if (hasFile) {
    const fileError = validateFile(file);
    if (fileError) return { ok: false, message: fileError };
  }
  const externalSizeBytes = externalDownloadUrl ? externalFileSizeBytes(formData) : null;
  if (externalDownloadUrl && !externalSizeBytes) {
    return { ok: false, message: "Enter the external file size in MB." };
  }

  const thumbnail = formData.get("thumbnail");
  if (thumbnail instanceof File && thumbnail.size > 0) {
    const thumbnailError = validateFile(thumbnail, "thumbnail");
    if (thumbnailError) return { ok: false, message: thumbnailError };
  }

  const parsed = resourceCreateSchema.safeParse({
    title: text(formData, "title"),
    slug: text(formData, "slug") || text(formData, "title"),
    description: text(formData, "description"),
    instructions: text(formData, "instructions") || null,
    category_id: text(formData, "category_id") || null,
    youtube_url: text(formData, "youtube_url") || null,
    is_featured: checkbox(formData.get("is_featured")),
    is_published: checkbox(formData.get("is_published"))
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Check the form fields." };

  const supabase = createAdminClient();
  const id = randomUUID();
  let filePath: string | null = null;
  let thumbnailPath: string | null = null;

  try {
    filePath = hasFile ? await uploadStorageFile(file, id) : externalDownloadUrl;
    thumbnailPath =
      thumbnail instanceof File && thumbnail.size > 0 ? await uploadStorageFile(thumbnail, `${id}/thumbs`) : null;

    const slug = await uniqueResourceSlug(parsed.data.slug);
    const { error } = await supabase.from("resources").insert({
      id,
      ...parsed.data,
      slug,
      file_path: filePath,
      thumbnail_path: thumbnailPath,
      original_filename: hasFile ? sanitizeFilename(file.name) : "External download",
      file_type: hasFile ? file.type || "application/octet-stream" : "external/link",
      file_size: hasFile ? file.size : externalSizeBytes
    });
    if (error) throw error;
  } catch {
    await removeStorageFile(filePath);
    await removeStorageFile(thumbnailPath);
    return { ok: false, message: "Resource could not be created. Check Supabase setup and try again." };
  }

  revalidatePath("/");
  revalidatePath("/resources");
  redirect("/admin/resources");
}

export async function updateResource(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = resourceUpdateSchema.safeParse({
    id: text(formData, "id"),
    title: text(formData, "title"),
    slug: text(formData, "slug") || text(formData, "title"),
    description: text(formData, "description"),
    instructions: text(formData, "instructions") || null,
    category_id: text(formData, "category_id") || null,
    youtube_url: text(formData, "youtube_url") || null,
    is_featured: checkbox(formData.get("is_featured")),
    is_published: checkbox(formData.get("is_published"))
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Check the form fields." };

  const supabase = createAdminClient();
  const { data: existing } = await supabase.from("resources").select("*").eq("id", parsed.data.id).single();
  if (!existing) return { ok: false, message: "Resource was not found." };

  const replacement = formData.get("file");
  const thumbnail = formData.get("thumbnail");
  const hasReplacement = replacement instanceof File && replacement.size > 0;
  const externalUrlInput = text(formData, "external_download_url");
  const externalDownloadUrl = normalizeExternalDownloadUrl(externalUrlInput);
  let newFilePath: string | null = null;
  let newThumbnailPath: string | null = null;

  if (hasReplacement && externalUrlInput.trim()) {
    return { ok: false, message: "Use either a replacement file or an external download URL, not both." };
  }
  if (externalUrlInput.trim() && !externalDownloadUrl) {
    return { ok: false, message: "Enter a valid external download URL starting with http:// or https://." };
  }
  if (hasReplacement) {
    const error = validateFile(replacement);
    if (error) return { ok: false, message: error };
  }
  const externalSizeBytes = externalDownloadUrl ? externalFileSizeBytes(formData) : null;
  if (externalDownloadUrl && !externalSizeBytes) {
    return { ok: false, message: "Enter the external file size in MB." };
  }
  if (thumbnail instanceof File && thumbnail.size > 0) {
    const error = validateFile(thumbnail, "thumbnail");
    if (error) return { ok: false, message: error };
  }

  try {
    newFilePath =
      hasReplacement ? await uploadStorageFile(replacement, parsed.data.id) : externalDownloadUrl;
    newThumbnailPath =
      thumbnail instanceof File && thumbnail.size > 0 ? await uploadStorageFile(thumbnail, `${parsed.data.id}/thumbs`) : null;

    const slug = await uniqueResourceSlug(parsed.data.slug, parsed.data.id);
    const updatePayload = {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      instructions: parsed.data.instructions,
      category_id: parsed.data.category_id,
      youtube_url: parsed.data.youtube_url,
      is_featured: parsed.data.is_featured,
      is_published: parsed.data.is_published,
      ...(hasReplacement && newFilePath && {
        file_path: newFilePath,
        original_filename: sanitizeFilename((replacement as File).name),
        file_type: (replacement as File).type || "application/octet-stream",
        file_size: (replacement as File).size
      }),
      ...(externalDownloadUrl &&
        externalSizeBytes && {
          file_path: externalDownloadUrl,
          original_filename: "External download",
          file_type: "external/link",
          file_size: externalSizeBytes
        }),
      ...(newThumbnailPath && { thumbnail_path: newThumbnailPath })
    };

    const { error } = await supabase.from("resources").update(updatePayload).eq("id", parsed.data.id);
    if (error) throw error;
    if (newFilePath) await removeStorageFile(existing.file_path);
    if (newThumbnailPath) await removeStorageFile(existing.thumbnail_path);
  } catch {
    await removeStorageFile(newFilePath);
    await removeStorageFile(newThumbnailPath);
    return { ok: false, message: "Changes could not be saved. Check Supabase setup and try again." };
  }

  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath(`/resources/${parsed.data.slug}`);
  redirect("/admin/resources");
}

export async function deleteResource(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = createAdminClient();
  const { data: resource } = await supabase.from("resources").select("*").eq("id", id).single();
  if (!resource) redirect("/admin/resources");

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (!error) {
    await removeStorageFile(resource.file_path);
    await removeStorageFile(resource.thumbnail_path);
  }
  revalidatePath("/");
  revalidatePath("/resources");
  redirect("/admin/resources");
}

export async function toggleResourceFlag(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const field = text(formData, "field");
  const value = checkbox(formData.get("value"));
  if (!["is_featured", "is_published"].includes(field)) redirect("/admin/resources");
  const supabase = createAdminClient();
  await supabase.from("resources").update({ [field]: value }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/resources");
  redirect("/admin/resources");
}

export async function createCategory(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse({
    name: text(formData, "name"),
    slug: text(formData, "slug") || text(formData, "name"),
    description: text(formData, "description") || null
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Check the form fields." };
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").insert({
    ...parsed.data,
    slug: slugify(parsed.data.slug)
  });
  if (error) return { ok: false, message: "Category could not be created. The slug may already exist." };
  revalidatePath("/");
  revalidatePath("/resources");
  redirect("/admin/categories");
}

export async function updateCategory(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = text(formData, "id");
  const parsed = categorySchema.safeParse({
    name: text(formData, "name"),
    slug: text(formData, "slug") || text(formData, "name"),
    description: text(formData, "description") || null
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message || "Check the form fields." };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ ...parsed.data, slug: slugify(parsed.data.slug) })
    .eq("id", id);
  if (error) return { ok: false, message: "Category could not be updated." };
  revalidatePath("/");
  revalidatePath("/resources");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = createAdminClient();
  const { count } = await supabase.from("resources").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (count && count > 0) redirect("/admin/categories?error=category-in-use");
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/resources");
  redirect("/admin/categories");
}
