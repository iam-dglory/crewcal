import Link from "next/link";
import { TALENT_ROLE_LABEL } from "@/lib/talent-constants";
import type { TalentProfileWithProfile } from "@/lib/types";

export function TalentCard({ talent }: { talent: TalentProfileWithProfile }) {
  return (
    <Link
      href={`/directory/${talent.user_id}`}
      className="block rounded-xl border border-border bg-surface p-4 hover:border-foreground/20"
    >
      <p className="text-xs font-medium text-muted">{TALENT_ROLE_LABEL[talent.role_type] ?? talent.role_type}</p>
      <h3 className="mt-1 text-sm font-semibold">{talent.headline}</h3>
      <p className="mt-0.5 text-xs text-muted">{talent.profile?.full_name ?? talent.profile?.email}</p>
      {talent.niches.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {talent.niches.slice(0, 4).map((niche) => (
            <span key={niche} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-muted">
              {niche}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
