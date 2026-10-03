import { NextResponse } from "next/server";
import { dbReady } from "@/db/client";
import { auth } from "@/lib/auth";

export function sameOriginError(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");

  if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  return null;
}

export function redirectTo(request: Request, path: string, status = 303) {
  return NextResponse.redirect(new URL(path, request.url), status);
}

export async function requestSession(request: Request) {
  await dbReady;
  return auth.api.getSession({ headers: request.headers });
}

export async function submitAuthForm(
  request: Request,
  endpoint: "sign-up/email" | "sign-in/email" | "sign-out",
  body: Record<string, string>,
  successPath: string,
  failurePath: string,
) {
  const originError = sameOriginError(request);

  if (originError) {
    return originError;
  }

  await dbReady;
  const authResponse = await auth.handler(
    new Request(new URL(`/api/auth/${endpoint}`, request.url), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: new URL(request.url).origin,
        cookie: request.headers.get("cookie") ?? "",
        "user-agent": request.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify(body),
    }),
  );

  if (!authResponse.ok) {
    return redirectTo(request, failurePath);
  }

  const response = redirectTo(request, successPath);

  for (const cookie of authResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}