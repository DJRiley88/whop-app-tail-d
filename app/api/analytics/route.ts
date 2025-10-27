import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { getAnalytics } from "@/lib/services/analytics";

export async function GET(request: NextRequest) {
  try {
    // Return mock data if database is not available
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      const mockAnalytics = {
        totalTails: {
          last24h: 45,
          last7d: 320,
          last30d: 1250,
          allTime: 5420
        },
        uniqueTailers: {
          last24h: 12,
          last7d: 89,
          last30d: 234,
          allTime: 567
        },
        averageTailsPerBet: 3.2,
        tailWindowConversionRate: 0.78,
        topSportsbooks: [
          { sportsbook: "DraftKings", count: 45 },
          { sportsbook: "FanDuel", count: 38 },
          { sportsbook: "BetMGM", count: 22 }
        ],
        topLeagues: [
          { league: "NFL", count: 67 },
          { league: "NBA", count: 43 },
          { league: "MLB", count: 28 }
        ],
        timeToFirst10Tails: 2.5,
        betPerformance: [
          {
            betId: "1",
            title: "Sample Bet Performance",
            views: 150,
            inWindowTails: 45,
            outOfWindowTails: 12,
            conversionRate: 0.3
          }
        ]
      };
      return NextResponse.json({ analytics: mockAnalytics });
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
    const timeRange = searchParams.get("timeRange") as "24h" | "7d" | "30d" | "all" | undefined;

    const analytics = await getAnalytics(challengeId || undefined, timeRange);
    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

