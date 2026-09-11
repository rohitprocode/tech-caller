import { siteConfig } from "@/lib/config";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export function normalizeYouTubeUrl(raw: string | null | undefined) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/watch?v=${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/watch?v=${id}`;
      if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
        const idFromPath = url.pathname.split("/").filter(Boolean)[1];
        return idFromPath ? `https://www.youtube.com/watch?v=${idFromPath}` : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function getYouTubeId(raw: string | null | undefined) {
  const normalized = normalizeYouTubeUrl(raw);
  if (!normalized) return null;
  return new URL(normalized).searchParams.get("v");
}

export function publicUrl(path: string) {
  return `${siteConfig.siteUrl.replace(/\/$/, "")}${path}`;
}

export function normalizeExternalDownloadUrl(raw: string | null | undefined) {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isExternalDownloadUrl(value: string | null | undefined) {
  return Boolean(normalizeExternalDownloadUrl(value));
}

export function sanitizeFilename(name: string) {
  const fallback = "resource-file";
  const safe = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return safe || fallback;
}

export function fileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}
