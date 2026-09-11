import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { decodeJwtPayload } from "@/lib/supabase/auth-http";

const maxChunkSize = 3180;
const base64Prefix = "base64-";
const isProduction = process.env.NODE_ENV === "production";
const baseCookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  httpOnly: true,
  secure: isProduction
};

type StoredSession = {
  access_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: "bearer";
  user: {
    id: string;
    email?: string;
  };
};

function storageKey() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Supabase URL is missing.");
  return `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function createChunks(key: string, value: string) {
  const encodedValue = encodeURIComponent(value);
  if (encodedValue.length <= maxChunkSize) return [{ name: key, value }];

  const chunks: string[] = [];
  let remaining = encodedValue;
  while (remaining.length > 0) {
    let encodedHead = remaining.slice(0, maxChunkSize);
    const lastEscapePos = encodedHead.lastIndexOf("%");
    if (lastEscapePos > maxChunkSize - 3) encodedHead = encodedHead.slice(0, lastEscapePos);

    let valueHead = "";
    while (encodedHead.length > 0) {
      try {
        valueHead = decodeURIComponent(encodedHead);
        break;
      } catch (error) {
        if (error instanceof URIError && encodedHead.at(-3) === "%" && encodedHead.length > 3) {
          encodedHead = encodedHead.slice(0, encodedHead.length - 3);
        } else {
          throw error;
        }
      }
    }
    chunks.push(valueHead);
    remaining = remaining.slice(encodedHead.length);
  }

  return chunks.map((chunk, index) => ({ name: `${key}.${index}`, value: chunk }));
}

function clearAuthCookies(response: NextResponse, key: string) {
  response.cookies.set(key, "", { ...baseCookieOptions, maxAge: 0 });
  for (let index = 0; index < 10; index += 1) {
    response.cookies.set(`${key}.${index}`, "", { ...baseCookieOptions, maxAge: 0 });
  }
}

export function writeSupabaseSessionCookie({
  response,
  accessToken,
  user
}: {
  response: NextResponse;
  accessToken: string;
  user: StoredSession["user"];
}) {
  const key = storageKey();
  const jwtPayload = decodeJwtPayload(accessToken);
  const expiresAt = jwtPayload?.exp;
  const session: StoredSession = {
    access_token: accessToken,
    expires_at: expiresAt,
    expires_in: expiresAt ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000)) : 3600,
    token_type: "bearer",
    user
  };
  const encoded = base64Prefix + base64UrlEncode(JSON.stringify(session));
  clearAuthCookies(response, key);
  const cookieOptions = { ...baseCookieOptions, maxAge: session.expires_in };
  for (const chunk of createChunks(key, encoded)) {
    response.cookies.set(chunk.name, chunk.value, cookieOptions);
  }
}

export async function readSupabaseSessionCookie() {
  const key = storageKey();
  const cookieStore = await cookies();
  let value = cookieStore.get(key)?.value || "";
  if (!value) {
    const chunks: string[] = [];
    for (let index = 0; ; index += 1) {
      const chunk = cookieStore.get(`${key}.${index}`)?.value;
      if (!chunk) break;
      chunks.push(chunk);
    }
    value = chunks.join("");
  }
  if (!value) return null;
  try {
    const decoded = value.startsWith(base64Prefix) ? base64UrlDecode(value.slice(base64Prefix.length)) : value;
    return JSON.parse(decoded) as StoredSession;
  } catch {
    return null;
  }
}

export function clearSupabaseSessionCookie(response: NextResponse) {
  clearAuthCookies(response, storageKey());
}

export async function clearSupabaseSessionCookieStore() {
  const key = storageKey();
  const cookieStore = await cookies();
  cookieStore.set(key, "", { ...baseCookieOptions, maxAge: 0 });
  for (let index = 0; index < 10; index += 1) {
    cookieStore.set(`${key}.${index}`, "", { ...baseCookieOptions, maxAge: 0 });
  }
}
