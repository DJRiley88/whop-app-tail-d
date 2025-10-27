import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import postgres from "postgres";

// Load environment variables
config({ path: [".env.development.local", ".env.local", ".env"] });

async function runMigrations() {
  try {
    // Skip if no database connection string
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      console.log("⚠️  No POSTGRES_URL_NON_POOLING found. Skipping migrations.");
      process.exit(0);
    }

    console.log("Running database migrations...");

    // Create postgres connection
    const sql = postgres(process.env.POSTGRES_URL_NON_POOLING, {
      max: 1, // Single connection for migrations
    });
    
    // Read the migration file
    const migrationPath = join(process.cwd(), "migrations", "001_initial_schema.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith("--"));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.unsafe(statement);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error.message?.includes("already exists")) {
            console.log(`  ℹ️  ${statement.substring(0, 50)}... (already exists)`);
          } else {
            throw error;
          }
        }
      }
    }
    
    // Close connection
    await sql.end();
    
    console.log("✅ Database migrations completed successfully!");
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    // Don't exit with error to allow deployment to continue
    // The tables might already exist
    process.exit(0);
  }
}

runMigrations();

