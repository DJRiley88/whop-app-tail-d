import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { createChallenge, getActiveChallenges, getDraftChallenges } from "@/lib/services/challenges";

export async function GET(request: NextRequest) {
  try {
    // Return mock data if database is not available
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      const mockChallenges = [
        {
          id: "1",
          title: "Sample Challenge",
          description: "This is a sample challenge for testing",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalPrizePool: "1000.00",
          firstPlacePercentage: 50,
          secondPlacePercentage: 30,
          thirdPlacePercentage: 20,
          status: "active",
          totalBets: 0,
          totalTails: 0,
          uniqueTailers: 0
        }
      ];
      return NextResponse.json({ challenges: mockChallenges });
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
    const type = searchParams.get("type") || "active";

    let challenges;
    if (type === "active") {
      challenges = await getActiveChallenges();
    } else if (type === "draft") {
      challenges = await getDraftChallenges(user.id);
    } else {
      challenges = await getActiveChallenges();
    }

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
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
    const challengeData = {
      ...body,
      createdBy: user.id,
    };

    const challenge = await createChallenge(challengeData);
    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create challenge" },
      { status: 400 }
    );
  }
}

