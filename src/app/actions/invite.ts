"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function acceptInvite(token: string) {
  const { supabase } = await requireUser();

  const { data, error } = await supabase.rpc("accept_invite", { p_token: token });
  if (error || !data) {
    throw new Error(error?.message ?? "This invite is invalid or has already been used.");
  }

  redirect(`/w/${data}`);
}
