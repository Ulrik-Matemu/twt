// One-off / occasional CLI tool to bootstrap portal accounts directly via
// the Firebase Admin SDK (bypasses the /portal/users admin-only UI, which
// needs an existing admin to be logged in already).
//
// Usage:
//   node --env-file=.env.local scripts/create-portal-user.mjs \
//     --name "Ahmed Magram" --email office@twt.co.tz --password "..." --role admin
//
// Valid --role values: admin, office_manager, admin_doctor, zoo_doctor, field_doctor

import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const VALID_ROLES = [
  "admin",
  "office_manager",
  "admin_doctor",
  "zoo_doctor",
  "field_doctor",
];

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    args[key] = argv[i + 1];
  }
  return args;
}

async function main() {
  const { name, email, password, role } = parseArgs();

  if (!name || !email || !password || !role) {
    console.error(
      "Usage: node --env-file=.env.local scripts/create-portal-user.mjs --name \"Full Name\" --email you@example.com --password secret --role admin"
    );
    process.exit(1);
  }

  if (!VALID_ROLES.includes(role)) {
    console.error(`Invalid role "${role}". Valid roles: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  const user = await auth.createUser({ email, password, displayName: name });
  await auth.setCustomUserClaims(user.uid, { role });

  await db.collection("users").doc(user.uid).set({
    name,
    email,
    role,
    active: true,
    createdBy: "bootstrap-script",
    createdAt: FieldValue.serverTimestamp(),
  });

  console.log(`Created ${role} account for ${email} (uid: ${user.uid})`);
}

main().catch((err) => {
  console.error("Failed to create user:", err.message);
  process.exit(1);
});
