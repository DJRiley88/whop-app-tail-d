import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { recordTail, getUserTails } from "@/lib/services/tails";

export async function GET(request: NextRequest) {
  try {
    // Return mock data if database is not available
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      const mockTails = [
        {
          id: "1",
          betId: "1",
          userId: "user_1",
          isValid: true,
          createdAt: new Date().toISOString(),
          ipAddress: "127.0.0.1",
          userAgent: "Mozilla/5.0..."
        }
      ];
      return NextResponse.json({ tails: mockTails });
    }

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

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");

    const tails = await getUserTails(user.id, challengeId || undefined);
    return NextResponse.json({ tails });
  } catch (error) {
    console.error("Error fetching tails:", error);
    return NextResponse.json(
      { error: "Failed to fetch tails" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const { betId } = body;

    if (!betId) {
      return NextResponse.json({ error: "Bet ID required" }, { status: 400 });
    }

    const tailData = {
      betId,
      userId: user.id,
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    };

    const result = await recordTail(tailData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error recording tail:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to record tail" },
      { status: 400 }
    );
  }
}

