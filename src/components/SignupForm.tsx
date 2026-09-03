"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";

const initialState = { error: undefined as string | undefined, message: undefined as string | undefined };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Crewcal</h1>
        <p className="mt-1 text-sm text-muted">Plan your content calendar and bring in your team</p>
      </div>
      {state?.message ? (
        <div className="rounded-xl border border-border bg-surface p-6 text-center text-sm">{state.message}</div>
      ) : (
        <form action={formAction} className="space-y-3 rounded-xl border border-border bg-surface p-6">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Full name</label>
            <input
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={pending}>
            {pending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
