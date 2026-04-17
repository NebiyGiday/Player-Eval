"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { formatDate, calcOverall, DRILLS } from "@/lib/utils";
import { Evaluation, Player } from "@/types";
import { Play, Clock, MapPin, TrendingUp } from "lucide-react";

type Tab = "home" | "progress" | "training" | "note";

export default function ParentDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [player, setPlayer] = useState<Player | null>(null);
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("players")
      .select("*")
      .eq("parent_user_id", user.id)
      .single()
      .then(async ({ data: p }) => {
        if (!p) { setLoading(false); return; }
        setPlayer(p);
        const { data: e } = await supabase
          .from("evaluations")
          .select("*")
          .eq("player_id", p.id)
          .order("created_at");
        setEvals(e ?? []);
        setLoading(false);
      });
  }, [user]);

  const latest = evals[evals.length - 1];
  const overall = latest ? calcOverall(latest.technical, latest.game_iq, latest.physical, latest.mental) : null;
  const firstName = player?.name.split(" ")[0] ?? "your child";

  const tabs = [
    { key: "home" as Tab, label: "Home" },
    { key: "progress" as Tab, label: "Progress" },
    { key: "training" as Tab, label: "Training" },
    { key: "note" as Tab, label: "Coach Note" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="text-brand-green font-semibold text-lg">PlayerEval</span>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* Content */}
      <main className="flex-1 pb-24 overflow-y-auto px-4 py-5">

        {!player ? (
          /* No player linked yet */
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-brand-green-light flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} className="text-brand-green" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No player linked yet</h2>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Ask your coach to link your child&apos;s profile to your account. They&apos;ll need your email address.
            </p>
          </div>
        ) : (
          <>
            {/* Home tab */}
            {activeTab === "home" && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green-dark font-semibold">
                    {player.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold">{firstName}&apos;s Progress</h1>
                    <p className="text-xs text-gray-400">
                      {latest ? `Last practice: ${formatDate(latest.created_at)}` : "No evaluations yet"}
                    </p>
                  </div>
                </div>

                {latest ? (
                  <>
                    {/* Next Step — front and center */}
                    {latest.focus_areas?.length > 0 && (
                      <div className="bg-brand-blue-light rounded-2xl p-4 mb-4">
                        <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">Next Step</div>
                        <div className="text-sm font-medium text-blue-900">
                          Practice {latest.focus_areas[0].toLowerCase()} for 10 min before next session
                        </div>
                      </div>
                    )}

                    {/* Overall score */}
                    <div className="card mb-4 text-center">
                      <div className="text-xs text-gray-400 mb-1">Overall this session</div>
                      <div className="text-5xl font-semibold text-brand-green">{overall}</div>
                      <div className="flex justify-center gap-1 mt-2">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i <= Math.round((overall ?? 0) / 2) ? "bg-brand-green" : "bg-brand-green-mid"}`} />
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">Developing well</div>
                    </div>

                    {/* Strengths */}
                    {latest.strengths?.length > 0 && (
                      <div className="card mb-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Strengths</p>
                        {latest.strengths.map((s: string) => (
                          <div key={s} className="strength-pill">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                            <span className="text-sm text-brand-green-dark font-medium">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Focus Areas */}
                    {latest.focus_areas?.length > 0 && (
                      <div className="card mb-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Focus Areas</p>
                        {latest.focus_areas.map((f: string) => (
                          <div key={f} className="focus-pill">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-amber flex-shrink-0" />
                            <span className="text-sm text-amber-800 font-medium">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="card text-center py-10">
                    <p className="text-sm text-gray-400">No evaluations yet — check back after practice!</p>
                  </div>
                )}
              </>
            )}

            {/* Progress tab */}
            {activeTab === "progress" && (
              <>
                <h1 className="text-xl font-semibold mb-1">{firstName}&apos;s Progress</h1>
                <p className="text-sm text-gray-400 mb-4">{evals.length} session{evals.length !== 1 ? "s" : ""} tracked</p>

                {evals.length > 1 ? (
                  <>
                    <div className="card mb-4">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Overall Trend</p>
                      <div className="flex items-end gap-1 h-16">
                        {evals.map((e, i) => {
                          const ov = calcOverall(e.technical, e.game_iq, e.physical, e.mental);
                          return (
                            <div key={e.id} className="flex-1 rounded-t"
                              style={{ height: `${ov * 10}%`, background: i === evals.length - 1 ? "#1D9E75" : "#9FE1CB" }} />
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400">First session</span>
                        <span className="text-xs text-brand-green font-medium">
                          {calcOverall(evals[0].technical, evals[0].game_iq, evals[0].physical, evals[0].mental)}
                          {" → "}
                          {calcOverall(evals[evals.length-1].technical, evals[evals.length-1].game_iq, evals[evals.length-1].physical, evals[evals.length-1].mental)}
                        </span>
                        <span className="text-xs text-gray-400">Latest</span>
                      </div>
                    </div>

                    {latest && (
                      <div className="card mb-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">By Category</p>
                        {([
                          { key: "technical", label: "Technical" },
                          { key: "game_iq", label: "Game IQ" },
                          { key: "physical", label: "Physical" },
                          { key: "mental", label: "Mental" },
                        ] as const).map(({ key, label }) => {
                          const val = latest[key] as number;
                          return (
                            <div key={key} className="flex items-center gap-3 mb-3 last:mb-0">
                              <span className="text-sm text-gray-500 w-20">{label}</span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-brand-green" style={{ width: `${val * 10}%` }} />
                              </div>
                              <span className="text-sm font-medium w-5 text-right">{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="card bg-brand-green-light border-brand-green-mid">
                      <p className="text-sm font-medium text-brand-green-dark mb-1">{firstName} is developing well!</p>
                      <p className="text-xs text-green-700">
                        Keep supporting those focus areas at home — consistent practice makes the biggest difference.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="card text-center py-10">
                    <p className="text-sm text-gray-400">Progress charts appear after 2+ evaluations.</p>
                  </div>
                )}
              </>
            )}

            {/* Training tab */}
            {activeTab === "training" && (
              <>
                <h1 className="text-xl font-semibold mb-1">Recommended Training</h1>
                <p className="text-sm text-gray-400 mb-4">Matched to {firstName}&apos;s focus areas</p>

                {latest?.focus_areas?.length > 0 && (
                  <div className="bg-brand-blue-light rounded-2xl p-4 mb-4">
                    <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">This Week&apos;s Focus</div>
                    <div className="text-sm text-blue-900 font-medium">
                      10 min of {latest.focus_areas[0].toLowerCase()} drills before next practice goes a long way
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {DRILLS.slice(0, 3).map(drill => (
                    <div key={drill.id} className="card">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-brand-green-light flex items-center justify-center flex-shrink-0">
                          <Play size={16} className="text-brand-green" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-0.5">{drill.title}</div>
                          <p className="text-xs text-gray-400 mb-1.5">{drill.description}</p>
                          <div className="flex gap-3">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock size={11} /> {drill.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin size={11} /> {drill.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      {drill.video_url && (
                        <a href={drill.video_url} target="_blank" rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-2 py-2 border border-gray-100 rounded-lg text-xs text-brand-green font-medium hover:bg-brand-green-light transition-colors">
                          <Play size={12} /> Watch Video
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Coach Note tab */}
            {activeTab === "note" && (
              <>
                <h1 className="text-xl font-semibold mb-1">Coach Note</h1>
                <p className="text-sm text-gray-400 mb-4">
                  {latest ? `From ${formatDate(latest.created_at)}` : "No notes yet"}
                </p>

                {latest?.coach_note ? (
                  <div className="card border-l-4 border-l-brand-green rounded-l-none mb-4">
                    <p className="text-xs font-medium text-brand-green mb-2">Coach Note</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{latest.coach_note}</p>
                    <p className="text-xs text-gray-400 mt-3">{formatDate(latest.created_at)}</p>
                  </div>
                ) : (
                  <div className="card text-center py-10">
                    <p className="text-sm text-gray-400">No coach note for the latest session.</p>
                  </div>
                )}

                {latest && (
                  <div className="card">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Key Takeaways</p>
                    {latest.strengths?.map((s: string) => (
                      <div key={s} className="strength-pill">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                        <span className="text-sm text-brand-green-dark font-medium">{s}</span>
                      </div>
                    ))}
                    {latest.focus_areas?.length > 0 && (
                      <div className="my-2 border-t border-gray-50" />
                    )}
                    {latest.focus_areas?.map((f: string) => (
                      <div key={f} className="focus-pill">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-amber flex-shrink-0" />
                        <span className="text-sm text-amber-800 font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex z-10">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === key ? "text-brand-green" : "text-gray-400"
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-1 transition-colors ${
              activeTab === key ? "bg-brand-green" : "bg-transparent"
            }`} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
