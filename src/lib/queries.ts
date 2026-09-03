import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type DB = SupabaseClient<Database>;

export async function getProfile(supabase: DB, userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

export async function getUserWorkspaces(supabase: DB, userId: string) {
  const { data } = await supabase
    .from("workspace_members")
    .select("role, permission, workspace:workspaces(id, name, owner_id)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: true });
  return data ?? [];
}

export async function getWorkspaceMembership(supabase: DB, workspaceId: string, userId: string) {
  const { data } = await supabase
    .from("workspace_members")
    .select("role, permission")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getWorkspace(supabase: DB, workspaceId: string) {
  const { data } = await supabase.from("workspaces").select("*").eq("id", workspaceId).single();
  return data;
}

export async function getContentTypes(supabase: DB, workspaceId: string) {
  const { data } = await supabase
    .from("content_types")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("name");
  return data ?? [];
}

export async function getContentItems(
  supabase: DB,
  workspaceId: string,
  range: { from: string; to: string },
) {
  const { data } = await supabase
    .from("content_items")
    .select(
      "*, content_type:content_types(id, name, color), assignee:profiles!content_items_assigned_to_fkey(id, full_name, email)",
    )
    .eq("workspace_id", workspaceId)
    .gte("date", range.from)
    .lte("date", range.to)
    .order("date");
  return data ?? [];
}

export async function getWorkspaceMembers(supabase: DB, workspaceId: string) {
  const { data } = await supabase
    .from("workspace_members")
    .select("role, permission, joined_at, profile:profiles(id, full_name, email)")
    .eq("workspace_id", workspaceId)
    .order("joined_at");
  return data ?? [];
}

export async function getPendingInvites(supabase: DB, workspaceId: string) {
  const { data } = await supabase
    .from("invites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .is("accepted_by", null)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function listTalentProfiles(
  supabase: DB,
  filters: { role?: string; niche?: string } = {},
) {
  let query = supabase
    .from("talent_profiles")
    .select("*, profile:profiles(id, full_name, email)")
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  if (filters.role) query = query.eq("role_type", filters.role);
  if (filters.niche) query = query.contains("niches", [filters.niche]);

  const { data } = await query;
  return data ?? [];
}

export async function getTalentProfile(supabase: DB, userId: string) {
  const { data } = await supabase
    .from("talent_profiles")
    .select("*, profile:profiles(id, full_name, email)")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getInquiries(supabase: DB, userId: string) {
  const { data } = await supabase
    .from("inquiries")
    .select(
      "*, talent:profiles!inquiries_talent_user_id_fkey(id, full_name, email), initiator:profiles!inquiries_initiator_user_id_fkey(id, full_name, email)",
    )
    .or(`talent_user_id.eq.${userId},initiator_user_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getInquiry(supabase: DB, inquiryId: string) {
  const { data } = await supabase
    .from("inquiries")
    .select(
      "*, talent:profiles!inquiries_talent_user_id_fkey(id, full_name, email), initiator:profiles!inquiries_initiator_user_id_fkey(id, full_name, email)",
    )
    .eq("id", inquiryId)
    .maybeSingle();
  return data;
}

export async function getInquiryMessages(supabase: DB, inquiryId: string) {
  const { data } = await supabase
    .from("inquiry_messages")
    .select("*, sender:profiles(id, full_name, email)")
    .eq("inquiry_id", inquiryId)
    .order("created_at", { ascending: true });
  return data ?? [];
}
