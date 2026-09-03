import { requireWorkspace } from "@/lib/auth";
import { getUserWorkspaces } from "@/lib/queries";
import { AppShell } from "@/components/shell/AppShell";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { supabase, user, profile, workspace } = await requireWorkspace(workspaceId);
  const memberships = await getUserWorkspaces(supabase, user.id);

  const workspaces = memberships
    .filter((m) => m.workspace)
    .map((m) => ({ id: m.workspace!.id, name: m.workspace!.name, role: m.role }));

  return (
    <AppShell
      workspaceId={workspaceId}
      workspaceName={workspace.name}
      userName={profile.full_name ?? profile.email}
      workspaces={workspaces}
    >
      {children}
    </AppShell>
  );
}
