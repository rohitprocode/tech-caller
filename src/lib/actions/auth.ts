"use server";

import { redirect } from "next/navigation";
import { clearSupabaseSessionCookieStore } from "@/lib/supabase/session-cookie";

export async function logout() {
  await clearSupabaseSessionCookieStore();
  redirect("/admin/login");
}
