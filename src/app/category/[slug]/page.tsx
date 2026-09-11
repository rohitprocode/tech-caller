import { notFound } from "next/navigation";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { Pagination } from "@/components/resources/pagination";
import { getCategoryWithResources } from "@/lib/data";

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = typeof query.page === "string" ? Number(query.page) || 1 : 1;
  const result = await getCategoryWithResources(slug, page);
  if (!result) notFound();

  return (
    <section className="container-shell py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-accent-strong">Category</p>
        <h1 className="mt-2 text-4xl font-black">{result.category.name}</h1>
        {result.category.description ? <p className="mt-3 max-w-2xl text-muted">{result.category.description}</p> : null}
      </div>
      <ResourceGrid resources={result.resources} />
      <Pagination basePath={`/category/${slug}`} page={result.page} pageSize={result.pageSize} count={result.count} params={{}} />
    </section>
  );
}
