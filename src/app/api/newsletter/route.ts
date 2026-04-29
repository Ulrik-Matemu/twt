import { NextResponse } from "next/server";
import { saveNewsletterSubscriber } from "@/lib/saveNewsletterSubscriber";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await saveNewsletterSubscriber(email);

    return NextResponse.json({
      success: true,
      alreadyExists: result.alreadyExists,
    });
  } catch (error) {
    console.error("Newsletter signup error:", error);

    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}