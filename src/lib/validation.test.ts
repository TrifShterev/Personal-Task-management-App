import { describe, expect, it } from "vitest";
import { signUpSchema, taskInputSchema } from "@/lib/validation";

describe("task input validation", () => {
  it("trims a valid title and accepts an empty description", () => {
    expect(taskInputSchema.parse({ title: "  Plan the week  " })).toEqual({
      title: "Plan the week",
      description: "",
    });
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