import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export const runtime = "nodejs";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/tasks" aria-label="TodAI tasks">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          TodAI
        </a>
        <div className="header-tools">
          <span className="header-account">{session.user.name}</span>
          <form className="header-form" action="/api/forms/sign-out" method="post">
            <button className="text-button" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}