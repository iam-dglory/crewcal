import { createClient } from "@/lib/supabase/server";
import { listTalentProfiles, getProfile } from "@/lib/queries";
import { MarketplaceHeader } from "@/components/shell/MarketplaceHeader";
import { TalentCard } from "@/components/TalentCard";
import { TALENT_ROLE_LABEL, TALENT_ROLES, SUGGESTED_NICHES } from "@/lib/talent-constants";
import type { TalentProfileWithProfile } from "@/lib/types";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; niche?: string }>;
}) {
  const { role, niche } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id) : null;

  const talent = (await listTalentProfiles(supabase, { role, niche })) as unknown as TalentProfileWithProfile[];

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader isAuthed={!!user} userName={profile?.full_name ?? profile?.email} />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <h1 className="text-lg font-semibold tracking-tight">Talent directory</h1>
        <p className="mt-1 text-sm text-muted">
          Find influencers, video editors, content strategists, and marketers for your next collaboration.
        </p>

        <form method="get" className="mt-5 flex flex-wrap gap-3">
          <select
            name="role"
            defaultValue={role ?? ""}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="">All roles</option>
            {TALENT_ROLES.map((r) => (
              <option key={r} value={r}>
                {TALENT_ROLE_LABEL[r]}
              </option>
            ))}
          </select>
          <select
            name="niche"
            defaultValue={niche ?? ""}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            <option value="">All niches</option>
            {SUGGESTED_NICHES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50">
            Filter
          </button>
          {(role || niche) && (
            <a href="/directory" className="flex items-center text-sm text-muted underline">
              Clear
            </a>
          )}
        </form>

        {talent.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No profiles match yet. Try a different filter.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {talent.map((t) => (
              <TalentCard key={t.user_id} talent={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
