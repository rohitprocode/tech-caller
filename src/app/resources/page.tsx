import type { Metadata } from "next";
import { ResourceFilters } from "@/components/resources/resource-filters";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { Pagination } from "@/components/resources/pagination";
import { AdInArticle, AffiliateSlot, NativeBannerSlot } from "@/components/ads/ad-slots";
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
      <div className="mb-8">
        <h1 className="text-4xl font-black">Resources</h1>
        <p className="mt-3 max-w-2xl text-muted">Find downloads connected to Tech Caller tutorials.</p>
      </div>
      <ResourceFilters categories={categories} search={search} category={category} sort={sort} />
      <div className="my-8">
        <NativeBannerSlot />
      </div>
      <ResourceGrid resources={list.resources} />
      <div className="my-8">
        <AdInArticle />
      </div>
      <div className="mb-8">
        <AffiliateSlot />
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
