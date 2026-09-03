"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth";

export type ContentItemInput = {
  date: string;
  title: string;
  content_type_id: string | null;
  status: string;
  assigned_to: string | null;
  notes: string | null;
};

export async function createContentItem(workspaceId: string, input: ContentItemInput) {
  const { supabase, canEdit, user } = await requireWorkspace(workspaceId);
  if (!canEdit) throw new Error("You don't have edit access to this workspace.");

  const { error } = await supabase.from("content_items").insert({
    workspace_id: workspaceId,
    date: input.date,
    title: input.title,
    content_type_id: input.content_type_id,
    status: input.status,
    assigned_to: input.assigned_to,
    notes: input.notes,
    created_by: user.id,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/w/${workspaceId}`);
}

export async function updateContentItem(workspaceId: string, itemId: string, input: ContentItemInput) {
  const { supabase, canEdit } = await requireWorkspace(workspaceId);
  if (!canEdit) throw new Error("You don't have edit access to this workspace.");

  const { error } = await supabase
    .from("content_items")
    .update({
      date: input.date,
      title: input.title,
      content_type_id: input.content_type_id,
      status: input.status,
      assigned_to: input.assigned_to,
      notes: input.notes,
    })
    .eq("id", itemId)
    .eq("workspace_id", workspaceId);
  if (error) throw new Error(error.message);

  revalidatePath(`/w/${workspaceId}`);
}

export async function deleteContentItem(workspaceId: string, itemId: string) {
  const { supabase, canEdit } = await requireWorkspace(workspaceId);
  if (!canEdit) throw new Error("You don't have edit access to this workspace.");

  const { error } = await supabase
    .from("content_items")
    .delete()
    .eq("id", itemId)
    .eq("workspace_id", workspaceId);
  if (error) throw new Error(error.message);

  revalidatePath(`/w/${workspaceId}`);
}

export async function createContentType(workspaceId: string, name: string, color: string) {
  const { supabase, canEdit } = await requireWorkspace(workspaceId);
  if (!canEdit) throw new Error("You don't have edit access to this workspace.");

  const { error } = await supabase.from("content_types").insert({
    workspace_id: workspaceId,
    name,
    color,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/w/${workspaceId}`);
}

export async function deleteContentType(workspaceId: string, typeId: string) {
  const { supabase, canEdit } = await requireWorkspace(workspaceId);
  if (!canEdit) throw new Error("You don't have edit access to this workspace.");

  const { error } = await supabase
    .from("content_types")
    .delete()
    .eq("id", typeId)
    .eq("workspace_id", workspaceId);
  if (error) throw new Error(error.message);

  revalidatePath(`/w/${workspaceId}`);
}
