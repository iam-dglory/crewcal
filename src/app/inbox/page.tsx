import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getInquiries } from "@/lib/queries";
import { MarketplaceHeader } from "@/components/shell/MarketplaceHeader";
import type { InquiryWithProfiles } from "@/lib/types";

export default async function InboxPage() {
  const { supabase, user, profile } = await requireUser();
  const inquiries = (await getInquiries(supabase, user.id)) as unknown as InquiryWithProfiles[];

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader isAuthed userName={profile.full_name ?? profile.email} />
      <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        <h1 className="text-lg font-semibold tracking-tight">Inbox</h1>

        {inquiries.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No inquiries yet.</p>
        ) : (
          <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-surface">
            {inquiries.map((inq) => {
              const isTalent = inq.talent_user_id === user.id;
              const other = isTalent ? inq.initiator : inq.talent;
              return (
                <Link
                  key={inq.id}
                  href={`/inbox/${inq.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-50"
                >
                  <div>
                    <p className="text-sm font-medium">{inq.subject}</p>
                    <p className="text-xs text-muted">
                      {isTalent ? "From" : "To"} {other?.full_name ?? other?.email}
                    </p>
                  </div>
                  <span className="text-xs text-muted">{new Date(inq.created_at).toLocaleDateString()}</span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
