"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setIsSubmitting(true);
    const result = await signIn("credentials", { email: data.get("email"), password: data.get("password"), redirect: false });
    setIsSubmitting(false);
    if (result?.error) {
      setError("Email or password is incorrect.");
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return <form className="auth-card" onSubmit={handleSubmit}><p className="eyebrow">STOCKWISE POS</p><h1>Sign in</h1><p>Use your staff account to open the POS.</p><label>Email<input autoComplete="email" name="email" required type="email" placeholder="you@stockwise.demo" /></label><label>Password<input autoComplete="current-password" name="password" required minLength={8} type="password" placeholder="••••••••" /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button disabled={isSubmitting} type="submit">{isSubmitting ? "Signing in…" : "Sign in"}</button><p className="demo-note">Seeded demo: admin@stockwise.demo / DemoPass123!</p></form>;
}
