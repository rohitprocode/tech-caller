import Link from "next/link";
import { Edit, Eye, EyeOff, Star, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button, ButtonLink } from "@/components/ui/button";
import { deleteResource, toggleResourceFlag } from "@/lib/actions/resources";
import { requireAdmin } from "@/lib/auth/admin";
import { getCategories, getResourceList } from "@/lib/data";
import { Input, Select } from "@/components/ui/field";
import { formatBytes, formatDate } from "@/lib/utils";

export default async function AdminResourcesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = params.sort === "downloads" ? "downloads" : "newest";
  const page = typeof params.page === "string" ? Number(params.page) || 1 : 1;
  const [categories, list] = await Promise.all([
    getCategories(),
    getResourceList({ search, category, sort, page, includeUnpublished: true })
  ]);

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Resources</h1>
          <p className="mt-1 text-sm text-muted">Create, edit, publish and feature downloads.</p>
        </div>
        <ButtonLink href="/admin/resources/new">Add Resource</ButtonLink>
      </div>
      <form className="mb-5 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_220px_180px_auto]">
        <Input name="search" defaultValue={search} placeholder="Search resources" />
        <Select name="category" defaultValue={category} aria-label="Category filter">
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select name="sort" defaultValue={sort} aria-label="Sort resources">
          <option value="newest">Newest</option>
          <option value="downloads">Most downloaded</option>
        </Select>
        <Button type="submit">Filter</Button>
      </form>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Downloads</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.resources.map((resource) => (
              <tr key={resource.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/resources/${resource.slug}`} className="font-semibold hover:text-accent-strong">
                    {resource.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{resource.categories?.name || "None"}</td>
                <td className="px-4 py-3">{resource.is_published ? "Published" : "Draft"}</td>
                <td className="px-4 py-3">{resource.is_featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{resource.download_count}</td>
                <td className="px-4 py-3 text-muted">{formatBytes(resource.file_size)}</td>
                <td className="px-4 py-3 text-muted">{formatDate(resource.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/admin/resources/${resource.id}/edit`} variant="secondary" className="h-9 px-3">
                      <Edit aria-hidden className="h-4 w-4" />
                      Edit
                    </ButtonLink>
                    <form action={toggleResourceFlag}>
                      <input type="hidden" name="id" value={resource.id} />
                      <input type="hidden" name="field" value="is_published" />
                      <input type="hidden" name="value" value={String(!resource.is_published)} />
                      <Button variant="secondary" className="h-9 px-3">
                        {resource.is_published ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}
                        {resource.is_published ? "Unpublish" : "Publish"}
                      </Button>
                    </form>
                    <form action={toggleResourceFlag}>
                      <input type="hidden" name="id" value={resource.id} />
                      <input type="hidden" name="field" value="is_featured" />
                      <input type="hidden" name="value" value={String(!resource.is_featured)} />
                      <Button variant="secondary" className="h-9 px-3">
                        <Star aria-hidden className="h-4 w-4" />
                        {resource.is_featured ? "Unfeature" : "Feature"}
                      </Button>
                    </form>
                    <form action={deleteResource}>
                      <input type="hidden" name="id" value={resource.id} />
                      <ConfirmButton message="Are you sure you want to delete this resource?" className="h-9 px-3">
                        <Trash2 aria-hidden className="sr-only" />
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
