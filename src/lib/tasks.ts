import { and, count, desc, eq, or, sql } from "drizzle-orm";
import { db, dbReady } from "@/db/client";
import { tasks } from "@/db/schema";
import type { TaskInput } from "@/lib/validation";

export const TASKS_PER_PAGE = 25;

export async function listTasks(
  userId: string,
  requestedPage: number,
  requestedQuery = "",
) {
  await dbReady;
  const query = requestedQuery.trim().slice(0, 120);
  const where = query
    ? and(
        eq(tasks.userId, userId),
        or(
          sql`instr(lower(${tasks.title}), lower(${query})) > 0`,
          sql`instr(lower(${tasks.description}), lower(${query})) > 0`,
        ),
      )
    : eq(tasks.userId, userId);
  const [result] = await db
    .select({ total: count() })
    .from(tasks)
    .where(where);
  const total = result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / TASKS_PER_PAGE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const rows = total
    ? await db
        .select()
        .from(tasks)
        .where(where)
        .orderBy(desc(tasks.createdAt), desc(tasks.id))
        .limit(TASKS_PER_PAGE)
        .offset((page - 1) * TASKS_PER_PAGE)
    : [];

  return { tasks: rows, total, page, pageCount, query };
}

export async function getTask(userId: string, taskId: string) {
  await dbReady;
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .limit(1);

  return task ?? null;
}

export async function createTask(userId: string, input: TaskInput) {
  await dbReady;
  const [task] = await db
    .insert(tasks)
    .values({ ...input, userId })
    .returning();

  return task;
}

export async function updateTask(
  userId: string,
  taskId: string,
  input: TaskInput,
) {
  await dbReady;
  const [task] = await db
    .update(tasks)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning({ id: tasks.id });

  return Boolean(task);
}

export async function deleteTask(userId: string, taskId: string) {
  await dbReady;
  const [task] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning({ id: tasks.id });

  return Boolean(task);
}