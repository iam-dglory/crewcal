import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTalentProfile, getProfile } from "@/lib/queries";
import { MarketplaceHeader } from "@/components/shell/MarketplaceHeader";
import { InquiryComposer } from "@/components/InquiryComposer";
import { TALENT_ROLE_LABEL } from "@/lib/talent-constants";
import type { TalentProfileWithProfile, RateCardRow } from "@/lib/types";

export default async function TalentProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id) : null;

  const talent = (await getTalentProfile(supabase, userId)) as unknown as TalentProfileWithProfile | null;
  if (!talent || (!talent.is_public && talent.user_id !== user?.id)) notFound();

  const rateCard = talent.rate_card as unknown as RateCardRow[];
  const talentName = talent.profile?.full_name ?? talent.profile?.email ?? "this person";

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader isAuthed={!!user} userName={profile?.full_name ?? profile?.email} />
      <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        <Link href="/directory" className="text-sm text-muted hover:text-foreground">
          &larr; Back to directory
        </Link>

        <div className="mt-4 rounded-xl border border-border bg-surface p-6">
          <p className="text-xs font-medium text-muted">{TALENT_ROLE_LABEL[talent.role_type] ?? talent.role_type}</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{talent.headline}</h1>
          <p className="mt-0.5 text-sm text-muted">{talentName}</p>

          {talent.bio && <p className="mt-4 text-sm leading-relaxed">{talent.bio}</p>}

          {talent.niches.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {talent.niches.map((niche) => (
                <span key={niche} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-muted">
                  {niche}
                </span>
              ))}
            </div>
          )}

          {rateCard.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Rate card</h2>
              <div className="mt-2 space-y-1.5">
                {rateCard.map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{row.label}</span>
                    <span className="font-medium">{row.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {talent.portfolio_links.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Portfolio</h2>
              <div className="mt-2 space-y-1">
                {talent.portfolio_links.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-blue-600 hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          {!user ? (
            <Link
              href={`/login?next=/directory/${userId}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Sign in to send an inquiry
            </Link>
          ) : user.id === talent.user_id ? (
            <p className="text-sm text-muted">This is your own profile.</p>
          ) : (
            <InquiryComposer talentUserId={talent.user_id} talentName={talentName} />
          )}
        </div>
      </main>
    </div>
  );
}
