import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <a className="brand" href="/" aria-label="TodAI home">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          TodAI
        </a>
      </div>
      {children}
    </main>
  );
}