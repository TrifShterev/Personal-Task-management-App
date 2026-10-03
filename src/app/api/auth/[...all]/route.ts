import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { dbReady } from "@/db/client";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
	await dbReady;
	return handlers.GET(request);
}

export async function POST(request: NextRequest) {
	await dbReady;
	return handlers.POST(request);
}