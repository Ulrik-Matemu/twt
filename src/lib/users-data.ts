import { unstable_cache } from "next/cache";
import { adminDb } from "./firebase-admin";
import type { PortalRole } from "./portal-types";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  active: boolean;
}

// The user list changes rarely (admin creating/disabling an account) but is
// read on every visit to the Users page, so it's cached and busted via
// revalidateTag("users", "max") from the write routes rather than a TTL.
export const getUsers = unstable_cache(
  async (): Promise<UserRecord[]> => {
    const snapshot = await adminDb
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => {
      const data = doc.data() as {
        name: string;
        email: string;
        role: PortalRole;
        active: boolean;
      };
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        active: data.active,
      };
    });
  },
  ["portal-users"],
  { tags: ["users"] }
);
