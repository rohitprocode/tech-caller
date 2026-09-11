import { redirect } from "next/navigation";
import { hasSupabasePublicEnv } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserFromAccessToken } from "@/lib/supabase/auth-http";
import { readSupabaseSessionCookie } from "@/lib/supabase/session-cookie";

export async function getCurrentUser() {
  if (!hasSupabasePublicEnv()) return null;
  const session = await readSupabaseSessionCookie();
  if (!session?.access_token) return null;
  try {
    return await getUserFromAccessToken(session.access_token);
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? user : null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
