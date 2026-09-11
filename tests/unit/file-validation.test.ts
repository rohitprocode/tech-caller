import { describe, expect, it } from "vitest";
import { validateFile } from "@/lib/validations/resource";

describe("file validation", () => {
  it("accepts supported resource files", () => {
    const file = new File(["ok"], "overlay.zip", { type: "application/zip" });
    expect(validateFile(file)).toBeNull();
  });

  it("rejects unsupported extensions", () => {
    const file = new File(["bad"], "script.sh", { type: "text/x-shellscript" });
    expect(validateFile(file)).toContain("extension");
  });

  it("rejects oversized resource files", () => {
    const file = {
      name: "huge.zip",
      size: 4 * 1024 * 1024 * 1024,
      type: "application/zip"
    } as File;

    expect(validateFile(file)).toContain("100 MB");
  });

  it("rejects rar files because the storage bucket does not allow rar MIME types", () => {
    const file = new File(["bad"], "archive.rar", { type: "application/vnd.rar" });
    expect(validateFile(file)).toContain("extension");
  });

  it("limits thumbnails to image formats", () => {
    const file = new File(["bad"], "notes.pdf", { type: "application/pdf" });
    expect(validateFile(file, "thumbnail")).toContain("Thumbnails");
  });
});
