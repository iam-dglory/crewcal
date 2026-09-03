"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { upsertTalentProfile, deleteTalentProfile } from "@/app/actions/talent";
import { TALENT_ROLE_LABEL, TALENT_ROLES, SUGGESTED_NICHES } from "@/lib/talent-constants";
import type { RateCardRow, TalentProfileWithProfile } from "@/lib/types";

export function TalentProfileForm({ initial }: { initial: TalentProfileWithProfile | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const [roleType, setRoleType] = useState(initial?.role_type ?? TALENT_ROLES[0]);
  const [headline, setHeadline] = useState(initial?.headline ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [niches, setNiches] = useState<string[]>(initial?.niches ?? []);
  const [customNiche, setCustomNiche] = useState("");
  const [rateCard, setRateCard] = useState<RateCardRow[]>(
    (initial?.rate_card as unknown as RateCardRow[]) ?? [],
  );
  const [links, setLinks] = useState<string[]>(initial?.portfolio_links ?? []);
  const [isPublic, setIsPublic] = useState(initial?.is_public ?? true);

  function toggleNiche(n: string) {
    setNiches((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  function addCustomNiche() {
    const n = customNiche.trim();
    if (n && !niches.includes(n)) setNiches((prev) => [...prev, n]);
    setCustomNiche("");
  }

  function addRateRow() {
    setRateCard((prev) => [...prev, { label: "", price: "" }]);
  }
  function updateRateRow(i: number, field: keyof RateCardRow, value: string) {
    setRateCard((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }
  function removeRateRow(i: number) {
    setRateCard((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addLink() {
    setLinks((prev) => [...prev, ""]);
  }
  function updateLink(i: number, value: string) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? value : l)));
  }
  function removeLink(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function submit() {
    setError(undefined);
    startTransition(async () => {
      try {
        await upsertTalentProfile({
          role_type: roleType,
          headline,
          bio: bio || null,
          niches,
          rate_card: rateCard.filter((r) => r.label.trim() && r.price.trim()),
          portfolio_links: links.map((l) => l.trim()).filter(Boolean),
          is_public: isPublic,
        });
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save profile.");
      }
    });
  }

  function remove() {
    if (!confirm("Delete your talent profile? This removes it from the directory.")) return;
    startTransition(async () => {
      await deleteTalentProfile();
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Role</label>
          <select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            {TALENT_ROLES.map((r) => (
              <option key={r} value={r}>
                {TALENT_ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Lifestyle creator & UGC specialist"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Niches</label>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_NICHES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleNiche(n)}
                className={
                  niches.includes(n)
                    ? "rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                    : "rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-muted hover:bg-zinc-200"
                }
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Add a custom niche"
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm"
            />
            <Button variant="secondary" onClick={addCustomNiche} disabled={!customNiche.trim()}>
              Add
            </Button>
          </div>
          {niches.filter((n) => !SUGGESTED_NICHES.includes(n)).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {niches
                .filter((n) => !SUGGESTED_NICHES.includes(n))
                .map((n) => (
                  <span key={n} className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                    {n}
                    <button type="button" onClick={() => toggleNiche(n)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted">Rate card</label>
          <button type="button" onClick={addRateRow} className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {rateCard.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={row.label}
                onChange={(e) => updateRateRow(i, "label", e.target.value)}
                placeholder="e.g. Instagram Reel"
                className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={row.price}
                onChange={(e) => updateRateRow(i, "price", e.target.value)}
                placeholder="e.g. $500+"
                className="w-32 rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeRateRow(i)} className="flex h-9 w-9 items-center justify-center text-muted hover:text-red-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {rateCard.length === 0 && <p className="text-sm text-muted">No rates added yet.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted">Portfolio links</label>
          <button type="button" onClick={addLink} className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
                placeholder="https://instagram.com/you"
                className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeLink(i)} className="flex h-9 w-9 items-center justify-center text-muted hover:text-red-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {links.length === 0 && <p className="text-sm text-muted">No links added yet.</p>}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
        <div>
          <p className="text-sm font-medium">Public in directory</p>
          <p className="text-xs text-muted">Off = only you can see this profile.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic((v) => !v)}
          className={
            isPublic ? "h-6 w-11 rounded-full bg-accent p-0.5" : "h-6 w-11 rounded-full bg-zinc-200 p-0.5"
          }
        >
          <span
            className={
              isPublic
                ? "block h-5 w-5 translate-x-5 rounded-full bg-white transition-transform"
                : "block h-5 w-5 translate-x-0 rounded-full bg-white transition-transform"
            }
          />
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        {initial ? (
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={remove} disabled={pending}>
            Delete profile
          </Button>
        ) : (
          <span />
        )}
        <Button variant="primary" onClick={submit} disabled={pending || !headline.trim()}>
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
