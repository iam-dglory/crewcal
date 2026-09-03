import { requireWorkspace } from "@/lib/auth";
import { getContentItems, getContentTypes, getWorkspaceMembers } from "@/lib/queries";
import { getMonthGrid } from "@/lib/calendar";
import { CalendarView } from "@/components/CalendarView";
import type { ContentItemWithJoins } from "@/lib/types";

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { workspaceId } = await params;
  const { month } = await searchParams;
  const { supabase, canEdit } = await requireWorkspace(workspaceId);

  const grid = getMonthGrid(month);
  const [items, contentTypes, memberRows] = await Promise.all([
    getContentItems(supabase, workspaceId, { from: grid.from, to: grid.to }),
    getContentTypes(supabase, workspaceId),
    getWorkspaceMembers(supabase, workspaceId),
  ]);

  const itemsByDate: Record<string, ContentItemWithJoins[]> = {};
  for (const item of items as unknown as ContentItemWithJoins[]) {
    (itemsByDate[item.date] ??= []).push(item);
  }

  const members = memberRows.filter((m) => m.profile).map((m) => m.profile!);

  return (
    <CalendarView
      workspaceId={workspaceId}
      canEdit={canEdit}
      monthLabel={grid.monthLabel}
      currentMonthKey={grid.currentMonthKey}
      prevMonth={grid.prevMonth}
      nextMonth={grid.nextMonth}
      days={grid.days}
      itemsByDate={itemsByDate}
      contentTypes={contentTypes}
      members={members}
    />
  );
}
