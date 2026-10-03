import { describe, expect, it, vi } from "vitest";

vi.mock("@/db/client", () => ({ dbReady: Promise.resolve(), db: {} }));
vi.mock("@/lib/auth", () => ({ auth: {} }));

import { redirectTo, sameOriginError } from "@/lib/form-routes";

describe("same-origin form guard", () => {
  it("accepts the browser origin from forwarded host headers", () => {
    const request = new Request("http://localhost:3101/api/forms/sign-up", {
      headers: {
        origin: "http://127.0.0.1:3101",
        "x-forwarded-host": "127.0.0.1:3101",
        "x-forwarded-proto": "http",
      },
    });

    expect(sameOriginError(request)).toBeNull();
  });

  it("keeps redirects on the forwarded browser host", () => {
    const request = new Request("http://localhost:3101/api/forms/sign-up", {
      headers: {
        host: "localhost:3101",
        "x-forwarded-host": "127.0.0.1:3101",
        "x-forwarded-proto": "http",
      },
    });

    expect(redirectTo(request, "/tasks").headers.get("location")).toBe(
      "http://127.0.0.1:3101/tasks",
    );
  });

  it("rejects missing, malformed, and cross-origin origins", () => {
    const requests = [
      new Request("http://localhost:3101/api/forms/sign-up"),
      new Request("http://localhost:3101/api/forms/sign-up", {
        headers: { origin: "not a URL", host: "localhost:3101" },
      }),
      new Request("http://localhost:3101/api/forms/sign-up", {
        headers: { origin: "https://attacker.example", host: "localhost:3101" },
      }),
    ];

    for (const request of requests) {
      expect(sameOriginError(request)?.status).toBe(403);
    }
  });
});