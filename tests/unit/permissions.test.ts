import { describe, expect, it } from "vitest";
import { canManageResources, isAdminUser } from "@/lib/auth/permissions";

describe("resource permissions", () => {
  it("allows configured admins", () => {
    expect(isAdminUser("user-1", ["user-1"])).toBe(true);
    expect(canManageResources("user-1", ["user-1"])).toBe(true);
  });

  it("rejects missing or non-admin users", () => {
    expect(isAdminUser(null, ["user-1"])).toBe(false);
    expect(canManageResources("user-2", ["user-1"])).toBe(false);
  });
});
