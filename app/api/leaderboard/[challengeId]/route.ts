import { NextRequest, NextResponse } from "next/server";
import { getChallengeLeaderboard, getUserTailStats } from "@/lib/services/tails";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const resolvedParams = await params;
    
    // Return mock data if database is not available
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      const mockLeaderboard = [
        {
          userId: "user_001",
          totalPoints: 245,
          rank: 1,
          lastTailAt: new Date().toISOString()
        },
        {
          userId: "user_042",
          totalPoints: 198,
          rank: 2,
          lastTailAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          userId: "user_156",
          totalPoints: 187,
          rank: 3,
          lastTailAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          userId: "user_289",
          totalPoints: 156,
          rank: 4,
          lastTailAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          userId: "user_334",
          totalPoints: 142,
          rank: 5,
          lastTailAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ];

      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      
      let userStats = null;
      if (userId) {
        userStats = {
          userId: userId,
          totalPoints: 156,
          totalTails: 89,
          validTails: 78,
          rank: 4
        };
      }
      
      return NextResponse.json({ 
        leaderboard: mockLeaderboard,
        userStats 
      });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    const leaderboard = await getChallengeLeaderboard(resolvedParams.challengeId, limit);
    
    let userStats = null;
    if (userId) {
      userStats = await getUserTailStats(userId, resolvedParams.challengeId);
    }

    return NextResponse.json({ 
      leaderboard,
      userStats 
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
