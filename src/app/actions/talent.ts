"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export type RateCardRow = { label: string; price: string };

export type TalentProfileInput = {
  role_type: string;
  headline: string;
  bio: string | null;
  niches: string[];
  rate_card: RateCardRow[];
  portfolio_links: string[];
  is_public: boolean;
};

export async function upsertTalentProfile(input: TalentProfileInput) {
  const { supabase, user } = await requireUser();

  if (!input.headline.trim()) throw new Error("Give your profile a headline.");

  const { error } = await supabase.from("talent_profiles").upsert({
    user_id: user.id,
    role_type: input.role_type,
    headline: input.headline.trim(),
    bio: input.bio?.trim() || null,
    niches: input.niches,
    rate_card: input.rate_card,
    portfolio_links: input.portfolio_links,
    is_public: input.is_public,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
  revalidatePath("/directory");
  revalidatePath(`/directory/${user.id}`);
}

export async function deleteTalentProfile() {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("talent_profiles").delete().eq("user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
  revalidatePath("/directory");
}
