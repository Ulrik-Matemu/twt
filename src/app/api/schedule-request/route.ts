import { NextResponse } from "next/server";
import { saveScheduleRequest } from "@/lib/saveScheduleRequest";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.serviceCategory ||
      !body.region ||
      !body.situationDetail ||
      !body.preferredDate ||
      !body.preferredTime ||
      !body.meetingFormat
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const requestId = await saveScheduleRequest(body);

    return NextResponse.json({ success: true, requestId });
  } catch (error) {
    console.error("Schedule request error:", error);

    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}