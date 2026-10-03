import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

process.env.DATABASE_URL = "file::memory:";

let closeDatabase: () => void;
let db: typeof import("@/db/client").db;
let users: typeof import("@/db/auth-schema").user;
let createTask: typeof import("@/lib/tasks").createTask;
let deleteTask: typeof import("@/lib/tasks").deleteTask;
let getTask: typeof import("@/lib/tasks").getTask;
let listTasks: typeof import("@/lib/tasks").listTasks;
let updateTask: typeof import("@/lib/tasks").updateTask;
const defaultTaskFields = { priority: 3, dueDate: null };

describe("task repository", () => {
  beforeAll(async () => {
    vi.resetModules();
    const [database, migrator, authSchema, repository] = await Promise.all([
      import("@/db/client"),
      import("drizzle-orm/libsql/migrator"),
      import("@/db/auth-schema"),
      import("@/lib/tasks"),
    ]);

    db = database.db;
    users = authSchema.user;
    createTask = repository.createTask;
    deleteTask = repository.deleteTask;
    getTask = repository.getTask;
    listTasks = repository.listTasks;
    updateTask = repository.updateTask;
    closeDatabase = () => database.client.close();

    await database.dbReady;
    await migrator.migrate(db, { migrationsFolder: "./drizzle" });
    const now = new Date();
    await db.insert(users).values([
      {
        id: "owner-one",
        name: "First User",
        email: "first@example.com",
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "owner-two",
        name: "Second User",
        email: "second@example.com",
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });

  afterAll(async () => {
    await closeDatabase?.();
  });

  it("keeps CRUD scoped to the owning account", async () => {
    const created = await createTask("owner-one", {
      title: "Plan the week",
      description: "Write down the next steps.",
      ...defaultTaskFields,
    });

    expect(created.title).toBe("Plan the week");
    expect(await getTask("owner-one", created.id)).not.toBeNull();
    expect(await getTask("owner-two", created.id)).toBeNull();
    expect(
      await updateTask("owner-two", created.id, {
        title: "Changed by another user",
        description: "Not allowed",
        ...defaultTaskFields,
      }),
    ).toBe(false);
    expect(await deleteTask("owner-two", created.id)).toBe(false);
    expect((await getTask("owner-one", created.id))?.title).toBe("Plan the week");
    expect(await deleteTask("owner-one", created.id)).toBe(true);
  });

  it("bounds task reads and paginates larger lists", async () => {
    for (let index = 0; index < 27; index += 1) {
      await createTask("owner-one", {
        title: `Task ${index}`,
        description: "",
        ...defaultTaskFields,
      });
    }

    const firstPage = await listTasks("owner-one", 1);
    const secondPage = await listTasks("owner-one", 2);

    expect(firstPage.tasks).toHaveLength(25);
    expect(firstPage.total).toBe(27);
    expect(firstPage.pageCount).toBe(2);
    expect(secondPage.tasks).toHaveLength(2);
  });

  it("searches titles and descriptions only within the current account", async () => {
    await createTask("owner-one", {
      title: "Project Atlas",
      description: "Prepare 100% of the release notes.",
      ...defaultTaskFields,
    });

    expect((await listTasks("owner-one", 1, "atlas")).total).toBe(1);
    expect((await listTasks("owner-one", 1, "RELEASE NOTES")).total).toBe(1);
    expect((await listTasks("owner-one", 1, "100%")).total).toBe(1);
    expect((await listTasks("owner-two", 1, "atlas")).total).toBe(0);
  });
});