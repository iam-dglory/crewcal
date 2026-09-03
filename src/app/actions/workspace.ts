"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function createWorkspace(_prevState: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Give your workspace a name." };

  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("create_workspace", { p_name: name });

  if (error || !data) {
    return { error: "Could not create the workspace. Try again." };
  }

  redirect(`/w/${data.id}`);
}
