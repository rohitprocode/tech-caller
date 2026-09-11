import { ButtonLink } from "@/components/ui/button";

function pageHref(basePath: string, page: number, params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export function Pagination({
  basePath,
  page,
  pageSize,
  count,
  params
}: {
  basePath: string;
  page: number;
  pageSize: number;
  count: number;
  params: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <ButtonLink variant="secondary" href={pageHref(basePath, Math.max(1, page - 1), params)} className={page <= 1 ? "pointer-events-none opacity-50" : ""}>
        Previous
      </ButtonLink>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <ButtonLink variant="secondary" href={pageHref(basePath, Math.min(totalPages, page + 1), params)} className={page >= totalPages ? "pointer-events-none opacity-50" : ""}>
        Next
      </ButtonLink>
    </nav>
  );
}
