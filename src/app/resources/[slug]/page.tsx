import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Download, ExternalLink, FileArchive, HardDrive, Youtube } from "lucide-react";
import { AdInArticle, AdSidebar } from "@/components/ads/ad-slots";
import { ButtonLink } from "@/components/ui/button";
import { getResourceBySlug } from "@/lib/data";
import { formatBytes, formatDate, getYouTubeId, publicUrl } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();
  const title = `${resource.title} | ${siteConfig.name}`;
  const thumbnailUrl = resource.thumbnail_path ? publicUrl(`/api/resources/${resource.slug}/thumbnail`) : undefined;
  return {
    title,
    description: resource.description,
    alternates: { canonical: publicUrl(`/resources/${resource.slug}`) },
    openGraph: {
      title,
      description: resource.description,
      url: publicUrl(`/resources/${resource.slug}`),
      type: "article",
      images: thumbnailUrl ? [{ url: thumbnailUrl, alt: `${resource.title} preview` }] : undefined
    },
    twitter: {
      card: thumbnailUrl ? "summary_large_image" : "summary",
      title,
      description: resource.description,
      images: thumbnailUrl ? [thumbnailUrl] : undefined
    }
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();
  const youtubeId = getYouTubeId(resource.youtube_url);
  const instructions = (resource.instructions || "Download the file.\nOpen the related tutorial.\nFollow the steps shown in the video.")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: resource.title,
    description: resource.description,
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: siteConfig.name },
    url: publicUrl(`/resources/${resource.slug}`)
  };

  return (
    <article className="container-shell py-12 resource-detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="relative mb-6 grid aspect-[16/8] place-items-center overflow-hidden rounded-lg border border-border bg-card">
            {resource.thumbnail_path ? (
              <Image
                src={`/api/resources/${resource.slug}/thumbnail`}
                alt={`${resource.title} preview`}
                fill
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <FileArchive aria-hidden className="h-16 w-16 text-accent" />
            )}
          </div>
          <p className="text-sm font-semibold uppercase text-accent-strong">{resource.categories?.name || "Resource"}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">{resource.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted">{resource.description}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
            <span>{formatDate(resource.created_at)}</span>
            <span className="inline-flex items-center gap-1">
              <HardDrive aria-hidden className="h-4 w-4" />
              {formatBytes(resource.file_size)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Download aria-hidden className="h-4 w-4" />
              {resource.download_count} downloads
            </span>
          </div>

          <div className="mt-8">
            <ButtonLink href={`/api/resources/${resource.slug}/download`} className="h-12 px-6 text-base">
              <Download aria-hidden className="h-5 w-5" />
              Download Resource
            </ButtonLink>
          </div>

          <AdInArticle />

          <section className="mt-10">
            <h2 className="text-2xl font-black">How to Use</h2>
            <ol className="mt-4 grid gap-3">
              {instructions.map((step, index) => (
                <li key={`${step}-${index}`} className="flex gap-3 rounded-md border border-border bg-card p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {youtubeId ? (
            <section className="mt-10">
              <h2 className="text-2xl font-black">Related YouTube Video</h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={`Related tutorial for ${resource.title}`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}
        </div>

        <aside className="grid content-start gap-5">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-lg font-bold">File Details</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Filename</dt>
                <dd className="text-right">{resource.original_filename}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Type</dt>
                <dd>{resource.file_type}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Size</dt>
                <dd>{formatBytes(resource.file_size)}</dd>
              </div>
            </dl>
            {resource.youtube_url ? (
              <ButtonLink href={resource.youtube_url} variant="secondary" className="mt-5 w-full">
                <Youtube aria-hidden className="h-4 w-4" />
                Watch Tutorial
                <ExternalLink aria-hidden className="h-4 w-4" />
              </ButtonLink>
            ) : null}
          </div>
          <AdSidebar />
        </aside>
      </div>
    </article>
  );
}
