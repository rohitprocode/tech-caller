import { describe, expect, it } from "vitest";
import { defaultSlugFromTitle } from "@/lib/validations/resource";
import { isExternalDownloadUrl, normalizeExternalDownloadUrl, normalizeYouTubeUrl, slugify } from "@/lib/utils";

describe("slug generation", () => {
  it("creates lowercase SEO-friendly slugs", () => {
    expect(slugify("OBS Circular Facecam Overlay")).toBe("obs-circular-facecam-overlay");
  });

  it("removes unsafe characters", () => {
    expect(slugify("Windows Utility Pack!!! v2")).toBe("windows-utility-pack-v2");
  });

  it("falls back for empty generated slugs", () => {
    expect(defaultSlugFromTitle("!!!")).toBe("resource");
  });

  it("normalizes shared YouTube short links", () => {
    expect(normalizeYouTubeUrl("https://youtu.be/etkRxaja8W0?si=pyE_0mWAVQ1SkBrh")).toBe(
      "https://www.youtube.com/watch?v=etkRxaja8W0"
    );
  });

  it("accepts only http external download URLs", () => {
    expect(normalizeExternalDownloadUrl("https://example.com/big-file.zip")).toBe("https://example.com/big-file.zip");
    expect(isExternalDownloadUrl("http://example.com/file.iso")).toBe(true);
    expect(isExternalDownloadUrl("javascript:alert(1)")).toBe(false);
  });
});
