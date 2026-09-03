"use client";

import { useActionState } from "react";
import { createWorkspace } from "@/app/actions/workspace";
import { Button } from "@/components/ui/Button";

const initialState = { error: undefined as string | undefined };

export function CreateWorkspaceForm() {
  const [state, formAction, pending] = useActionState(createWorkspace, initialState);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-surface p-6">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">Workspace name</label>
        <input
          name="name"
          type="text"
          required
          autoFocus
          placeholder="e.g. My Channel, Acme Brand"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Creating..." : "Create workspace"}
      </Button>
    </form>
  );
}
