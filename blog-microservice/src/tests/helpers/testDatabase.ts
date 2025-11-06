import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PrismaClient } from "../../../generated/client";
import { execSync } from "child_process";
import { join } from "path";

let container: StartedPostgreSqlContainer | null = null;
let prismaClient: PrismaClient | null = null;

/**
 * Start a PostgreSQL test container using Testcontainers
 */
async function startTestDatabase(): Promise<StartedPostgreSqlContainer> {
  if (container) {
    return container;
  }

  container = await new PostgreSqlContainer("postgres:17.6")
    .withDatabase("blog_test")
    .withUsername("postgres")
    .withPassword("postgres")
    .start();

  return container;
}

/**
 * Stop the test database container
 */
async function stopTestDatabase(): Promise<void> {
  if (container) {
    await container.stop();
    container = null;
  }
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}

/**
 * Get the connection string for the test database
 */
function getTestDatabaseUrl(): string {
  if (!container) {
    throw new Error("Test database container not started. Call startTestDatabase() first.");
  }
  return container.getConnectionUri();
}

/**
 * Get a Prisma client connected to the test database
 */
async function getTestPrismaClient(): Promise<PrismaClient> {
  if (prismaClient) {
    return prismaClient;
  }

  const databaseUrl = getTestDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;

  // Run migrations using db push (faster for test databases)
  const prismaSchemaPath = join(__dirname, "../../../prisma/schema.prisma");
  try {
    execSync(
      `npx prisma db push --schema=${prismaSchemaPath} --skip-generate --accept-data-loss`,
      {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: "pipe",
      },
    );
  } catch (error) {
    console.error("Failed to push schema:", error);
    throw error;
  }

  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  return prismaClient;
}

/**
 * Clean the test database (truncate all tables)
 */
export async function cleanTestDatabase(): Promise<void> {
  if (!prismaClient) {
    return;
  }

  // Truncate all tables in the correct order (respecting foreign keys)
  await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "BlogPost" RESTART IDENTITY CASCADE;`);
}

/**
 * Setup test database (start container, run migrations, return client)
 */
export async function setupTestDatabase(): Promise<PrismaClient> {
  await startTestDatabase();
  return await getTestPrismaClient();
}

/**
 * Teardown test database (clean and disconnect)
 */
export async function teardownTestDatabase(): Promise<void> {
  if (prismaClient) {
    await cleanTestDatabase();
    await prismaClient.$disconnect();
    prismaClient = null;
  }
  await stopTestDatabase();
}

