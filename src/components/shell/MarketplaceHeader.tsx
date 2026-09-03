import Link from "next/link";
import { signOut } from "@/app/actions/auth";

export function MarketplaceHeader({
  isAuthed,
  userName,
}: {
  isAuthed: boolean;
  userName?: string;
}) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Crewcal
          </Link>
          <Link href="/directory" className="text-sm font-medium text-muted hover:text-foreground">
            Directory
          </Link>
        </div>
        {isAuthed ? (
          <div className="flex items-center gap-4">
            <Link href="/inbox" className="text-sm font-medium text-muted hover:text-foreground">
              Inbox
            </Link>
            <Link href="/profile" className="text-sm font-medium text-muted hover:text-foreground">
              My Profile
            </Link>
            <span className="hidden text-sm text-muted md:inline">{userName}</span>
            <form action={signOut}>
              <button className="text-sm font-medium text-muted hover:text-foreground">Sign out</button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
