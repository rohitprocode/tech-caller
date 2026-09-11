import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/data";
import { hasSupabasePublicEnv, siteConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

async function getSitemapResources() {
  if (!hasSupabasePublicEnv()) return [] as Array<{ slug: string; updated_at: string }>;

  const supabase = await createClient();
  const pageSize = 500;
  let page = 0;
  const resources: Array<{ slug: string; updated_at: string }> = [];

  while (true) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("resources")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error || !data?.length) break;
    resources.push(...(data as Array<{ slug: string; updated_at: string }>));
    if (data.length < pageSize) break;
    page += 1;
  }

  return resources;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const staticRoutes = ["", "/resources", "/work-with-us", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
  const [categories, resources] = await Promise.all([getCategories(), getSitemapResources()]);
  return [
    ...staticRoutes,
    ...categories.map((category) => ({ url: `${base}/category/${category.slug}`, lastModified: new Date(category.updated_at) })),
    ...resources.map((resource) => ({ url: `${base}/resources/${resource.slug}`, lastModified: new Date(resource.updated_at) }))
  ];
}
