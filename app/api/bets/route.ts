import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { createBet, getBetsForChallenge, getAllBets } from "@/lib/services/bets";

export async function GET(request: NextRequest) {
  try {
    // Return mock data if database is not available
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      const mockBets = [
        {
          id: "1",
          title: "Sample Bet",
          description: "This is a sample bet for testing",
          sportsbook: "DraftKings",
          league: "NFL",
          odds: "+150",
          tailWindowMinutes: 30,
          challengeId: "1",
          postedBy: "user_1",
          createdAt: new Date().toISOString(),
          tailWindowEndsAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          isExpired: false,
          timeRemaining: 30,
          totalTails: 0,
          validTails: 0,
          challengeTitle: "Sample Challenge",
          challengeStatus: "active"
        }
      ];
      return NextResponse.json({ bets: mockBets });
    }

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");
    const allBets = searchParams.get("all") === "true";

    if (allBets) {
      // Fetch all bets across all challenges for Discover Bets page
      const bets = await getAllBets();
      return NextResponse.json({ bets });
    }

    if (!challengeId) {
      return NextResponse.json({ error: "Challenge ID required" }, { status: 400 });
    }

    const bets = await getBetsForChallenge(challengeId);
    return NextResponse.json({ bets });
  } catch (error) {
    console.error("Error fetching bets:", error);
    return NextResponse.json(
      { error: "Failed to fetch bets" },
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
    const betData = {
      ...body,
      postedBy: user.id,
    };

    const bet = await createBet(betData);
    return NextResponse.json({ bet });
  } catch (error) {
    console.error("Error creating bet:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create bet" },
      { status: 400 }
    );
  }
}

