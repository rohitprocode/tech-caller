import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/admin";
import { siteConfig } from "@/lib/config";

export default async function AdminSettingsPage() {
  await requireAdmin();
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="mt-1 text-sm text-muted">Runtime configuration is read from environment variables.</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <dl className="grid gap-4 text-sm">
          <div className="grid gap-1">
            <dt className="font-semibold">Site title</dt>
            <dd className="text-muted">{siteConfig.name}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold">Site description</dt>
            <dd className="text-muted">{siteConfig.description}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold">YouTube channel URL</dt>
            <dd className="break-all text-muted">{siteConfig.youtubeChannelUrl}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold">Resource page size</dt>
            <dd className="text-muted">{siteConfig.paginationSize}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-semibold">AdSense</dt>
            <dd className="text-muted">{siteConfig.adsense.client ? "Configured" : "Disabled until environment variables are set"}</dd>
          </div>
        </dl>
      </div>
    </AdminShell>
  );
}
