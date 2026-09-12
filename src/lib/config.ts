const mb = 1024 * 1024;

export const siteConfig = {
  name: "Tech Caller",
  description: "The home of Tech Caller on YouTube. Explore the channel, find video resources, and get in touch about ideas and collaborations.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  youtubeChannelUrl: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || "https://www.youtube.com/@tech-caller",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "rohit990797@gmail.com",
  paginationSize: 12,
  resourcesBucket: "resources",
  maxFileSize: 100 * mb,
  maxThumbnailSize: 5 * mb,
  allowedMimeTypes: [
    "application/zip",
    "application/x-zip-compressed",
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/svg+xml",
    "text/plain",
    "application/json",
    "application/xml",
    "text/xml",
    "application/vnd.android.package-archive",
    "application/x-msdownload"
  ],
  allowedExtensions: ["zip", "pdf", "png", "jpg", "jpeg", "svg", "txt", "json", "xml", "apk", "exe"],
  adsense: {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
    homeSlot: process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT || "",
    resourceSlot: process.env.NEXT_PUBLIC_ADSENSE_RESOURCE_SLOT || "",
    sidebarSlot: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || ""
  }
} as const;

export function hasSupabasePublicEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function hasSupabaseAdminEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
