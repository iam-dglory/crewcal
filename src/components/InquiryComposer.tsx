"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendInquiry } from "@/app/actions/inquiries";
import { Button } from "@/components/ui/Button";

export function InquiryComposer({ talentUserId, talentName }: { talentUserId: string; talentName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)}>
        Send inquiry
      </Button>
    );
  }

  function submit() {
    setError(undefined);
    startTransition(async () => {
      try {
        const inquiryId = await sendInquiry(talentUserId, subject, body);
        router.push(`/inbox/${inquiryId}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not send inquiry.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold">Message {talentName}</h3>
      <div className="mt-3 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Collab inquiry for a product launch"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Tell them a bit about what you're looking for..."
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={pending}>
          {pending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
