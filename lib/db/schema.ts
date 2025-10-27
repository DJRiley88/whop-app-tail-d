import { pgTable, text, timestamp, integer, decimal, boolean, json, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Enums
export const challengeStatusEnum = pgEnum("challenge_status", ["draft", "active", "ended", "archived"]);
export const betStatusEnum = pgEnum("bet_status", ["open", "closed", "hidden"]);
export const sportsbookEnum = pgEnum("sportsbook", ["prizepicks", "underdog", "draftkings", "fanduel", "betmgm", "other"]);
export const leagueEnum = pgEnum("league", ["nfl", "nba", "nhl", "mlb", "ncaaf", "ncaab", "soccer", "tennis", "golf", "other"]);
export const tieHandlingEnum = pgEnum("tie_handling", ["split", "tiebreaker"]);

// Users table (Whop users)
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  whopUserId: text("whop_user_id").notNull().unique(),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Challenges table
export const challenges = pgTable("challenges", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrizePool: decimal("total_prize_pool", { precision: 10, scale: 2 }).notNull(),
  firstPlacePercentage: integer("first_place_percentage").notNull().default(70),
  secondPlacePercentage: integer("second_place_percentage").notNull().default(20),
  thirdPlacePercentage: integer("third_place_percentage").notNull().default(10),
  status: challengeStatusEnum("status").notNull().default("draft"),
  tieHandling: tieHandlingEnum("tie_handling").notNull().default("split"),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bets table
export const bets = pgTable("bets", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  challengeId: text("challenge_id").notNull().references(() => challenges.id),
  title: text("title").notNull(),
  caption: text("caption"),
  tailLink: text("tail_link").notNull(),
  imageUrl: text("image_url"),
  sportsbook: sportsbookEnum("sportsbook").notNull(),
  league: leagueEnum("league").notNull(),
  tailWindowMinutes: integer("tail_window_minutes").notNull(),
  tailWindowEndsAt: timestamp("tail_window_ends_at").notNull(),
  status: betStatusEnum("status").notNull().default("open"),
  postedBy: text("posted_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tails table (member clicks on bets)
export const tails = pgTable("tails", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  betId: text("bet_id").notNull().references(() => bets.id),
  userId: text("user_id").notNull().references(() => users.id),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  pointsAwarded: integer("points_awarded").notNull().default(0),
  isValid: boolean("is_valid").notNull().default(false),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User challenge participation
export const userChallenges = pgTable("user_challenges", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id),
  challengeId: text("challenge_id").notNull().references(() => challenges.id),
  totalPoints: integer("total_points").notNull().default(0),
  rank: integer("rank"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastTailAt: timestamp("last_tail_at"),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "new_bet", "tail_reminder", "winners_announced"
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: json("data"), // Additional data like bet_id, challenge_id
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics cache table for performance
export const analyticsCache = pgTable("analytics_cache", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  challengeId: text("challenge_id").references(() => challenges.id),
  metric: text("metric").notNull(), // "total_tails", "unique_tailers", etc.
  timeRange: text("time_range").notNull(), // "24h", "7d", "30d", "all_time"
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
});

// Indexes for performance
export const userChallengesIndex = userChallenges.challengeId;
export const tailsBetIndex = tails.betId;
export const tailsUserIndex = tails.userId;
export const betsChallengeIndex = bets.challengeId;
export const notificationsUserIndex = notifications.userId;

