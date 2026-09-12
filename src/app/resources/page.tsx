import type { Metadata } from "next";
import { Download, Search, ShieldCheck } from "lucide-react";
import { ResourceFilters } from "@/components/resources/resource-filters";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { Pagination } from "@/components/resources/pagination";
import { AdsterraLinkSlot, NativeBannerSlot, SmartLinkSlot } from "@/components/ads/ad-slots";
import { getCategories, getResourceList } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resources",
  description: "Search and download Tech Caller files, tools, templates and tutorial resources.",
  alternates: { canonical: "/resources" }
};

export default async function ResourcesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = params.sort === "downloads" ? "downloads" : "newest";
  const page = typeof params.page === "string" ? Number(params.page) || 1 : 1;
  const [categories, list] = await Promise.all([getCategories(), getResourceList({ search, category, sort, page })]);

  return (
    <section className="container-shell py-12">
      <div className="resource-library-hero mb-8">
        <div>
          <p className="eyebrow">TECH CALLER DOWNLOAD HUB</p>
          <h1>Resources for videos, gaming and practical setup work.</h1>
          <p>Search files connected to Tech Caller tutorials and download what you need without digging through old video descriptions.</p>
        </div>
        <div className="resource-library-points" aria-label="Resource page highlights">
          <span><Search size={17} aria-hidden /> Search by topic</span>
          <span><Download size={17} aria-hidden /> Direct downloads</span>
          <span><ShieldCheck size={17} aria-hidden /> Reviewed resources</span>
        </div>
      </div>
      <ResourceFilters categories={categories} search={search} category={category} sort={sort} />
      <div className="my-8">
        <NativeBannerSlot />
      </div>
      <ResourceGrid resources={list.resources} />
      <div className="my-8">
        <SmartLinkSlot />
      </div>
      <div className="mb-8">
        <AdsterraLinkSlot />
      </div>
      <Pagination
        basePath="/resources"
        page={list.page}
        pageSize={list.pageSize}
        count={list.count}
        params={{ search, category, sort }}
      />
    </section>
  );
}
