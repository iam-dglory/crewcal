import { requireUser } from "@/lib/auth";
import { getTalentProfile } from "@/lib/queries";
import { MarketplaceHeader } from "@/components/shell/MarketplaceHeader";
import { TalentProfileForm } from "@/components/TalentProfileForm";
import type { TalentProfileWithProfile } from "@/lib/types";

export default async function ProfilePage() {
  const { supabase, user, profile } = await requireUser();
  const talent = (await getTalentProfile(supabase, user.id)) as unknown as TalentProfileWithProfile | null;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader isAuthed userName={profile.full_name ?? profile.email} />
      <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        <h1 className="text-lg font-semibold tracking-tight">My talent profile</h1>
        <p className="mt-1 text-sm text-muted">
          Opt into the directory so businesses and creators can find and message you.
        </p>
        <div className="mt-5">
          <TalentProfileForm initial={talent} />
        </div>
      </main>
    </div>
  );
}
