import { requireWorkspace } from "@/lib/auth";
import { getWorkspaceMembers, getPendingInvites } from "@/lib/queries";
import { InviteLinkGenerator } from "@/components/InviteLinkGenerator";
import { TeamMemberList } from "@/components/TeamMemberList";

export default async function TeamPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  const { supabase, isOwner, workspace } = await requireWorkspace(workspaceId);

  const [memberRows, invites] = await Promise.all([
    getWorkspaceMembers(supabase, workspaceId),
    isOwner ? getPendingInvites(supabase, workspaceId) : Promise.resolve([]),
  ]);

  const members = memberRows
    .filter((m) => m.profile)
    .map((m) => ({
      user_id: m.profile!.id,
      role: m.role,
      permission: m.permission,
      full_name: m.profile!.full_name,
      email: m.profile!.email,
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold tracking-tight">Team</h1>
      {isOwner && <InviteLinkGenerator workspaceId={workspaceId} />}
      <TeamMemberList
        workspaceId={workspaceId}
        members={members}
        invites={invites}
        isOwner={isOwner}
        ownerId={workspace.owner_id}
      />
    </div>
  );
}
