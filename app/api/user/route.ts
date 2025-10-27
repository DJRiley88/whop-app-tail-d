import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser, isUserAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get user from Whop headers
    const whopUserId = request.headers.get("x-whop-user-id");
    console.log("[API /user] Whop headers:", {
      userId: whopUserId,
      username: request.headers.get("x-whop-username"),
      displayName: request.headers.get("x-whop-display-name"),
    });
    
    if (!whopUserId) {
      console.log("[API /user] No whop-user-id header found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser({
      id: whopUserId,
      username: request.headers.get("x-whop-username") || "unknown",
      display_name: request.headers.get("x-whop-display-name") || "Unknown User",
      avatar_url: request.headers.get("x-whop-avatar-url") || undefined,
    });

    // Check if user is admin
    const isAdmin = await isUserAdmin(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        isAdmin,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

