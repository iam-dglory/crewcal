"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Settings2 } from "lucide-react";
import { cn, todayIso } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ContentItemModal } from "@/components/ContentItemModal";
import { ContentTypesPanel } from "@/components/ContentTypesPanel";
import type { ContentItemWithJoins, ContentTypeRow, MemberOption } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({
  workspaceId,
  canEdit,
  monthLabel,
  currentMonthKey,
  prevMonth,
  nextMonth,
  days,
  itemsByDate,
  contentTypes,
  members,
}: {
  workspaceId: string;
  canEdit: boolean;
  monthLabel: string;
  currentMonthKey: string;
  prevMonth: string;
  nextMonth: string;
  days: string[];
  itemsByDate: Record<string, ContentItemWithJoins[]>;
  contentTypes: ContentTypeRow[];
  members: MemberOption[];
}) {
  const [modal, setModal] = useState<{ date: string; item: ContentItemWithJoins | null } | null>(null);
  const [typesOpen, setTypesOpen] = useState(false);
  const today = todayIso();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/w/${workspaceId}?month=${prevMonth}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-zinc-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h1 className="w-40 text-center text-lg font-semibold tracking-tight">{monthLabel}</h1>
          <Link
            href={`/w/${workspaceId}?month=${nextMonth}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-zinc-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {canEdit && (
          <Button variant="secondary" onClick={() => setTypesOpen(true)}>
            <Settings2 className="h-3.5 w-3.5" />
            Types
          </Button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="bg-zinc-50 py-2 text-center text-xs font-medium text-muted">
            {wd}
          </div>
        ))}
        {days.map((day) => {
          const inMonth = day.startsWith(currentMonthKey);
          const items = itemsByDate[day] ?? [];
          const dayNum = Number(day.slice(-2));
          return (
            <div
              key={day}
              className={cn("min-h-[110px] bg-surface p-1.5", !inMonth && "bg-zinc-50/60")}
            >
              <div className="flex items-center justify-between px-0.5">
                <span
                  className={cn(
                    "text-xs",
                    !inMonth && "text-muted",
                    day === today && "flex h-5 w-5 items-center justify-center rounded-full bg-accent font-medium text-accent-foreground",
                  )}
                >
                  {dayNum}
                </span>
                {canEdit && (
                  <button
                    onClick={() => setModal({ date: day, item: null })}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted hover:bg-zinc-100 hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="mt-1 space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setModal({ date: day, item })}
                    className="flex w-full items-center gap-1.5 rounded-md bg-zinc-100 px-1.5 py-1 text-left text-[11px] leading-tight hover:bg-zinc-200"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.content_type?.color ?? "#a1a1aa" }}
                    />
                    <span className={cn("truncate", item.status === "posted" && "text-muted line-through")}>
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <ContentItemModal
          workspaceId={workspaceId}
          date={modal.date}
          item={modal.item}
          canEdit={canEdit}
          contentTypes={contentTypes}
          members={members}
          onClose={() => setModal(null)}
        />
      )}
      {typesOpen && (
        <ContentTypesPanel workspaceId={workspaceId} contentTypes={contentTypes} onClose={() => setTypesOpen(false)} />
      )}
    </div>
  );
}
