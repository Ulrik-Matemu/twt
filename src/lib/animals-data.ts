import { unstable_cache } from "next/cache";
import { adminDb } from "./firebase-admin";

export interface AnimalRecord {
  id: string;
  name: string;
  active: boolean;
}

// The animal catalog changes rarely (an admin registering/retiring a name)
// but is read on nearly every portal page, so it's cached and busted via
// revalidateTag("animals", "max") from the write routes rather than a TTL.
export const getAnimals = unstable_cache(
  async (): Promise<AnimalRecord[]> => {
    const snapshot = await adminDb.collection("animals").orderBy("name").get();
    return snapshot.docs.map((doc) => {
      const data = doc.data() as { name: string; active: boolean };
      return { id: doc.id, name: data.name, active: data.active };
    });
  },
  ["portal-animals"],
  { tags: ["animals"] }
);
