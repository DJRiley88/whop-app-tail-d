import { db, tails, bets, challenges, userChallenges } from "../db";
import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";

export interface TailData {
  betId: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface TailResult {
  success: boolean;
  pointsAwarded: number;
  message: string;
  isWithinWindow: boolean;
}

export interface UserTailStats {
  userId: string;
  totalPoints: number;
  totalTails: number;
  validTails: number;
  rank?: number;
}

export async function recordTail(data: TailData): Promise<TailResult> {
  const bet = await db
    .select()
    .from(bets)
    .where(eq(bets.id, data.betId))
    .limit(1);

  if (!bet[0]) {
    return {
      success: false,
      pointsAwarded: 0,
      message: "Bet not found",
      isWithinWindow: false,
    };
  }

  // Check if bet is still open
  if (bet[0].status !== "open") {
    return {
      success: false,
      pointsAwarded: 0,
      message: "Bet is no longer open",
      isWithinWindow: false,
    };
  }

  const now = new Date();
  const isWithinWindow = now <= bet[0].tailWindowEndsAt;

  // Check if user already tailed this bet
  const existingTail = await db
    .select()
    .from(tails)
    .where(and(
      eq(tails.betId, data.betId),
      eq(tails.userId, data.userId)
    ))
    .limit(1);

  if (existingTail.length > 0) {
    return {
      success: false,
      pointsAwarded: 0,
      message: "You have already tailed this bet",
      isWithinWindow: false,
    };
  }

  // Record the tail
  const tail = await db
    .insert(tails)
    .values({
      betId: data.betId,
      userId: data.userId,
      pointsAwarded: isWithinWindow ? 1 : 0,
      isValid: isWithinWindow,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    })
    .returning();

  // Update user challenge participation
  if (isWithinWindow) {
    await updateUserChallengePoints(data.userId, bet[0].challengeId, 1);
  }

  return {
    success: true,
    pointsAwarded: isWithinWindow ? 1 : 0,
    message: isWithinWindow 
      ? "Tail recorded! +1 point earned" 
      : "Tail recorded, but no points earned (outside time window)",
    isWithinWindow,
  };
}

export async function updateUserChallengePoints(userId: string, challengeId: string, pointsToAdd: number) {
  // Get or create user challenge record
  const userChallenge = await db
    .select()
    .from(userChallenges)
    .where(and(
      eq(userChallenges.userId, userId),
      eq(userChallenges.challengeId, challengeId)
    ))
    .limit(1);

  if (userChallenge.length > 0) {
    // Update existing record
    await db
      .update(userChallenges)
      .set({
        totalPoints: userChallenge[0].totalPoints + pointsToAdd,
        lastTailAt: new Date(),
      })
      .where(eq(userChallenges.id, userChallenge[0].id));
  } else {
    // Create new record
    await db
      .insert(userChallenges)
      .values({
        userId,
        challengeId,
        totalPoints: pointsToAdd,
        lastTailAt: new Date(),
      });
  }

  // Recalculate rankings for this challenge
  await recalculateChallengeRankings(challengeId);
}

export async function recalculateChallengeRankings(challengeId: string) {
  // Get all user challenge records for this challenge, ordered by points
  const userChallengesList = await db
    .select()
    .from(userChallenges)
    .where(eq(userChallenges.challengeId, challengeId))
    .orderBy(desc(userChallenges.totalPoints));

  // Update ranks
  for (let i = 0; i < userChallengesList.length; i++) {
    await db
      .update(userChallenges)
      .set({ rank: i + 1 })
      .where(eq(userChallenges.id, userChallengesList[i].id));
  }
}

export async function getUserTailStats(userId: string, challengeId: string): Promise<UserTailStats> {
  const userChallenge = await db
    .select()
    .from(userChallenges)
    .where(and(
      eq(userChallenges.userId, userId),
      eq(userChallenges.challengeId, challengeId)
    ))
    .limit(1);

  if (!userChallenge[0]) {
    return {
      userId,
      totalPoints: 0,
      totalTails: 0,
      validTails: 0,
    };
  }

  // Get tail counts
  const tailStats = await db
    .select({
      totalTails: sql<number>`count(${tails.id})`,
      validTails: sql<number>`count(case when ${tails.isValid} = true then 1 end)`,
    })
    .from(tails)
    .innerJoin(bets, eq(tails.betId, bets.id))
    .where(and(
      eq(tails.userId, userId),
      eq(bets.challengeId, challengeId)
    ));

  return {
    userId,
    totalPoints: userChallenge[0].totalPoints,
    totalTails: tailStats[0]?.totalTails || 0,
    validTails: tailStats[0]?.validTails || 0,
    rank: userChallenge[0].rank || undefined,
  };
}

export async function getChallengeLeaderboard(challengeId: string, limit: number = 10) {
  return await db
    .select({
      userId: userChallenges.userId,
      totalPoints: userChallenges.totalPoints,
      rank: userChallenges.rank,
      lastTailAt: userChallenges.lastTailAt,
    })
    .from(userChallenges)
    .where(eq(userChallenges.challengeId, challengeId))
    .orderBy(asc(userChallenges.rank))
    .limit(limit);
}

export async function getUserTails(userId: string, challengeId?: string) {
  let query = db
    .select({
      id: tails.id,
      betId: tails.betId,
      clickedAt: tails.clickedAt,
      pointsAwarded: tails.pointsAwarded,
      isValid: tails.isValid,
      betTitle: bets.title,
      betSportsbook: bets.sportsbook,
      betLeague: bets.league,
    })
    .from(tails)
    .innerJoin(bets, eq(tails.betId, bets.id))
    .where(eq(tails.userId, userId))
    .orderBy(desc(tails.clickedAt));

  if (challengeId) {
    query = query.where(and(
      eq(tails.userId, userId),
      eq(bets.challengeId, challengeId)
    ));
  }

  return await query;
}

