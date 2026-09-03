"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { replyToInquiry } from "@/app/actions/inquiries";
import { Button } from "@/components/ui/Button";

export function InquiryReplyForm({ inquiryId }: { inquiryId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  function submit() {
    setError(undefined);
    startTransition(async () => {
      try {
        await replyToInquiry(inquiryId, body);
        setBody("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not send reply.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Write a reply..."
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-2 flex justify-end">
        <Button variant="primary" onClick={submit} disabled={pending || !body.trim()}>
          {pending ? "Sending..." : "Reply"}
        </Button>
      </div>
    </div>
  );
}
