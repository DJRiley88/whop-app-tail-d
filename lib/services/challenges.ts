import { db, challenges, bets, tails, userChallenges } from "../db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export interface CreateChallengeData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalPrizePool: number;
  firstPlacePercentage: number;
  secondPlacePercentage: number;
  thirdPlacePercentage: number;
  tieHandling: "split" | "tiebreaker";
  createdBy: string;
}

export interface ChallengeWithStats {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalPrizePool: string;
  firstPlacePercentage: number;
  secondPlacePercentage: number;
  thirdPlacePercentage: number;
  status: "draft" | "active" | "ended" | "archived";
  tieHandling: "split" | "tiebreaker";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  totalBets: number;
  totalTails: number;
  uniqueTailers: number;
}

export async function createChallenge(data: CreateChallengeData) {
  // Validate percentages sum to 100
  const totalPercentage = data.firstPlacePercentage + data.secondPlacePercentage + data.thirdPlacePercentage;
  if (totalPercentage !== 100) {
    throw new Error("Payout percentages must sum to 100%");
  }

  // Validate dates
  if (data.startDate >= data.endDate) {
    throw new Error("Start date must be before end date");
  }

  const challenge = await db
    .insert(challenges)
    .values({
      ...data,
      totalPrizePool: data.totalPrizePool.toString(),
    })
    .returning();

  return challenge[0];
}

export async function getChallengeById(challengeId: string) {
  const challenge = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .limit(1);

  return challenge[0] || null;
}

export async function getChallengeWithStats(challengeId: string): Promise<ChallengeWithStats | null> {
  const challenge = await getChallengeById(challengeId);
  if (!challenge) return null;

  // Get stats
  const stats = await db
    .select({
      totalBets: sql<number>`count(distinct ${bets.id})`,
      totalTails: sql<number>`count(distinct ${tails.id})`,
      uniqueTailers: sql<number>`count(distinct ${tails.userId})`,
    })
    .from(bets)
    .leftJoin(tails, eq(tails.betId, bets.id))
    .where(eq(bets.challengeId, challengeId));

  return {
    ...challenge,
    totalBets: stats[0]?.totalBets || 0,
    totalTails: stats[0]?.totalTails || 0,
    uniqueTailers: stats[0]?.uniqueTailers || 0,
  };
}

export async function updateChallengeStatus(challengeId: string, status: "draft" | "active" | "ended" | "archived") {
  const updated = await db
    .update(challenges)
    .set({ 
      status,
      updatedAt: new Date(),
    })
    .where(eq(challenges.id, challengeId))
    .returning();

  return updated[0];
}

export async function getActiveChallenges() {
  return await db
    .select()
    .from(challenges)
    .where(eq(challenges.status, "active"))
    .orderBy(desc(challenges.createdAt));
}

export async function getDraftChallenges(createdBy: string) {
  return await db
    .select()
    .from(challenges)
    .where(and(
      eq(challenges.status, "draft"),
      eq(challenges.createdBy, createdBy)
    ))
    .orderBy(desc(challenges.createdAt));
}

export async function startChallenge(challengeId: string, userId: string) {
  const challenge = await getChallengeById(challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.createdBy !== userId) {
    throw new Error("Only the creator can start a challenge");
  }

  if (challenge.status !== "draft") {
    throw new Error("Challenge is not in draft status");
  }

  return await updateChallengeStatus(challengeId, "active");
}

export async function endChallenge(challengeId: string, userId: string) {
  const challenge = await getChallengeById(challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.createdBy !== userId) {
    throw new Error("Only the creator can end a challenge");
  }

  if (challenge.status !== "active") {
    throw new Error("Challenge is not active");
  }

  return await updateChallengeStatus(challengeId, "ended");
}

