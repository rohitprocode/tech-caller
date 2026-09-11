import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ResourceForm } from "@/components/admin/resource-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminResourceById, getCategories } from "@/lib/data";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [resource, categories] = await Promise.all([getAdminResourceById(id), getCategories()]);
  if (!resource) notFound();
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Edit Resource</h1>
        <p className="mt-1 text-sm text-muted">Update details or replace the stored file safely.</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <ResourceForm categories={categories} resource={resource} />
      </div>
    </AdminShell>
  );
}
