"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { getInitials, formatDate, calcOverall } from "@/lib/utils";
import { Player, Evaluation } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical",
  game_iq: "Game IQ",
  physical: "Physical",
  mental: "Mental",
};

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const [player, setPlayer] = useState<Player | null>(null);
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from("players").select("*").eq("id", id).single(),
      supabase.from("evaluations").select("*").eq("player_id", id).order("created_at"),
    ]).then(([{ data: p }, { data: e }]) => {
      setPlayer(p);
      setEvals(e ?? []);
      setLoading(false);
    });
  }, [user, id]);

  if (loading) return <AppLayout><div className="p-8 text-center text-sm text-gray-400">Loading...</div></AppLayout>;
  if (!player) return <AppLayout><div className="p-8 text-center text-sm text-gray-400">Player not found</div></AppLayout>;

  const latest = evals[evals.length - 1];
  const overall = latest ? calcOverall(latest.technical, latest.game_iq, latest.physical, latest.mental) : null;

  const avgScore = (key: keyof Evaluation) => {
    if (evals.length === 0) return 0;
    const vals = evals.map(e => e[key] as number).filter(Boolean);
    return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0;
  };

  return (
    <AppLayout>
      <div className="px-4 py-5">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-400 mb-4">
          <ArrowLeft size={14} /> Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green-dark font-semibold text-lg">
            {getInitials(player.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{player.name}</h1>
            <p className="text-sm text-gray-400">
              {player.position} · {player.age_group}
              {player.jersey_number ? ` · #${player.jersey_number}` : ""}
            </p>
          </div>
        </div>

        {/* Overall score */}
        {overall && (
          <div className="card mb-4 text-center">
            <div className="text-xs text-gray-400 mb-1">Latest Overall</div>
            <div className="text-4xl font-semibold text-brand-green">{overall}</div>
            <div className="text-xs text-gray-400 mt-1">
              {evals.length} evaluation{evals.length !== 1 ? "s" : ""} total
            </div>
          </div>
        )}

        {/* Category scores */}
        {latest && (
          <div className="card mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Latest Scores</p>
            {(["technical", "game_iq", "physical", "mental"] as const).map(key => {
              const val = latest[key] as number;
              return (
                <div key={key} className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-600 w-20">{CATEGORY_LABELS[key]}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: `${val * 10}%` }} />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{val}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Strengths & Focus Areas */}
        {latest && (
          <div className="card mb-4">
            {latest.strengths?.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Strengths</p>
                {latest.strengths.map((s: string) => (
                  <div key={s} className="strength-pill">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                    <span className="text-sm text-brand-green-dark font-medium">{s}</span>
                  </div>
                ))}
              </>
            )}
            {latest.focus_areas?.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-3 mb-2">Focus Areas</p>
                {latest.focus_areas.map((f: string) => (
                  <div key={f} className="focus-pill">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-amber flex-shrink-0" />
                    <span className="text-sm text-amber-800 font-medium">{f}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Progress mini chart */}
        {evals.length > 1 && (
          <div className="card mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Progress ({evals.length} sessions)
            </p>
            <div className="flex items-end gap-1 h-12">
              {evals.map((e, i) => {
                const ov = calcOverall(e.technical, e.game_iq, e.physical, e.mental);
                const pct = (ov / 10) * 100;
                return (
                  <div key={e.id} className="flex-1 rounded-t-sm"
                    style={{ height: `${pct}%`, background: i === evals.length - 1 ? "#1D9E75" : "#9FE1CB" }} />
                );
              })}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">First</span>
              <span className="text-xs text-brand-green font-medium">
                {calcOverall(evals[0].technical, evals[0].game_iq, evals[0].physical, evals[0].mental)}
                {" → "}
                {calcOverall(evals[evals.length-1].technical, evals[evals.length-1].game_iq, evals[evals.length-1].physical, evals[evals.length-1].mental)}
              </span>
              <span className="text-xs text-gray-400">Latest</span>
            </div>
          </div>
        )}

        {/* Coach note */}
        {latest?.coach_note && (
          <div className="card mb-4 border-l-4 border-l-brand-green rounded-l-none">
            <p className="text-xs font-medium text-brand-green mb-1">Coach Note</p>
            <p className="text-sm text-gray-700">{latest.coach_note}</p>
            <p className="text-xs text-gray-400 mt-2">{formatDate(latest.created_at)}</p>
          </div>
        )}

        {/* Eval history */}
        {evals.length > 0 && (
          <div className="card">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Evaluation History</p>
            {[...evals].reverse().map(e => (
              <div key={e.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1">
                  <div className="text-sm font-medium">{formatDate(e.created_at)}</div>
                  <div className="text-xs text-gray-400">
                    T:{e.technical} · IQ:{e.game_iq} · P:{e.physical} · M:{e.mental}
                  </div>
                </div>
                <div className="text-lg font-semibold text-brand-green">
                  {calcOverall(e.technical, e.game_iq, e.physical, e.mental)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link href={`/evaluate?player=${player.id}`} className="btn-primary block text-center">
            Evaluate {player.name.split(" ")[0]}
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
