import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceForm } from "@/components/admin/resource-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getCategories } from "@/lib/data";

export default async function NewResourcePage() {
  await requireAdmin();
  const categories = await getCategories();
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Add Resource</h1>
        <p className="mt-1 text-sm text-muted">Upload one downloadable file and connect it to a tutorial.</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <ResourceForm categories={categories} />
      </div>
    </AdminShell>
  );
}
