import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { canDownloadResource, createDownloadEventPayload } from "@/lib/downloads";
import { createAdminClient } from "@/lib/supabase/admin";
import { isExternalDownloadUrl } from "@/lib/utils";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const supabase = createAdminClient();
  const { data: resource, error } = await supabase
    .from("resources")
    .select("id, file_path, original_filename, is_published")
    .eq("slug", slug)
    .single();

  if (error || !canDownloadResource(resource)) {
    return NextResponse.json({ message: "Resource not found." }, { status: 404 });
  }

  await supabase.from("download_events").insert(createDownloadEventPayload({
    resourceId: resource.id,
    userAgent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer")
  }));
  await supabase.rpc("increment_resource_download_count", { target_resource_id: resource.id });

  if (isExternalDownloadUrl(resource.file_path)) {
    return NextResponse.redirect(resource.file_path);
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(siteConfig.resourcesBucket)
    .createSignedUrl(resource.file_path, 60, {
      download: resource.original_filename
    });

  if (signedUrlError || !data?.signedUrl) {
    return NextResponse.json({ message: "Download is temporarily unavailable." }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
