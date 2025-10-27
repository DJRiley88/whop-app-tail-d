import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL_NON_POOLING;

// Create the connection only if database URL is available
let client: any = null;
let db: any = null;

if (connectionString) {
  client = postgres(connectionString);
  db = drizzle(client, { schema });
} else {
  console.warn("POSTGRES_URL_NON_POOLING not found. Database features will be disabled.");
  // Create a comprehensive mock database object for development
  const createMockQuery = () => ({
    from: () => ({
      where: () => ({ 
        limit: () => [],
        orderBy: () => [],
        innerJoin: () => ({ where: () => [] })
      }),
      leftJoin: () => ({ orderBy: () => [] }),
      orderBy: () => [],
      select: () => ({ where: () => ({ limit: () => [], orderBy: () => [] }) })
    }),
    where: () => ({ 
      limit: () => [],
      orderBy: () => [],
      innerJoin: () => ({ where: () => [] })
    }),
    limit: () => [],
    leftJoin: () => ({ orderBy: () => [] }),
    orderBy: () => [],
  });

  db = {
    select: () => ({
      from: () => ({
        where: () => ({ 
          limit: () => [],
          orderBy: () => [],
          innerJoin: () => ({ where: () => [] })
        }),
        orderBy: () => [],
        innerJoin: () => ({ where: () => [] })
      }),
      where: () => ({ 
        limit: () => [],
        orderBy: () => []
      })
    }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
    delete: () => ({ where: () => [] }),
    execute: async () => ({ rows: [] })
  };
}

export { db };

// Export schema for use in other files
export * from "./schema";

