import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/todai.db";

if (databaseUrl.startsWith("file:")) {
  const localPath = databaseUrl.slice("file:".length);
  mkdirSync(dirname(resolve(localPath)), { recursive: true });
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/*.ts",
  out: "./drizzle",
  dbCredentials: { url: databaseUrl },
});