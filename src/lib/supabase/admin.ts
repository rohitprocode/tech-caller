import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseAdminEnv, siteConfig } from "@/lib/config";

export function createAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          "x-application-name": siteConfig.name
        }
      }
    }
  );
}
