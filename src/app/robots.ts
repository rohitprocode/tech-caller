import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/admin/*", "/api/private", "/api/private/*"]
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`
  };
}
