import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserFromAccessToken } from "@/lib/supabase/auth-http";
import { clearSupabaseSessionCookie, writeSupabaseSessionCookie } from "@/lib/supabase/session-cookie";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    access_token?: string;
    refresh_token?: string;
  } | null;

  if (!body?.access_token) {
    const response = NextResponse.json({ ok: false, message: "Login token was missing. Please try again." }, { status: 400 });
    clearSupabaseSessionCookie(response);
    return response;
  }

  let user: { id: string; email?: string };
  try {
    user = await getUserFromAccessToken(body.access_token);
  } catch (error) {
    console.error("Supabase Auth token verification failed", error);
    const message =
      error instanceof Error
        ? [error.name, error.message, "code" in error ? String(error.code) : ""].filter(Boolean).join(": ")
        : "Unknown error.";
    const response = NextResponse.json(
      { ok: false, message: `Login worked, but the website could not verify the Supabase session: ${message}` },
      { status: 401 }
    );
    clearSupabaseSessionCookie(response);
    return response;
  }

  const userId = user.id;
  const adminClient = createAdminClient();
  const { data: adminUser, error: adminError } = await adminClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError) {
    const response = NextResponse.json({ ok: false, message: `Admin verification failed: ${adminError.message}` }, { status: 500 });
    clearSupabaseSessionCookie(response);
    return response;
  }

  if (!adminUser) {
    const response = NextResponse.json(
      {
        ok: false,
        message: `Login worked, but this user is not an admin yet. Add this user ID to admin_users: ${userId}`
      },
      { status: 403 }
    );
    clearSupabaseSessionCookie(response);
    return response;
  }

  const response = NextResponse.json({ ok: true });
  writeSupabaseSessionCookie({
    response,
    accessToken: body.access_token,
    user
  });
  return response;
}
