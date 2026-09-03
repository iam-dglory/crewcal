import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getUserWorkspaces } from "@/lib/queries";

export default async function Home() {
  const { supabase, user } = await requireUser();
  const memberships = await getUserWorkspaces(supabase, user.id);

  if (memberships.length === 0) redirect("/new");

  const owned = memberships.find((m) => m.role === "owner");
  const target = owned ?? memberships[0];
  redirect(`/w/${target.workspace!.id}`);
}
