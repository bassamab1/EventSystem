import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load environment variables from your .env file for the CLI
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});