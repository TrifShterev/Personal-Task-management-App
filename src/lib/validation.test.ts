import { describe, expect, it } from "vitest";
import { signUpSchema, taskInputSchema } from "@/lib/validation";

describe("task input validation", () => {
  it("defaults omitted optional fields and trims task details", () => {
    expect(taskInputSchema.parse({ title: "  Plan the week  " })).toEqual({
      title: "Plan the week",
      description: "",
      priority: 3,
      dueDate: null,
    });
  });

  it("accepts priorities 1 through 4 and ISO due dates", () => {
    expect(
      taskInputSchema.parse({
        title: "Prepare report",
        priority: "1",
        dueDate: "2026-11-03",
      }),
    ).toMatchObject({ priority: 1, dueDate: "2026-11-03" });
  });

  it("rejects priorities outside 1 through 4 and non-integers", () => {
    for (const priority of ["0", "5", "2.5"]) {
      expect(taskInputSchema.safeParse({ title: "Task", priority }).success).toBe(
        false,
      );
    }
  });

  it("normalizes an empty due date to null and rejects invalid dates", () => {
    expect(
      taskInputSchema.parse({ title: "Task", dueDate: "" }).dueDate,
    ).toBeNull();
    expect(
      taskInputSchema.safeParse({ title: "Task", dueDate: "2026-02-30" })
        .success,
    ).toBe(false);
  });

  it("rejects blank or overlong titles", () => {
    expect(taskInputSchema.safeParse({ title: "   " }).success).toBe(false);
    expect(
      taskInputSchema.safeParse({ title: "t".repeat(121) }).success,
    ).toBe(false);
  });

  it("rejects descriptions longer than the supported limit", () => {
    expect(
      taskInputSchema.safeParse({
        title: "Notes",
        description: "d".repeat(10001),
      }).success,
    ).toBe(false);
  });
});

describe("sign-up validation", () => {
  it("requires a valid email and a 12-character password", () => {
    expect(
      signUpSchema.safeParse({
        name: "Sam",
        email: "sam@example.com",
        password: "secure-password",
      }).success,
    ).toBe(true);
    expect(
      signUpSchema.safeParse({
        name: "Sam",
        email: "sam@example.com",
        password: "short",
      }).success,
    ).toBe(false);
  });
});