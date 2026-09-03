"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createContentItem, updateContentItem, deleteContentItem } from "@/app/actions/content";
import type { ContentItemWithJoins, ContentTypeRow, MemberOption } from "@/lib/types";

export function ContentItemModal({
  workspaceId,
  date,
  item,
  canEdit,
  contentTypes,
  members,
  onClose,
}: {
  workspaceId: string;
  date: string;
  item: ContentItemWithJoins | null;
  canEdit: boolean;
  contentTypes: ContentTypeRow[];
  members: MemberOption[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(item?.title ?? "");
  const [contentTypeId, setContentTypeId] = useState(item?.content_type_id ?? "");
  const [status, setStatus] = useState(item?.status ?? "planned");
  const [assignedTo, setAssignedTo] = useState(item?.assigned_to ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [error, setError] = useState<string | undefined>();

  const readOnly = !canEdit;

  function submit() {
    if (!title.trim()) {
      setError("Give this piece of content a title.");
      return;
    }
    setError(undefined);
    const input = {
      date: item?.date ?? date,
      title: title.trim(),
      content_type_id: contentTypeId || null,
      status,
      assigned_to: assignedTo || null,
      notes: notes.trim() || null,
    };
    startTransition(async () => {
      try {
        if (item) {
          await updateContentItem(workspaceId, item.id, input);
        } else {
          await createContentItem(workspaceId, input);
        }
        router.refresh();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  function remove() {
    if (!item) return;
    startTransition(async () => {
      try {
        await deleteContentItem(workspaceId, item.id);
        router.refresh();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not delete.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {item ? (readOnly ? "Content details" : "Edit content") : "New content"}
          </h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Date</label>
            <input
              type="text"
              value={item?.date ?? date}
              disabled
              className="w-full rounded-lg border border-border bg-zinc-50 px-3 py-2 text-sm text-muted"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={readOnly}
              autoFocus
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:bg-zinc-50 disabled:text-muted"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Type</label>
              <select
                value={contentTypeId}
                onChange={(e) => setContentTypeId(e.target.value)}
                disabled={readOnly}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:bg-zinc-50"
              >
                <option value="">None</option>
                {contentTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={readOnly}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:bg-zinc-50"
              >
                <option value="planned">Planned</option>
                <option value="posted">Posted</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Assigned to</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={readOnly}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:bg-zinc-50"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name ?? m.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={readOnly}
              rows={3}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:bg-zinc-50 disabled:text-muted"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {!readOnly && (
          <div className="mt-4 flex items-center justify-between gap-2">
            {item ? (
              <Button variant="ghost" className="text-red-600 hover:bg-red-50" disabled={pending} onClick={remove}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <Button variant="primary" disabled={pending} onClick={submit}>
              {pending ? "Saving..." : item ? "Save changes" : "Add to calendar"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
