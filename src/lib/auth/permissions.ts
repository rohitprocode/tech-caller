export function isAdminUser(userId: string | null | undefined, adminUserIds: string[]) {
  if (!userId) return false;
  return adminUserIds.includes(userId);
}

export function canManageResources(userId: string | null | undefined, adminUserIds: string[]) {
  return isAdminUser(userId, adminUserIds);
}
