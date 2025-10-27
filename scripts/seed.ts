import { config } from "dotenv";
import postgres from "postgres";

// Load environment variables
config({ path: [".env.development.local", ".env.local", ".env"] });

const connectionString = process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.log("⚠️  No POSTGRES_URL_NON_POOLING found. Skipping seed.");
  process.exit(0);
}

async function seedDatabase() {
  console.log("🌱 Seeding database with demo challenges...");

  const sql = postgres(connectionString, { max: 1 });

  try {
    // Create a demo admin user
    console.log("📝 Creating demo admin user...");
    
    await sql`
      INSERT INTO users (id, whop_user_id, username, display_name, avatar_url, is_admin, created_at, updated_at)
      VALUES ('demo_admin', 'demo_admin_whop', 'demo_admin', 'Demo Admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo', true, NOW(), NOW())
      ON CONFLICT (whop_user_id) DO NOTHING;
    `;

    // Create demo challenges
    console.log("🏆 Creating demo challenges...");

    const demoChallenges = [
      {
        id: "demo_challenge_1",
        title: "NBA Playoffs Challenge",
        description: "Compete in this week's NBA playoff games! Tail betting slips to earn points and climb the leaderboard.",
        start_date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Ends in 7 days
        total_prize_pool: "5000.00",
        first_place_percentage: 70,
        second_place_percentage: 20,
        third_place_percentage: 10,
        status: "active",
        tie_handling: "split",
        created_by: "demo_admin",
      },
      {
        id: "demo_challenge_2",
        title: "NFL Sunday Challenge",
        description: "Sunday Funday! Tail the best NFL bets and compete for a $3000 prize pool.",
        start_date: new Date(Date.now()),
        end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        total_prize_pool: "3000.00",
        first_place_percentage: 70,
        second_place_percentage: 20,
        third_place_percentage: 10,
        status: "active",
        tie_handling: "tiebreaker",
        created_by: "demo_admin",
      },
    ];

    for (const challenge of demoChallenges) {
      await sql`
        INSERT INTO challenges (
          id, title, description, start_date, end_date, 
          total_prize_pool, first_place_percentage, second_place_percentage, 
          third_place_percentage, status, tie_handling, created_by, created_at, updated_at
        )
        VALUES (
          ${challenge.id},
          ${challenge.title},
          ${challenge.description},
          ${challenge.start_date},
          ${challenge.end_date},
          ${challenge.total_prize_pool},
          ${challenge.first_place_percentage},
          ${challenge.second_place_percentage},
          ${challenge.third_place_percentage},
          ${challenge.status},
          ${challenge.tie_handling},
          ${challenge.created_by},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Create demo bets
    console.log("📊 Creating demo bets...");

    const demoBets = [
      {
        id: "demo_bet_1",
        challenge_id: "demo_challenge_1",
        title: "Lakers vs Warriors Over 225.5",
        caption: "High-scoring game expected with both teams in good form",
        tail_link: "https://prizepicks.com/bet/123",
        image_url: null,
        sportsbook: "prizepicks",
        league: "nba",
        tail_window_minutes: 45,
        tail_window_ends_at: new Date(Date.now() + 45 * 60 * 1000),
        status: "open",
        posted_by: "demo_admin",
      },
      {
        id: "demo_bet_2",
        challenge_id: "demo_challenge_1",
        title: "Suns vs Nuggets Under 210.5",
        caption: "Defensive battle incoming",
        tail_link: "https://prizepicks.com/bet/456",
        image_url: null,
        sportsbook: "prizepicks",
        league: "nba",
        tail_window_minutes: 30,
        tail_window_ends_at: new Date(Date.now() + 30 * 60 * 1000),
        status: "open",
        posted_by: "demo_admin",
      },
      {
        id: "demo_bet_3",
        challenge_id: "demo_challenge_2",
        title: "Chiefs -3.5 vs Bills",
        caption: "Chiefs at home with Mahomes looking sharp",
        tail_link: "https://draftkings.com/bet/789",
        image_url: null,
        sportsbook: "draftkings",
        league: "nfl",
        tail_window_minutes: 60,
        tail_window_ends_at: new Date(Date.now() + 60 * 60 * 1000),
        status: "open",
        posted_by: "demo_admin",
      },
    ];

    for (const bet of demoBets) {
      await sql`
        INSERT INTO bets (
          id, challenge_id, title, caption, tail_link, image_url,
          sportsbook, league, tail_window_minutes, tail_window_ends_at,
          status, posted_by, created_at, updated_at
        )
        VALUES (
          ${bet.id},
          ${bet.challenge_id},
          ${bet.title},
          ${bet.caption},
          ${bet.tail_link},
          ${bet.image_url},
          ${bet.sportsbook},
          ${bet.league},
          ${bet.tail_window_minutes},
          ${bet.tail_window_ends_at},
          ${bet.status},
          ${bet.posted_by},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Create demo user challenges (participation)
    console.log("👥 Creating demo participation records...");

    // Add some demo users
    const demoUsers = [
      { id: "demo_user_1", whop_user_id: "demo_whop_1", username: "player1", display_name: "Player One" },
      { id: "demo_user_2", whop_user_id: "demo_whop_2", username: "player2", display_name: "Player Two" },
      { id: "demo_user_3", whop_user_id: "demo_whop_3", username: "player3", display_name: "Player Three" },
    ];

    for (const user of demoUsers) {
      await sql`
        INSERT INTO users (id, whop_user_id, username, display_name, avatar_url, is_admin, created_at, updated_at)
        VALUES (
          ${user.id},
          ${user.whop_user_id},
          ${user.username},
          ${user.display_name},
          ${`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`},
          false,
          NOW(),
          NOW()
        )
        ON CONFLICT (whop_user_id) DO NOTHING;
      `;
    }

    // Add user challenge participation
    await sql`
      INSERT INTO user_challenges (id, user_id, challenge_id, total_points, rank, joined_at, last_tail_at)
      VALUES 
        ('uc_demo_user_1_challenge_1', 'demo_user_1', 'demo_challenge_1', 156, 1, NOW(), NOW() - INTERVAL '1 hour'),
        ('uc_demo_user_2_challenge_1', 'demo_user_2', 'demo_challenge_1', 142, 2, NOW(), NOW() - INTERVAL '2 hours'),
        ('uc_demo_user_3_challenge_1', 'demo_user_3', 'demo_challenge_1', 128, 3, NOW(), NOW() - INTERVAL '3 hours')
      ON CONFLICT DO NOTHING;
    `;

    // Add some demo tails
    console.log("🎯 Creating demo tails...");

    await sql`
      INSERT INTO tails (id, bet_id, user_id, clicked_at, points_awarded, is_valid, ip_address, user_agent, created_at)
      VALUES 
        ('tail_1', 'demo_bet_1', 'demo_user_1', NOW() - INTERVAL '30 minutes', 1, true, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '30 minutes'),
        ('tail_2', 'demo_bet_1', 'demo_user_2', NOW() - INTERVAL '45 minutes', 1, true, '192.168.1.2', 'Mozilla/5.0', NOW() - INTERVAL '45 minutes'),
        ('tail_3', 'demo_bet_2', 'demo_user_1', NOW() - INTERVAL '1 hour', 1, true, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '1 hour'),
        ('tail_4', 'demo_bet_2', 'demo_user_3', NOW() - INTERVAL '2 hours', 1, true, '192.168.1.3', 'Mozilla/5.0', NOW() - INTERVAL '2 hours')
      ON CONFLICT (id) DO NOTHING;
    `;

    await sql.end();
    console.log("✅ Database seeded successfully!");
    console.log("");
    console.log("📝 Demo data created:");
    console.log("   - 1 Admin user");
    console.log("   - 3 Regular users");
    console.log("   - 2 Active challenges");
    console.log("   - 3 Demo bets");
    console.log("   - 4 Demo tails");
    console.log("");
    console.log("🎮 Your app is ready to use!");
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    if (error.message?.includes("already exists")) {
      console.log("ℹ️  Some data already exists. This is fine.");
    } else {
      throw error;
    }
  }
}

seedDatabase();

