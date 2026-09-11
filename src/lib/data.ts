import { unstable_noStore as noStore } from "next/cache";
import { siteConfig, hasSupabasePublicEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Category, DownloadEvent, Resource } from "@/types/database";

export type ResourceListParams = {
  search?: string;
  category?: string;
  sort?: "newest" | "downloads";
  page?: number;
  pageSize?: number;
  includeUnpublished?: boolean;
};

export async function getCategories() {
  noStore();
  if (!hasSupabasePublicEnv()) return [] as Category[];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) return [];
    return (data || []) as Category[];
  } catch {
    return [] as Category[];
  }
}

export async function getCategoryById(id: string) {
  noStore();
  if (!hasSupabasePublicEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) return null;
  return data as Category;
}

export async function getResourceBySlug(slug: string) {
  noStore();
  if (!hasSupabasePublicEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data as Resource;
}

export async function getAdminResourceById(id: string) {
  noStore();
  if (!hasSupabasePublicEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("resources").select("*, categories(*)").eq("id", id).single();
  if (error) return null;
  return data as Resource;
}

export async function getResourceList(params: ResourceListParams = {}) {
  noStore();
  if (!hasSupabasePublicEnv()) {
    return { resources: [] as Resource[], count: 0, page: 1, pageSize: siteConfig.paginationSize };
  }

  const page = Math.max(1, params.page || 1);
  const pageSize = params.pageSize || siteConfig.paginationSize;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClient();

  let query = supabase.from("resources").select("*, categories(*)", { count: "exact" });

  if (!params.includeUnpublished) query = query.eq("is_published", true);
  if (params.search) {
    const term = params.search.replace(/[%_,]/g, "");
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }
  if (params.category) {
    const { data: category } = await supabase.from("categories").select("id").eq("slug", params.category).maybeSingle();
    if (category?.id) query = query.eq("category_id", category.id);
    else return { resources: [] as Resource[], count: 0, page, pageSize };
  }

  if (params.sort === "downloads") query = query.order("download_count", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, count, error } = await query.range(from, to);
  if (error) return { resources: [] as Resource[], count: 0, page, pageSize };
  return { resources: (data || []) as Resource[], count: count || 0, page, pageSize };
}

export async function getFeaturedResources(limit = 6) {
  noStore();
  if (!hasSupabasePublicEnv()) return [] as Resource[];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*, categories(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []) as Resource[];
}

export async function getCategoryWithResources(slug: string, page = 1) {
  noStore();
  if (!hasSupabasePublicEnv()) return null;
  const supabase = await createClient();
  const { data: category, error } = await supabase.from("categories").select("*").eq("slug", slug).single();
  if (error || !category) return null;
  const list = await getResourceList({ category: slug, page });
  return { category: category as Category, ...list };
}

export async function getAdminStats() {
  noStore();
  if (!hasSupabasePublicEnv()) {
    return {
      totalResources: 0,
      publishedResources: 0,
      totalDownloads: 0,
      categories: 0,
      featuredResources: 0,
      recentResources: [] as Resource[],
      topResources: [] as Resource[],
      recentDownloads: [] as DownloadEvent[]
    };
  }
  const supabase = await createClient();
  const [
    totalResources,
    publishedResources,
    categories,
    featuredResources,
    totalDownloadEvents,
    recentResources,
    topResources,
    recentDownloads
  ] = await Promise.all([
    supabase.from("resources").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("id", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("download_events").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("*, categories(*)").order("created_at", { ascending: false }).limit(5),
    supabase.from("resources").select("*, categories(*)").order("download_count", { ascending: false }).limit(5),
    supabase.from("download_events").select("*").order("created_at", { ascending: false }).limit(10)
  ]);

  return {
    totalResources: totalResources.count || 0,
    publishedResources: publishedResources.count || 0,
    totalDownloads: totalDownloadEvents.count || 0,
    categories: categories.count || 0,
    featuredResources: featuredResources.count || 0,
    recentResources: (recentResources.data || []) as Resource[],
    topResources: (topResources.data || []) as Resource[],
    recentDownloads: (recentDownloads.data || []) as DownloadEvent[]
  };
}
