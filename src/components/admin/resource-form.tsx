"use client";

import { useActionState, useMemo, useState } from "react";
import type { Category, Resource } from "@/types/database";
import { createResource, updateResource } from "@/lib/actions/resources";
import { defaultSlugFromTitle, validateFile } from "@/lib/validations/resource";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { isExternalDownloadUrl, normalizeExternalDownloadUrl } from "@/lib/utils";

const initialState = { ok: false, message: "" };
const bytesPerMb = 1024 * 1024;

function defaultExternalSizeMb(resource?: Resource) {
  if (!resource || !isExternalDownloadUrl(resource.file_path)) return "";
  return Math.max(resource.file_size / bytesPerMb, 0.01).toFixed(2).replace(/\.?0+$/, "");
}

export function ResourceForm({ categories, resource }: { categories: Category[]; resource?: Resource }) {
  const action = resource ? updateResource : createResource;
  const [state, formAction] = useActionState(action, initialState);
  const [title, setTitle] = useState(resource?.title || "");
  const [slug, setSlug] = useState(resource?.slug || "");
  const [fileError, setFileError] = useState("");
  const [externalUrl, setExternalUrl] = useState(isExternalDownloadUrl(resource?.file_path) ? resource?.file_path || "" : "");

  const suggestedSlug = useMemo(() => defaultSlugFromTitle(title), [title]);

  function validateSelectedFile(file: File | undefined, kind: "resource" | "thumbnail") {
    if (!file || file.size === 0) return "";
    return validateFile(file, kind) || "";
  }

  function validateSelectedFiles(form: HTMLFormElement) {
    const formData = new FormData(form);
    const file = formData.get("file");
    const thumbnail = formData.get("thumbnail");
    const externalDownloadUrl = String(formData.get("external_download_url") || "").trim();
    const externalSize = String(formData.get("external_file_size_mb") || "").trim();
    const hasFile = file instanceof File && file.size > 0;

    if (hasFile && externalDownloadUrl) return "Use either an uploaded file or an external download URL, not both.";
    if (!resource && !hasFile && !externalDownloadUrl) return "Upload a resource file or paste an external download URL.";
    if (externalDownloadUrl && !normalizeExternalDownloadUrl(externalDownloadUrl)) {
      return "Enter a valid external download URL starting with http:// or https://.";
    }
    if (externalDownloadUrl && (!Number.isFinite(Number(externalSize)) || Number(externalSize) <= 0)) {
      return "Enter the external file size in MB.";
    }

    const resourceError = validateSelectedFile(file instanceof File ? file : undefined, "resource");
    if (resourceError) return resourceError;
    return validateSelectedFile(thumbnail instanceof File ? thumbnail : undefined, "thumbnail");
  }

  return (
    <form
      action={formAction}
      className="grid gap-5"
      onSubmit={(event) => {
        const error = validateSelectedFiles(event.currentTarget);
        setFileError(error);
        if (error) event.preventDefault();
      }}
    >
      {resource ? <input type="hidden" name="id" value={resource.id} /> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title">
          <Input
            name="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!resource && (!slug || slug === suggestedSlug)) setSlug(defaultSlugFromTitle(event.target.value));
            }}
            required
          />
        </Field>
        <Field label="Slug" hint="Lowercase letters, numbers and hyphens. Duplicates are made unique automatically.">
          <Input name="slug" value={slug || suggestedSlug} onChange={(event) => setSlug(event.target.value)} required />
        </Field>
      </div>
      <Field label="Description">
        <Textarea name="description" defaultValue={resource?.description || ""} required />
      </Field>
      <Field label="How to use">
        <Textarea name="instructions" defaultValue={resource?.instructions || ""} placeholder="One step per line works well." />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Category">
          <Select name="category_id" defaultValue={resource?.category_id || ""}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Related YouTube URL">
          <Input name="youtube_url" type="url" defaultValue={resource?.youtube_url || ""} placeholder="https://www.youtube.com/watch?v=..." />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={resource ? "Replace resource file" : "Resource file"} hint="Use this for files up to 100 MB.">
          <Input
            name="file"
            type="file"
            required={!resource && !externalUrl.trim()}
            onChange={(event) => setFileError(validateSelectedFile(event.currentTarget.files?.[0], "resource"))}
          />
        </Field>
        <Field label={resource ? "Replace thumbnail" : "Thumbnail"}>
          <Input
            name="thumbnail"
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={(event) => setFileError(validateSelectedFile(event.currentTarget.files?.[0], "thumbnail"))}
          />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-[1fr_180px]">
        <Field label="External download URL" hint="Use this for large files hosted on Drive, Dropbox, S3, or another file host.">
          <Input
            name="external_download_url"
            type="url"
            value={externalUrl}
            onChange={(event) => {
              setExternalUrl(event.currentTarget.value);
              setFileError("");
            }}
            placeholder="https://..."
          />
        </Field>
        <Field label="External size (MB)" hint="Example: 4096 for 4 GB.">
          <Input
            name="external_file_size_mb"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={defaultExternalSizeMb(resource)}
            required={Boolean(externalUrl.trim())}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="is_published" type="checkbox" defaultChecked={resource?.is_published ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="is_featured" type="checkbox" defaultChecked={resource?.is_featured ?? false} />
          Featured
        </label>
      </div>
      {fileError || state.message ? (
        <p className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
          {fileError || state.message}
        </p>
      ) : null}
      <SubmitButton disabled={Boolean(fileError)}>{resource ? "Save Changes" : "Create Resource"}</SubmitButton>
    </form>
  );
}
