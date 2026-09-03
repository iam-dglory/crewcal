"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth";

export async function createInvite(workspaceId: string, role: string, permission: string) {
  const { supabase, isOwner, user } = await requireWorkspace(workspaceId);
  if (!isOwner) throw new Error("Only the workspace owner can invite people.");

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("invites")
    .insert({
      workspace_id: workspaceId,
      role,
      permission,
      created_by: user.id,
      expires_at: expiresAt,
    })
    .select("token")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not create invite.");

  revalidatePath(`/w/${workspaceId}/team`);
  return data.token;
}

export async function revokeInvite(workspaceId: string, inviteId: string) {
  const { supabase, isOwner } = await requireWorkspace(workspaceId);
  if (!isOwner) throw new Error("Only the workspace owner can revoke invites.");

  const { error } = await supabase.from("invites").delete().eq("id", inviteId).eq("workspace_id", workspaceId);
  if (error) throw new Error(error.message);

  revalidatePath(`/w/${workspaceId}/team`);
}

export async function removeMember(workspaceId: string, userId: string) {
  const { supabase, isOwner, workspace } = await requireWorkspace(workspaceId);
  if (!isOwner) throw new Error("Only the workspace owner can remove members.");
  if (userId === workspace.owner_id) throw new Error("The owner can't be removed.");

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  revalidatePath(`/w/${workspaceId}/team`);
}
