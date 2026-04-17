"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Check, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { getInitials, calcOverall } from "@/lib/utils";
import { Player, PRESET_COMMENTS, STRENGTH_OPTIONS, FOCUS_OPTIONS } from "@/types";

const CATEGORIES = [
  { key: "technical" as const, label: "Technical" },
  { key: "game_iq" as const, label: "Game IQ" },
  { key: "physical" as const, label: "Physical" },
  { key: "mental" as const, label: "Mental" },
];

type Step = 1 | 2 | 3 | "done";

export default function EvaluatePage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("player");

  const [step, setStep] = useState<Step>(preselectedId ? 2 : 1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [scores, setScores] = useState({ technical: 7, game_iq: 7, physical: 7, mental: 7 });
  const [activeCategory, setActiveCategory] = useState<"technical"|"game_iq"|"physical"|"mental">("technical");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("players").select("*").eq("coach_user_id", user.id).order("name")
      .then(({ data }) => {
        setPlayers(data ?? []);
        if (preselectedId && data) {
          const p = data.find((p: Player) => p.id === preselectedId);
          if (p) setSelectedPlayer(p);
        }
      });
  }, [user, preselectedId]);

  function toggleChip(chip: string) {
    setSelectedChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  }

  async function submit() {
    if (!user || !selectedPlayer) return;
    setSubmitting(true);
    const note = [...selectedChips, customNote].filter(Boolean).join(". ");
    await supabase.from("evaluations").insert({
      player_id: selectedPlayer.id,
      coach_user_id: user.id,
      technical: scores.technical,
      game_iq: scores.game_iq,
      physical: scores.physical,
      mental: scores.mental,
      overall: calcOverall(scores.technical, scores.game_iq, scores.physical, scores.mental),
      coach_note: note || null,
      strengths,
      focus_areas: focusAreas,
    });
    setSubmitting(false);
    setStep("done");
  }

  const progressStep = step === "done" ? 3 : (step as number);

  return (
    <AppLayout>
      <div className="px-4 py-5">
        <h1 className="text-xl font-semibold mb-1">Evaluate Player</h1>
        <p className="text-sm text-gray-400 mb-4">Under 60 seconds</p>

        {step !== "done" && (
          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${s <= progressStep ? "bg-brand-green" : "bg-gray-100"}`} />
            ))}
          </div>
        )}

        {/* Step 1: Select player */}
        {step === 1 && (
          <div className="card">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Select Player</p>
            {players.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No players yet.{" "}
                <a href="/players" className="text-brand-green">Add one first →</a>
              </p>
            ) : (
              players.map(player => (
                <button key={player.id}
                  onClick={() => { setSelectedPlayer(player); setStep(2); }}
                  className="flex items-center gap-3 w-full py-3 border-b border-gray-50 last:border-0 text-left">
                  <div className="w-9 h-9 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green-dark text-xs font-semibold">
                    {getInitials(player.name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{player.name}</div>
                    <div className="text-xs text-gray-400">{player.position} · {player.age_group}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))
            )}
          </div>
        )}

        {/* Step 2: Rate */}
        {step === 2 && selectedPlayer && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green-dark text-xs font-semibold">
                {getInitials(selectedPlayer.name)}
              </div>
              <div>
                <div className="text-sm font-medium">{selectedPlayer.name}</div>
                <div className="text-xs text-gray-400">{selectedPlayer.position}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {CATEGORIES.map(({ key, label }) => (
                <button key={key} onClick={() => setActiveCategory(key)}
                  className={`rounded-xl p-3 text-center border transition-all ${
                    activeCategory === key
                      ? "border-brand-green bg-brand-green-light"
                      : "border-gray-100 bg-white"
                  }`}>
                  <div className={`text-xs mb-1 ${activeCategory === key ? "text-brand-green-dark" : "text-gray-400"}`}>{label}</div>
                  <div className={`text-2xl font-semibold ${activeCategory === key ? "text-brand-green-dark" : "text-gray-900"}`}>
                    {scores[key]}
                  </div>
                </button>
              ))}
            </div>

            <div className="card mb-3">
              <p className="text-xs text-gray-400 mb-3">
                Tap to rate: <span className="font-medium text-gray-700">{CATEGORIES.find(c => c.key === activeCategory)?.label}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n}
                    onClick={() => setScores(prev => ({ ...prev, [activeCategory]: n }))}
                    className={`w-9 h-9 rounded-full text-sm font-medium border transition-all ${
                      scores[activeCategory] === n
                        ? "bg-brand-green border-brand-green text-white"
                        : "border-gray-200 text-gray-600 hover:border-brand-green"
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(3)} className="btn-primary">Continue to Notes →</button>
          </>
        )}

        {/* Step 3: Notes, strengths, focus areas */}
        {step === 3 && selectedPlayer && (
          <>
            <div className="card mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Strengths</p>
              <div className="flex flex-wrap gap-2">
                {STRENGTH_OPTIONS.map(s => (
                  <button key={s}
                    onClick={() => setStrengths(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      strengths.includes(s)
                        ? "bg-brand-green-light border-brand-green text-brand-green-dark"
                        : "border-gray-200 text-gray-500"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="card mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {FOCUS_OPTIONS.map(f => (
                  <button key={f}
                    onClick={() => setFocusAreas(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      focusAreas.includes(f)
                        ? "bg-brand-amber-light border-brand-amber text-amber-800"
                        : "border-gray-200 text-gray-500"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="card mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Coach Note (optional)</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_COMMENTS.map(c => (
                  <button key={c} onClick={() => toggleChip(c)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      selectedChips.includes(c)
                        ? "bg-brand-green-light border-brand-green text-brand-green-dark"
                        : "border-gray-200 text-gray-500"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
              <textarea value={customNote} onChange={e => setCustomNote(e.target.value)}
                placeholder="Or write a custom note..." rows={3}
                className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-brand-green resize-none" />
            </div>

            <button onClick={submit} disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : "Submit Evaluation ✓"}
            </button>
          </>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-brand-green-light flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-brand-green" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Evaluation Saved</h2>
            <p className="text-sm text-gray-400 mb-8">
              {selectedPlayer?.name} · avg {calcOverall(scores.technical, scores.game_iq, scores.physical, scores.mental)} · Saved successfully
            </p>
            <button
              onClick={() => { setStep(1); setSelectedPlayer(null); setScores({ technical: 7, game_iq: 7, physical: 7, mental: 7 }); setSelectedChips([]); setCustomNote(""); setStrengths([]); setFocusAreas([]); }}
              className="btn-primary mb-3">
              Evaluate Another Player
            </button>
            <button onClick={() => router.push("/dashboard")} className="btn-outline">
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
