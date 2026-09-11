import { Download, FileArchive, Folder, Star } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminStats } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();
  const cards = [
    { label: "Total Resources", value: stats.totalResources, icon: FileArchive },
    { label: "Published Resources", value: stats.publishedResources, icon: FileArchive },
    { label: "Total Downloads", value: stats.totalDownloads, icon: Download },
    { label: "Categories", value: stats.categories, icon: Folder },
    { label: "Featured Resources", value: stats.featuredResources, icon: Star }
  ];

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Manage Tech Caller resources and download activity.</p>
        </div>
        <ButtonLink href="/admin/resources/new">Add Resource</ButtonLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5">
            <Icon aria-hidden className="mb-4 h-5 w-5 text-accent" />
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-xl font-bold">Recent Resources</h2>
          <div className="mt-4 grid gap-3">
            {stats.recentResources.map((resource) => (
              <div key={resource.id} className="flex justify-between gap-4 border-b border-border pb-3 text-sm last:border-0">
                <span>{resource.title}</span>
                <span className="text-muted">{resource.is_published ? "Published" : "Draft"}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-xl font-bold">Most Downloaded</h2>
          <div className="mt-4 grid gap-3">
            {stats.topResources.map((resource) => (
              <div key={resource.id} className="flex justify-between gap-4 border-b border-border pb-3 text-sm last:border-0">
                <span>{resource.title}</span>
                <span className="text-muted">{resource.download_count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
