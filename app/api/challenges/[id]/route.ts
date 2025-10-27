import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { getChallengeWithStats, startChallenge, endChallenge } from "@/lib/services/challenges";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const challenge = await getChallengeWithStats(id);
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Get user from Whop headers
    const whopUserId = request.headers.get("x-whop-user-id");
    if (!whopUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser({
      id: whopUserId,
      username: request.headers.get("x-whop-username") || "unknown",
      display_name: request.headers.get("x-whop-display-name") || "Unknown User",
      avatar_url: request.headers.get("x-whop-avatar-url") || undefined,
    });

    const body = await request.json();
    const { action } = body;

    let result;
    if (action === "start") {
      result = await startChallenge(id, user.id);
    } else if (action === "end") {
      result = await endChallenge(id, user.id);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ challenge: result });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update challenge" },
      { status: 400 }
    );
  }
}

