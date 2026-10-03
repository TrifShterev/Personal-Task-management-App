import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

const errors: Record<string, string> = {
  invalid: "Enter a valid email and password.",
  credentials: "Those sign-in details did not match an account.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentSession()) {
    redirect("/tasks");
  }

  const { error } = await searchParams;

  return (
    <section className="auth-panel">
      <p className="eyebrow">A little more headspace</p>
      <h1>Welcome back</h1>
      <p className="auth-copy">Sign in to pick up where you left off.</p>
      {error && errors[error] ? (
        <p className="form-error" role="alert">
          {errors[error]}
        </p>
      ) : null}
      <form action="/api/forms/sign-in" method="post">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="button" type="submit">
          Sign in
        </button>
      </form>
      <p className="auth-switch">
        New to TodAI? <a href="/sign-up">Create an account</a>
      </p>
    </section>
  );
}