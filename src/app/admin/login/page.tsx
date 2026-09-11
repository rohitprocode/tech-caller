import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { hasSupabasePublicEnv } from "@/lib/config";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth/admin";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLoginPage() {
  const [admin, currentUser] = await Promise.all([getCurrentAdmin(), getCurrentUser()]);
  if (admin) redirect("/admin");

  return (
    <section className="container-shell grid min-h-[65vh] content-center py-12">
      <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6">
        <h1 className="text-2xl font-black">Admin Login</h1>
        <p className="mt-2 text-sm text-muted">Sign in with the Supabase user you added to admin_users.</p>
        {!hasSupabasePublicEnv() ? (
          <p className="mt-5 rounded-md border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-amber-100">
            Supabase environment variables are required before admin login can work.
          </p>
        ) : currentUser ? (
          <div className="mt-5 grid gap-4">
            <div className="rounded-md border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-amber-100">
              <div className="flex items-start gap-2">
                <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">You are signed in, but this account is not an admin.</p>
                  <p className="mt-2 break-all">User ID: {currentUser.id}</p>
                  <p className="mt-2">Add this User ID to the Supabase `admin_users` table, then refresh this page.</p>
                </div>
              </div>
            </div>
            <form action={logout}>
              <Button variant="secondary" className="w-full">Logout and try another account</Button>
            </form>
          </div>
        ) : (
          <div className="mt-6">
            <LoginForm />
          </div>
        )}
      </div>
    </section>
  );
}
