import Link from "next/link";
import Image from "next/image";
import { Download, FileArchive, HardDrive, Youtube } from "lucide-react";
import type { Resource } from "@/types/database";
import { formatBytes } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-xl resource-card">
      <Link href={`/resources/${resource.slug}`} className="focus-ring rounded-md">
        <div className="relative mb-4 grid aspect-[16/9] place-items-center overflow-hidden rounded-md bg-surface">
          {resource.thumbnail_path ? (
            <Image
              src={`/api/resources/${resource.slug}/thumbnail`}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <FileArchive aria-hidden className="h-10 w-10 text-accent" />
          )}
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-normal text-muted">
          <span>{resource.categories?.name || "Uncategorized"}</span>
          <span aria-hidden>•</span>
          <span>{resource.file_type.split("/").pop()?.toUpperCase() || "FILE"}</span>
        </div>
        <h3 className="text-lg font-bold text-foreground">{resource.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{resource.description}</p>
      </Link>
      <div className="mt-auto pt-5">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <HardDrive aria-hidden className="h-4 w-4" />
            {formatBytes(resource.file_size)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Download aria-hidden className="h-4 w-4" />
            {resource.download_count}
          </span>
          {resource.youtube_url ? <Youtube aria-label="Has related YouTube video" className="h-4 w-4" /> : null}
        </div>
        <ButtonLink href={`/api/resources/${resource.slug}/download`} className="w-full">
          <Download aria-hidden className="h-4 w-4" />
          Download
        </ButtonLink>
      </div>
    </article>
  );
}
