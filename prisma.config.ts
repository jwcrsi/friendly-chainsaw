import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use PostgreSQL schema in production, SQLite in development
const schemaPath =
  process.env.NODE_ENV === "production" && process.env.DATABASE_URL?.startsWith("postgresql")
    ? "prisma/schema.postgres.prisma"
    : "prisma/schema.prisma";

export default defineConfig({
  schema: schemaPath,
});
