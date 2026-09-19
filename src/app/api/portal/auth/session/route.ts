import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE_NAME } from "@/lib/portal-auth";
import { logActivity } from "@/lib/activity-log";
import type { PortalRole } from "@/lib/portal-types";

const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!decoded.role) {
      return NextResponse.json(
        { error: "Account has no assigned role. Contact an administrator." },
        { status: 403 }
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRES_IN_MS / 1000,
      path: "/",
    });

    await logActivity(
      {
        uid: decoded.uid,
        email: decoded.email ?? "",
        name: (decoded.name as string) ?? decoded.email ?? "",
        role: decoded.role as PortalRole,
      },
      "login",
      { summary: `${decoded.name || decoded.email} logged in` }
    );

    return NextResponse.json({ success: true, role: decoded.role });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
