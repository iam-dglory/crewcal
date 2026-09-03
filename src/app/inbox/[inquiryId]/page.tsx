import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getInquiry, getInquiryMessages } from "@/lib/queries";
import { MarketplaceHeader } from "@/components/shell/MarketplaceHeader";
import { InquiryReplyForm } from "@/components/InquiryReplyForm";
import { cn } from "@/lib/utils";
import type { InquiryWithProfiles, InquiryMessageWithSender } from "@/lib/types";

export default async function InquiryThreadPage({ params }: { params: Promise<{ inquiryId: string }> }) {
  const { inquiryId } = await params;
  const { supabase, user, profile } = await requireUser();

  const inquiry = (await getInquiry(supabase, inquiryId)) as unknown as InquiryWithProfiles | null;
  if (!inquiry || (inquiry.talent_user_id !== user.id && inquiry.initiator_user_id !== user.id)) notFound();

  const messages = (await getInquiryMessages(supabase, inquiryId)) as unknown as InquiryMessageWithSender[];
  const isTalent = inquiry.talent_user_id === user.id;
  const other = isTalent ? inquiry.initiator : inquiry.talent;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader isAuthed userName={profile.full_name ?? profile.email} />
      <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        <Link href="/inbox" className="text-sm text-muted hover:text-foreground">
          &larr; Back to inbox
        </Link>

        <div className="mt-4">
          <h1 className="text-lg font-semibold tracking-tight">{inquiry.subject}</h1>
          <p className="text-sm text-muted">
            {isTalent ? "From" : "To"} {other?.full_name ?? other?.email}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {messages.map((m) => {
            const mine = m.sender_user_id === user.id;
            return (
              <div key={m.id} className={cn("max-w-[80%] rounded-xl px-4 py-2.5 text-sm", mine ? "ml-auto bg-accent text-accent-foreground" : "bg-zinc-100")}>
                <p>{m.body}</p>
                <p className={cn("mt-1 text-[11px]", mine ? "text-accent-foreground/70" : "text-muted")}>
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <InquiryReplyForm inquiryId={inquiry.id} />
        </div>
      </main>
    </div>
  );
}
