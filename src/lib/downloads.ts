export type DownloadableResource = {
  id: string;
  is_published: boolean;
  file_path: string | null;
};

export function canDownloadResource(resource: DownloadableResource | null | undefined) {
  return Boolean(resource?.id && resource.is_published && resource.file_path);
}

export function createDownloadEventPayload({
  resourceId,
  userAgent,
  referrer
}: {
  resourceId: string;
  userAgent: string | null;
  referrer: string | null;
}) {
  return {
    resource_id: resourceId,
    user_agent: userAgent?.slice(0, 500) || null,
    referrer: referrer?.slice(0, 1000) || null
  };
}
