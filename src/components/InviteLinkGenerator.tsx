"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createInvite } from "@/app/actions/team";
import { ROLE_LABEL } from "@/lib/utils";

const ROLES = ["editor", "strategist", "marketer", "collaborator"];

export function InviteLinkGenerator({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [role, setRole] = useState("editor");
  const [permission, setPermission] = useState("edit");
  const [link, setLink] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function generate() {
    setError(undefined);
    startTransition(async () => {
      try {
        const token = await createInvite(workspaceId, role, permission);
        setLink(`${window.location.origin}/invite/${token}`);
        setCopied(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not create invite.");
      }
    });
  }

  function copy() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold">Invite someone</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Access</label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="edit">Can edit</option>
            <option value="view">View only</option>
          </select>
        </div>
      </div>
      <Button variant="primary" className="mt-3 w-full" disabled={pending} onClick={generate}>
        {pending ? "Generating..." : "Generate invite link"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {link && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-zinc-50 px-3 py-2">
          <input readOnly value={link} className="flex-1 truncate bg-transparent text-xs text-muted outline-none" />
          <button onClick={copy} className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-zinc-200">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
      {link && <p className="mt-2 text-xs text-muted">Share this link directly — it expires in 30 days.</p>}
    </div>
  );
}
