"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function sendInquiry(talentUserId: string, subject: string, body: string) {
  const { supabase, user } = await requireUser();

  if (talentUserId === user.id) throw new Error("You can't send an inquiry to yourself.");
  if (!subject.trim() || !body.trim()) throw new Error("Fill in a subject and message.");

  const { data: inquiry, error: inquiryError } = await supabase
    .from("inquiries")
    .insert({
      talent_user_id: talentUserId,
      initiator_user_id: user.id,
      subject: subject.trim(),
    })
    .select("id")
    .single();
  if (inquiryError || !inquiry) throw new Error(inquiryError?.message ?? "Could not send inquiry.");

  const { error: messageError } = await supabase.from("inquiry_messages").insert({
    inquiry_id: inquiry.id,
    sender_user_id: user.id,
    body: body.trim(),
  });
  if (messageError) throw new Error(messageError.message);

  revalidatePath("/inbox");
  return inquiry.id;
}

export async function replyToInquiry(inquiryId: string, body: string) {
  const { supabase, user } = await requireUser();

  if (!body.trim()) throw new Error("Write a message before sending.");

  const { error } = await supabase.from("inquiry_messages").insert({
    inquiry_id: inquiryId,
    sender_user_id: user.id,
    body: body.trim(),
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/inbox/${inquiryId}`);
  revalidatePath("/inbox");
}
