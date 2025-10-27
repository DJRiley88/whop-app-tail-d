import { db, tails, bets, challenges, users, analyticsCache } from "../db";
import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";

export interface AnalyticsData {
  totalTails: {
    last24h: number;
    last7d: number;
    last30d: number;
    allTime: number;
  };
  uniqueTailers: {
    last24h: number;
    last7d: number;
    last30d: number;
    allTime: number;
  };
  averageTailsPerBet: number;
  tailWindowConversionRate: number;
  topSportsbooks: Array<{ sportsbook: string; count: number }>;
  topLeagues: Array<{ league: string; count: number }>;
  timeToFirst10Tails: number; // median in minutes
  betPerformance: Array<{
    betId: string;
    title: string;
    views: number;
    inWindowTails: number;
    outOfWindowTails: number;
    conversionRate: number;
  }>;
}

export async function getAnalytics(challengeId?: string, timeRange?: "24h" | "7d" | "30d" | "all"): Promise<AnalyticsData> {
  const now = new Date();
  const timeFilters = {
    "24h": gte(tails.clickedAt, new Date(now.getTime() - 24 * 60 * 60 * 1000)),
    "7d": gte(tails.clickedAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
    "30d": gte(tails.clickedAt, new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
    "all": sql`1=1`,
  };

  // Total tails by time range
  const totalTails = {
    last24h: await getTotalTails(challengeId, timeFilters["24h"]),
    last7d: await getTotalTails(challengeId, timeFilters["7d"]),
    last30d: await getTotalTails(challengeId, timeFilters["30d"]),
    allTime: await getTotalTails(challengeId, timeFilters["all"]),
  };

  // Unique tailers by time range
  const uniqueTailers = {
    last24h: await getUniqueTailers(challengeId, timeFilters["24h"]),
    last7d: await getUniqueTailers(challengeId, timeFilters["7d"]),
    last30d: await getUniqueTailers(challengeId, timeFilters["30d"]),
    allTime: await getUniqueTailers(challengeId, timeFilters["all"]),
  };

  // Average tails per bet
  const averageTailsPerBet = await getAverageTailsPerBet(challengeId);

  // Tail window conversion rate
  const tailWindowConversionRate = await getTailWindowConversionRate(challengeId);

  // Top sportsbooks
  const topSportsbooks = await getTopSportsbooks(challengeId);

  // Top leagues
  const topLeagues = await getTopLeagues(challengeId);

  // Time to first 10 tails (median)
  const timeToFirst10Tails = await getTimeToFirst10Tails(challengeId);

  // Bet performance
  const betPerformance = await getBetPerformance(challengeId);

  return {
    totalTails,
    uniqueTailers,
    averageTailsPerBet,
    tailWindowConversionRate,
    topSportsbooks,
    topLeagues,
    timeToFirst10Tails,
    betPerformance,
  };
}

async function getTotalTails(challengeId?: string, timeFilter?: any) {
  let query = db
    .select({ count: sql<number>`count(${tails.id})` })
    .from(tails);

  if (challengeId) {
    query = query
      .innerJoin(bets, eq(tails.betId, bets.id))
      .where(and(
        eq(bets.challengeId, challengeId),
        timeFilter
      ));
  } else if (timeFilter) {
    query = query.where(timeFilter);
  }

  const result = await query;
  return result[0]?.count || 0;
}

async function getUniqueTailers(challengeId?: string, timeFilter?: any) {
  let query = db
    .select({ count: sql<number>`count(distinct ${tails.userId})` })
    .from(tails);

  if (challengeId) {
    query = query
      .innerJoin(bets, eq(tails.betId, bets.id))
      .where(and(
        eq(bets.challengeId, challengeId),
        timeFilter
      ));
  } else if (timeFilter) {
    query = query.where(timeFilter);
  }

  const result = await query;
  return result[0]?.count || 0;
}

async function getAverageTailsPerBet(challengeId?: string) {
  let query = db
    .select({
      avgTails: sql<number>`avg(tail_count)`,
    })
    .from(
      db
        .select({
          betId: tails.betId,
          tailCount: sql<number>`count(${tails.id})`,
        })
        .from(tails)
        .groupBy(tails.betId)
        .as("bet_tails")
    );

  if (challengeId) {
    query = query
      .innerJoin(bets, eq(sql`bet_tails.bet_id`, bets.id))
      .where(eq(bets.challengeId, challengeId));
  }

  const result = await query;
  return result[0]?.avgTails || 0;
}

async function getTailWindowConversionRate(challengeId?: string) {
  // This would need to track bet views, which isn't in our current schema
  // For now, return a placeholder calculation
  const totalTails = await getTotalTails(challengeId);
  const validTails = await db
    .select({ count: sql<number>`count(${tails.id})` })
    .from(tails)
    .where(eq(tails.isValid, true));

  if (challengeId) {
    const validTailsWithChallenge = await db
      .select({ count: sql<number>`count(${tails.id})` })
      .from(tails)
      .innerJoin(bets, eq(tails.betId, bets.id))
      .where(and(
        eq(bets.challengeId, challengeId),
        eq(tails.isValid, true)
      ));

    return totalTails > 0 ? (validTailsWithChallenge[0]?.count || 0) / totalTails : 0;
  }

  return totalTails > 0 ? (validTails[0]?.count || 0) / totalTails : 0;
}

async function getTopSportsbooks(challengeId?: string) {
  let query = db
    .select({
      sportsbook: bets.sportsbook,
      count: sql<number>`count(${tails.id})`,
    })
    .from(tails)
    .innerJoin(bets, eq(tails.betId, bets.id))
    .groupBy(bets.sportsbook)
    .orderBy(desc(sql`count(${tails.id})`))
    .limit(5);

  if (challengeId) {
    query = query.where(eq(bets.challengeId, challengeId));
  }

  return await query;
}

async function getTopLeagues(challengeId?: string) {
  let query = db
    .select({
      league: bets.league,
      count: sql<number>`count(${tails.id})`,
    })
    .from(tails)
    .innerJoin(bets, eq(tails.betId, bets.id))
    .groupBy(bets.league)
    .orderBy(desc(sql`count(${tails.id})`))
    .limit(5);

  if (challengeId) {
    query = query.where(eq(bets.challengeId, challengeId));
  }

  return await query;
}

async function getTimeToFirst10Tails(challengeId?: string) {
  // This would require tracking when each bet reaches 10 tails
  // For now, return a placeholder
  return 0;
}

async function getBetPerformance(challengeId?: string) {
  let query = db
    .select({
      betId: bets.id,
      title: bets.title,
      inWindowTails: sql<number>`count(case when ${tails.isValid} = true then 1 end)`,
      outOfWindowTails: sql<number>`count(case when ${tails.isValid} = false then 1 end)`,
    })
    .from(bets)
    .leftJoin(tails, eq(tails.betId, bets.id))
    .groupBy(bets.id, bets.title)
    .orderBy(desc(sql`count(${tails.id})`));

  if (challengeId) {
    query = query.where(eq(bets.challengeId, challengeId));
  }

  const results = await query;
  
  return results.map((result: any) => ({
    betId: result.betId,
    title: result.title,
    views: result.inWindowTails + result.outOfWindowTails, // Approximation
    inWindowTails: result.inWindowTails,
    outOfWindowTails: result.outOfWindowTails,
    conversionRate: result.inWindowTails / (result.inWindowTails + result.outOfWindowTails) || 0,
  }));
}

export async function cacheAnalytics(challengeId: string, metric: string, timeRange: string, value: number) {
  await db
    .insert(analyticsCache)
    .values({
      challengeId,
      metric,
      timeRange,
      value: value.toString(),
    })
    .onConflictDoNothing();
}

