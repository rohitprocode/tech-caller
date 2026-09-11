import Link from "next/link";
import { Folder, LayoutDashboard, LogOut, Plus, Settings } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/resources", label: "Resources", icon: Folder },
  { href: "/admin/resources/new", label: "Add Resource", icon: Plus },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="container-shell grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-lg border border-border bg-card p-3 lg:sticky lg:top-24 lg:self-start">
        <nav className="grid gap-1" aria-label="Admin">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="focus-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted hover:bg-surface hover:text-foreground">
                <Icon aria-hidden className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logout} className="mt-3 border-t border-border pt-3">
          <Button variant="ghost" className="w-full justify-start">
            <LogOut aria-hidden className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </aside>
      <div>{children}</div>
    </section>
  );
}
