import Link from "next/link";
import { Edit, Folder } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteCategory } from "@/lib/actions/resources";
import { requireAdmin } from "@/lib/auth/admin";
import { getCategories } from "@/lib/data";

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const [categories, params] = await Promise.all([getCategories(), searchParams]);
  const error = params.error === "category-in-use";

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Categories</h1>
        <p className="mt-1 text-sm text-muted">Categories are database-driven and can be changed anytime.</p>
      </div>
      {error ? <p className="mb-5 rounded-md border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-amber-100">Move or delete resources before deleting that category.</p> : null}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 text-xl font-bold">New Category</h2>
          <CategoryForm />
        </div>
        <div className="grid gap-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Folder aria-hidden className="h-4 w-4 text-accent" />
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted">/{category.slug}</p>
                  {category.description ? <p className="mt-2 text-sm text-muted">{category.description}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Link className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold hover:bg-surface" href={`/admin/categories/${category.id}/edit`}>
                    <Edit aria-hidden className="h-4 w-4" />
                    Edit
                  </Link>
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <ConfirmButton message="Are you sure you want to delete this category?">Delete</ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
