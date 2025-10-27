import { db, users } from "./db";
import { eq } from "drizzle-orm";

export interface WhopUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

export async function getOrCreateUser(whopUser: WhopUser) {
  // Try to find existing user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.whopUserId, whopUser.id))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // Create new user
  const newUser = await db
    .insert(users)
    .values({
      whopUserId: whopUser.id,
      username: whopUser.username,
      displayName: whopUser.display_name,
      avatarUrl: whopUser.avatar_url,
    })
    .returning();

  return newUser[0];
}

export async function getUserById(userId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0] || null;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.isAdmin || false;
}

