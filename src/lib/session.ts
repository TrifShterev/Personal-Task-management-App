import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dbReady } from "@/db/client";
import { auth } from "@/lib/auth";

export const getCurrentSession = cache(async () => {
  await dbReady;
  return auth.api.getSession({ headers: await headers() });
});

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}