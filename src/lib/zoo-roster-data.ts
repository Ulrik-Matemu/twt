import { unstable_cache } from "next/cache";
import { adminDb } from "./firebase-admin";

export interface ZooSubUnitAnimalRecord {
  id: string;
  name: string;
  gender: string;
  active: boolean;
}

export interface ZooSubUnitRecord {
  id: string;
  name: string;
  active: boolean;
  animals: ZooSubUnitAnimalRecord[];
}

// Same shape/reasoning as src/lib/animals-data.ts's getAnimals(): rarely
// written (admin managing the roster), read on every zoo-census report
// form load, busted via revalidateTag("zoo-subunits", "max") on write.
export const getZooSubunits = unstable_cache(
  async (): Promise<ZooSubUnitRecord[]> => {
    const snapshot = await adminDb.collection("zoo_subunits").orderBy("name").get();

    return Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data() as { name: string; active: boolean };
        const animalsSnapshot = await doc.ref
          .collection("animals")
          .orderBy("name")
          .get();

        const animals = animalsSnapshot.docs.map((animalDoc) => {
          const animalData = animalDoc.data() as {
            name: string;
            gender: string;
            active: boolean;
          };
          return {
            id: animalDoc.id,
            name: animalData.name,
            gender: animalData.gender,
            active: animalData.active,
          };
        });

        return { id: doc.id, name: data.name, active: data.active, animals };
      })
    );
  },
  ["portal-zoo-subunits"],
  { tags: ["zoo-subunits"] }
);
