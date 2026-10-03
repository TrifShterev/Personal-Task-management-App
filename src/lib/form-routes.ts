import { NextResponse } from "next/server";
import { dbReady } from "@/db/client";
import { auth } from "@/lib/auth";

function requestOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim() ||
    request.headers.get("host") ||
    requestUrl.host;
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const protocol = forwardedProtocol
    ? forwardedProtocol.endsWith(":")
      ? forwardedProtocol
      : `${forwardedProtocol}:`
    : requestUrl.protocol;

  return new URL(`${protocol}//${host}`).origin;
}

export function sameOriginError(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");

  try {
    if (!origin || new URL(origin).origin !== requestOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  return null;
}

export function redirectTo(request: Request, path: string, status = 303) {
  return NextResponse.redirect(new URL(path, requestOrigin(request)), status);
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
  const origin = requestOrigin(request);
  const authResponse = await auth.handler(
    new Request(new URL(`/api/auth/${endpoint}`, origin), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin,
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