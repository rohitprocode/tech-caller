import { NextResponse, type NextRequest } from "next/server";

function resourceNotFoundResponse() {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Page not found | Tech Caller</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #07090d; color: #f7fafc; font-family: Arial, Helvetica, sans-serif; }
      main { width: min(640px, calc(100% - 32px)); }
      h1 { margin: 0; font-size: clamp(2rem, 6vw, 3rem); }
      p { color: #a3adbd; line-height: 1.7; }
      a { color: #24d2bd; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>The page or resource you opened is not available.</p>
      <a href="/resources">Browse Resources</a>
    </main>
  </body>
</html>`,
    {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex"
      }
    }
  );
}

export async function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return NextResponse.next();

  const slug = request.nextUrl.pathname.split("/").filter(Boolean)[1];
  if (!slug) return NextResponse.next();

  const url = new URL("/rest/v1/resources", supabaseUrl);
  url.searchParams.set("select", "id");
  url.searchParams.set("slug", `eq.${slug}`);
  url.searchParams.set("is_published", "eq.true");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) return NextResponse.next();
  const resources = (await response.json().catch(() => [])) as unknown[];
  return resources.length > 0 ? NextResponse.next() : resourceNotFoundResponse();
}

export const config = {
  matcher: "/resources/:slug"
};
