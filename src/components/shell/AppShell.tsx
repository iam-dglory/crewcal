"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Calendar, Users, Compass, Inbox, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";
import { WorkspaceSwitcher } from "@/components/shell/WorkspaceSwitcher";

type WorkspaceOption = { id: string; name: string; role: string };

function navFor(workspaceId: string) {
  return [
    { href: `/w/${workspaceId}`, label: "Calendar", icon: Calendar },
    { href: `/w/${workspaceId}/team`, label: "Team", icon: Users },
  ];
}

const marketplaceNav = [
  { href: "/directory", label: "Directory", icon: Compass },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/profile", label: "My Profile", icon: UserCircle },
];

function isActive(pathname: string, href: string, workspaceId: string) {
  if (href === `/w/${workspaceId}`) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({
  workspaceId,
  workspaceName,
  userName,
  workspaces,
  children,
}: {
  workspaceId: string;
  workspaceName: string;
  userName: string;
  workspaces: WorkspaceOption[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const nav = navFor(workspaceId);
  const current = { id: workspaceId, name: workspaceName, role: "" };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-surface px-3 py-4 md:flex">
        <div className="px-1 pb-4 pt-2">
          <span className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">Crewcal</span>
        </div>
        <div className="pb-4">
          <WorkspaceSwitcher current={current} options={workspaces} />
        </div>
        <div className="flex-1">
          <nav className="space-y-0.5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href, workspaceId)
                    ? "bg-zinc-100 text-foreground"
                    : "text-muted hover:bg-zinc-50 hover:text-foreground",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-border pt-4">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">Marketplace</p>
            <nav className="space-y-0.5">
              {marketplaceNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-zinc-100 text-foreground"
                      : "text-muted hover:bg-zinc-50 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="border-t border-border pt-3">
          <p className="truncate px-3 text-xs text-muted">{userName}</p>
          <form action={signOut}>
            <button className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-zinc-50 hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-zinc-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="truncate text-sm font-semibold">{workspaceName}</span>
        <span className="w-9" />
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-semibold">Crewcal</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <WorkspaceSwitcher current={current} options={workspaces} />
            </div>
            <nav className="space-y-0.5">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(pathname, item.href, workspaceId)
                      ? "bg-zinc-100 text-foreground"
                      : "text-muted hover:bg-zinc-50 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-border pt-4">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">Marketplace</p>
              <nav className="space-y-0.5">
                {marketplaceNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href || pathname.startsWith(item.href + "/")
                        ? "bg-zinc-100 text-foreground"
                        : "text-muted hover:bg-zinc-50 hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-4 border-t border-border pt-3">
              <p className="truncate px-3 text-xs text-muted">{userName}</p>
              <form action={signOut}>
                <button className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-zinc-50 hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <main className="pb-8 md:ml-60">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
