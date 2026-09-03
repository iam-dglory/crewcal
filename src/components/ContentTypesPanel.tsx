"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createContentType, deleteContentType } from "@/app/actions/content";
import type { ContentTypeRow } from "@/lib/types";

const SWATCHES = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#ec4899", "#71717a"];

export function ContentTypesPanel({
  workspaceId,
  contentTypes,
  onClose,
}: {
  workspaceId: string;
  contentTypes: ContentTypeRow[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [color, setColor] = useState(SWATCHES[0]);
  const [error, setError] = useState<string | undefined>();

  function add() {
    if (!name.trim()) return;
    startTransition(async () => {
      try {
        await createContentType(workspaceId, name.trim(), color);
        setName("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not add type.");
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      try {
        await deleteContentType(workspaceId, id);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not delete type.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Content types</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {contentTypes.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-sm">{t.name}</span>
              </div>
              <button
                onClick={() => remove(t.id)}
                disabled={pending}
                className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {contentTypes.length === 0 && <p className="text-sm text-muted">No content types yet.</p>}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <label className="mb-1 block text-xs font-medium text-muted">New type</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Reel, Carousel"
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm"
            />
            <Button variant="secondary" disabled={pending || !name.trim()} onClick={add}>
              Add
            </Button>
          </div>
          <div className="mt-2 flex gap-1.5">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                onClick={() => setColor(swatch)}
                className="h-5 w-5 rounded-full ring-offset-2"
                style={{ backgroundColor: swatch, boxShadow: color === swatch ? `0 0 0 2px ${swatch}` : undefined }}
                aria-label={swatch}
              />
            ))}
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
