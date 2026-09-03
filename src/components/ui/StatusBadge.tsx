import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  planned: "Planned",
  posted: "Posted",
};

const STATUS_STYLE: Record<string, string> = {
  planned: "bg-blue-50 text-blue-700",
  posted: "bg-green-50 text-green-700",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLE[status] ?? "bg-zinc-100 text-zinc-600",
        className,
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
