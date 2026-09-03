import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { acceptInvite } from "@/app/actions/invite";
import { ROLE_LABEL } from "@/lib/utils";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase.rpc("get_invite", { p_token: token });
  const invite = data?.[0];

  async function accept() {
    "use server";
    await acceptInvite(token);
  }

  if (!invite || !invite.valid) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center">
          <h1 className="text-lg font-semibold">Invite not found</h1>
          <p className="mt-2 text-sm text-muted">This invite link is invalid or has already been used.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center">
        <h1 className="text-lg font-semibold">You&apos;re invited</h1>
        <p className="mt-2 text-sm text-muted">
          Join <span className="font-medium text-foreground">{invite.workspace_name}</span> as a{" "}
          {ROLE_LABEL[invite.role] ?? invite.role} ({invite.permission === "edit" ? "can edit" : "view only"}).
        </p>
        {user ? (
          <form action={accept} className="mt-4">
            <Button type="submit" variant="primary" className="w-full">
              Accept &amp; join
            </Button>
          </form>
        ) : (
          <div className="mt-4 space-y-2">
            <Link
              href={`/signup?next=/invite/${token}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Create an account
            </Link>
            <Link
              href={`/login?next=/invite/${token}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
