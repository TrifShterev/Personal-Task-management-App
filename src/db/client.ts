import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as authSchema from "./auth-schema";
import { tasks } from "./schema";

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/todai.db";

if (databaseUrl.startsWith("file:")) {
  const localPath = databaseUrl.slice("file:".length);
  mkdirSync(dirname(resolve(localPath)), { recursive: true });
}

export const client = createClient({
  url: databaseUrl,
  ...(process.env.DATABASE_AUTH_TOKEN
    ? { authToken: process.env.DATABASE_AUTH_TOKEN }
    : {}),
});

export const db = drizzle({
  client,
  schema: { ...authSchema, tasks },
});

export const dbReady = client.execute("PRAGMA foreign_keys = ON");