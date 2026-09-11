import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryForm } from "@/components/admin/category-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getCategoryById } from "@/lib/data";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Edit Category</h1>
        <p className="mt-1 text-sm text-muted">Update how this category appears across public resource pages.</p>
      </div>
      <div className="max-w-xl rounded-lg border border-border bg-card p-5">
        <CategoryForm category={category} />
      </div>
    </AdminShell>
  );
}
