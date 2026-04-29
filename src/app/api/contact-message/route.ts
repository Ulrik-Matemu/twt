import { NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/saveContactMessage";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.name ||
      !body.email ||
      !body.enquiryType ||
      !body.message
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      typeof body.name !== "string" ||
      typeof body.email !== "string" ||
      typeof body.enquiryType !== "string" ||
      typeof body.message !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400 }
      );
    }

    const messageId = await saveContactMessage(body);

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    console.error("Contact message error:", error);

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}