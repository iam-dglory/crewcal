import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getWorkspaceMembership, getWorkspace } from "@/lib/queries";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect("/login");

  return { supabase, user, profile };
}

export async function requireWorkspace(workspaceId: string) {
  const ctx = await requireUser();
  const membership = await getWorkspaceMembership(ctx.supabase, workspaceId, ctx.user.id);
  if (!membership) redirect("/");

  const workspace = await getWorkspace(ctx.supabase, workspaceId);
  if (!workspace) redirect("/");

  const canEdit = membership.role === "owner" || membership.permission === "edit";

  return { ...ctx, workspace, membership, canEdit, isOwner: membership.role === "owner" };
}
