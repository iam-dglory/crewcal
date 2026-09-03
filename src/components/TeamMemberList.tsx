"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { removeMember, revokeInvite } from "@/app/actions/team";
import { ROLE_LABEL, initials } from "@/lib/utils";

type Member = {
  user_id: string;
  role: string;
  permission: string;
  full_name: string | null;
  email: string;
};

type Invite = {
  id: string;
  role: string;
  permission: string;
  created_at: string;
};

export function TeamMemberList({
  workspaceId,
  members,
  invites,
  isOwner,
  ownerId,
}: {
  workspaceId: string;
  members: Member[];
  invites: Invite[];
  isOwner: boolean;
  ownerId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove(userId: string) {
    startTransition(async () => {
      await removeMember(workspaceId, userId);
      router.refresh();
    });
  }

  function revoke(inviteId: string) {
    startTransition(async () => {
      await revokeInvite(workspaceId, inviteId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface">
        <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">Members</h2>
        <div className="divide-y divide-border">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium">
                  {initials(m.full_name ?? m.email)}
                </span>
                <div>
                  <p className="text-sm font-medium">{m.full_name ?? m.email}</p>
                  <p className="text-xs text-muted">
                    {ROLE_LABEL[m.role] ?? m.role}
                    {m.role !== "owner" && ` · ${m.permission === "edit" ? "Can edit" : "View only"}`}
                  </p>
                </div>
              </div>
              {isOwner && m.user_id !== ownerId && (
                <button
                  onClick={() => remove(m.user_id)}
                  disabled={pending}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove member"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {isOwner && invites.length > 0 && (
        <div className="rounded-xl border border-border bg-surface">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">Pending invites</h2>
          <div className="divide-y divide-border">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{ROLE_LABEL[inv.role] ?? inv.role}</p>
                  <p className="text-xs text-muted">{inv.permission === "edit" ? "Can edit" : "View only"}</p>
                </div>
                <button
                  onClick={() => revoke(inv.id)}
                  disabled={pending}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                  aria-label="Revoke invite"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
