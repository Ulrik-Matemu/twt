import { cache } from "react";
import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";
import type { PortalRole, PortalSessionUser } from "./portal-types";

export const SESSION_COOKIE_NAME = "__session";

// Memoized per request: every layout/page on a page load calls this, but it
// should only hit Firebase Auth (including the revocation check) once.
export const getSessionUser = cache(async (): Promise<PortalSessionUser | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const role = decoded.role as PortalRole | undefined;
    if (!role) return null;

    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: (decoded.name as string) ?? decoded.email ?? "",
      role,
    };
  } catch {
    return null;
  }
});

export function requireRole(
  user: PortalSessionUser | null,
  allowed: PortalRole[]
): user is PortalSessionUser {
  return !!user && allowed.includes(user.role);
}

// Plain boolean check for when `user` is already known to be non-null —
// avoids a `never`-narrowing pitfall from reusing the `requireRole` type
// predicate's negated branch on an already-narrowed value.
export function hasRole(user: PortalSessionUser, allowed: PortalRole[]): boolean {
  return allowed.includes(user.role);
}
