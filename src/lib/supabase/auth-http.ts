import { request } from "node:https";

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

export function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as { exp?: number; sub?: string };
  } catch {
    return null;
  }
}

export async function getUserFromAccessToken(accessToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase URL or anon key is missing.");
  }

  const url = new URL("/auth/v1/user", supabaseUrl);

  return new Promise<SupabaseAuthUser>((resolve, reject) => {
    const req = request(
      url,
      {
        method: "GET",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        }
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`Supabase Auth returned ${res.statusCode || "an error"}.`));
            return;
          }
          try {
            const user = JSON.parse(body) as SupabaseAuthUser;
            if (!user.id) {
              reject(new Error("Supabase Auth returned no user ID."));
              return;
            }
            resolve(user);
          } catch {
            reject(new Error("Supabase Auth returned invalid JSON."));
          }
        });
      }
    );

    req.on("error", (error) => reject(error));
    req.setTimeout(15000, () => {
      req.destroy(new Error("Supabase Auth request timed out."));
    });
    req.end();
  });
}
