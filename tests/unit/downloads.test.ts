import { describe, expect, it } from "vitest";
import { canDownloadResource, createDownloadEventPayload } from "@/lib/downloads";

describe("download tracking logic", () => {
  it("allows downloads only for published resources with a file", () => {
    expect(canDownloadResource({ id: "1", is_published: true, file_path: "resources/1/file.zip" })).toBe(true);
    expect(canDownloadResource({ id: "1", is_published: true, file_path: "https://example.com/big-file.zip" })).toBe(
      true
    );
    expect(canDownloadResource({ id: "1", is_published: false, file_path: "resources/1/file.zip" })).toBe(false);
    expect(canDownloadResource({ id: "1", is_published: true, file_path: null })).toBe(false);
  });

  it("builds a minimal download event payload", () => {
    expect(
      createDownloadEventPayload({
        resourceId: "resource-1",
        userAgent: "Mozilla",
        referrer: "https://youtube.com"
      })
    ).toEqual({
      resource_id: "resource-1",
      user_agent: "Mozilla",
      referrer: "https://youtube.com"
    });
  });
});
