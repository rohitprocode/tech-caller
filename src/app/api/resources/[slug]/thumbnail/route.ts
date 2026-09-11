import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: resource, error } = await supabase
    .from("resources")
    .select("thumbnail_path")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !resource?.thumbnail_path) {
    return NextResponse.json({ message: "Thumbnail not found." }, { status: 404 });
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(siteConfig.resourcesBucket)
    .createSignedUrl(resource.thumbnail_path, 60 * 30);

  if (signedUrlError || !data?.signedUrl) {
    return NextResponse.json({ message: "Thumbnail could not be loaded." }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
