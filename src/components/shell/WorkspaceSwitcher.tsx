"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronsUpDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkspaceOption = { id: string; name: string; role: string };

export function WorkspaceSwitcher({
  current,
  options,
}: {
  current: WorkspaceOption;
  options: WorkspaceOption[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold hover:bg-zinc-100"
      >
        <span className="truncate">{current.name}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-40 mt-1 w-64 rounded-lg border border-border bg-surface py-1 shadow-lg">
          {options.map((ws) => (
            <Link
              key={ws.id}
              href={`/w/${ws.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-zinc-50",
                ws.id === current.id ? "font-medium" : "text-foreground",
              )}
            >
              <span className="truncate">{ws.name}</span>
              {ws.id === current.id && <Check className="h-4 w-4 shrink-0" />}
            </Link>
          ))}
          <div className="mt-1 border-t border-border pt-1">
            <Link
              href="/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:bg-zinc-50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              New workspace
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
