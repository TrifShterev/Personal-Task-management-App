import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = { title: "Create account" };

const errors: Record<string, string> = {
  invalid: "Check your details. Passwords must be at least 12 characters.",
  account: "We could not create that account. Try another email address.",
};

export default async function SignUpPage({
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
      <p className="eyebrow">Make room for what matters</p>
      <h1>Create your account</h1>
      <p className="auth-copy">Your task list is private to your account.</p>
      {error && errors[error] ? (
        <p className="form-error" role="alert">
          {errors[error]}
        </p>
      ) : null}
      <form action="/api/forms/sign-up" method="post">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
          />
        </div>
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
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />
          <p className="field-hint">Use at least 12 characters.</p>
        </div>
        <button className="button" type="submit">
          Create account
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <a href="/sign-in">Sign in</a>
      </p>
    </section>
  );
}