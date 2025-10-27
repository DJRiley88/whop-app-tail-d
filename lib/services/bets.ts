import { db, bets, tails, challenges, users } from "../db";
import { eq, and, desc, asc, sql, gte, lte, InferSelectModel } from "drizzle-orm";

type Bet = InferSelectModel<typeof bets>;

export interface CreateBetData {
  challengeId: string;
  title: string;
  caption?: string;
  tailLink: string;
  imageUrl?: string;
  sportsbook: "prizepicks" | "underdog" | "draftkings" | "fanduel" | "betmgm" | "other";
  league: "nfl" | "nba" | "nhl" | "mlb" | "ncaaf" | "ncaab" | "soccer" | "tennis" | "golf" | "other";
  tailWindowMinutes: number;
  postedBy: string;
}

export interface BetWithStats {
  id: string;
  challengeId: string;
  title: string;
  caption?: string;
  tailLink: string;
  imageUrl?: string;
  sportsbook: string;
  league: string;
  tailWindowMinutes: number;
  tailWindowEndsAt: Date;
  status: "open" | "closed" | "hidden";
  postedBy: string;
  createdAt: Date;
  updatedAt: Date;
  totalTails: number;
  validTails: number;
  timeRemaining?: number; // minutes remaining
  isExpired: boolean;
}

export async function createBet(data: CreateBetData) {
  // Validate challenge is active
  const challenge = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, data.challengeId))
    .limit(1);

  if (!challenge[0]) {
    throw new Error("Challenge not found");
  }

  if (challenge[0].status !== "active") {
    throw new Error("Challenge is not active");
  }

  // Calculate tail window end time
  const tailWindowEndsAt = new Date(Date.now() + data.tailWindowMinutes * 60 * 1000);

  const bet = await db
    .insert(bets)
    .values({
      ...data,
      tailWindowEndsAt,
    })
    .returning();

  return bet[0];
}

export async function getBetById(betId: string) {
  const bet = await db
    .select()
    .from(bets)
    .where(eq(bets.id, betId))
    .limit(1);

  return bet[0] || null;
}

export async function getBetWithStats(betId: string): Promise<BetWithStats | null> {
  const bet = await getBetById(betId);
  if (!bet) return null;

  // Get tail stats
  const stats = await db
    .select({
      totalTails: sql<number>`count(${tails.id})`,
      validTails: sql<number>`count(case when ${tails.isValid} = true then 1 end)`,
    })
    .from(tails)
    .where(eq(tails.betId, betId));

  const now = new Date();
  const timeRemaining = Math.max(0, Math.floor((bet.tailWindowEndsAt.getTime() - now.getTime()) / (1000 * 60)));
  const isExpired = bet.tailWindowEndsAt < now;

  return {
    ...bet,
    totalTails: stats[0]?.totalTails || 0,
    validTails: stats[0]?.validTails || 0,
    timeRemaining: isExpired ? 0 : timeRemaining,
    isExpired,
  };
}

export async function getBetsForChallenge(challengeId: string) {
  const betsList = await db
    .select()
    .from(bets)
    .where(eq(bets.challengeId, challengeId))
    .orderBy(desc(bets.createdAt));

  // Get stats for each bet
  const betsWithStats = await Promise.all(
    betsList.map(async (bet: Bet) => {
      const stats = await db
        .select({
          totalTails: sql<number>`count(${tails.id})`,
          validTails: sql<number>`count(case when ${tails.isValid} = true then 1 end)`,
        })
        .from(tails)
        .where(eq(tails.betId, bet.id));

      const now = new Date();
      const timeRemaining = Math.max(0, Math.floor((bet.tailWindowEndsAt.getTime() - now.getTime()) / (1000 * 60)));
      const isExpired = bet.tailWindowEndsAt < now;

      return {
        ...bet,
        totalTails: stats[0]?.totalTails || 0,
        validTails: stats[0]?.validTails || 0,
        timeRemaining: isExpired ? 0 : timeRemaining,
        isExpired,
      };
    })
  );

  return betsWithStats;
}

export async function getActiveBetsForChallenge(challengeId: string) {
  const now = new Date();
  
  return await db
    .select()
    .from(bets)
    .where(and(
      eq(bets.challengeId, challengeId),
      eq(bets.status, "open"),
      gte(bets.tailWindowEndsAt, now)
    ))
    .orderBy(desc(bets.createdAt));
}

export async function updateBetStatus(betId: string, status: "open" | "closed" | "hidden") {
  const updated = await db
    .update(bets)
    .set({ 
      status,
      updatedAt: new Date(),
    })
    .where(eq(bets.id, betId))
    .returning();

  return updated[0];
}

export async function closeExpiredBets() {
  const now = new Date();
  
  return await db
    .update(bets)
    .set({ 
      status: "closed",
      updatedAt: new Date(),
    })
    .where(and(
      eq(bets.status, "open"),
      lte(bets.tailWindowEndsAt, now)
    ))
    .returning();
}

export async function getAllBets() {
  const betsList = await db
    .select({
      id: bets.id,
      challengeId: bets.challengeId,
      title: bets.title,
      caption: bets.caption,
      tailLink: bets.tailLink,
      imageUrl: bets.imageUrl,
      sportsbook: bets.sportsbook,
      league: bets.league,
      tailWindowMinutes: bets.tailWindowMinutes,
      tailWindowEndsAt: bets.tailWindowEndsAt,
      status: bets.status,
      postedBy: bets.postedBy,
      createdAt: bets.createdAt,
      updatedAt: bets.updatedAt,
      challengeTitle: challenges.title,
      challengeDescription: challenges.description,
      challengeStatus: challenges.status,
    })
    .from(bets)
    .leftJoin(challenges, eq(bets.challengeId, challenges.id))
    .orderBy(desc(bets.createdAt));

  // Get stats for each bet
  const betsWithStats = await Promise.all(
    betsList.map(async (bet: any) => {
      const stats = await db
        .select({
          totalTails: sql<number>`count(${tails.id})`,
          validTails: sql<number>`count(case when ${tails.isValid} = true then 1 end)`,
        })
        .from(tails)
        .where(eq(tails.betId, bet.id));

      const now = new Date();
      const timeRemaining = Math.max(0, Math.floor((bet.tailWindowEndsAt.getTime() - now.getTime()) / (1000 * 60)));
      const isExpired = bet.tailWindowEndsAt < now;

      return {
        ...bet,
        totalTails: stats[0]?.totalTails || 0,
        validTails: stats[0]?.validTails || 0,
        timeRemaining: isExpired ? 0 : timeRemaining,
        isExpired,
      };
    })
  );

  return betsWithStats;
}

