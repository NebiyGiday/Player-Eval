import { currentUser } from "@clerk/nextjs/server";
import AppLayout from "@/components/AppLayout";
import { createServiceClient } from "@/lib/supabase";
import Link from "next/link";
import { ChevronRight, CheckCircle2, Clock } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  const supabase = createServiceClient();

  const { data: players } = await supabase
    .from("players")
    .select("*, evaluations(created_at, overall)")
    .eq("coach_user_id", user?.id ?? "")
    .order("name");

  const firstName = user?.firstName ?? "Coach";

  const pendingCount =
    players?.filter((p) => {
      const evals = p.evaluations ?? [];
      if (evals.length === 0) return true;
      const last = new Date(evals[evals.length - 1].created_at);
      return Date.now() - last.getTime() > 3 * 24 * 60 * 60 * 1000;
    }).length ?? 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  return (
    <AppLayout>
      <div className="px-4 py-5">
        <h1 className="text-xl font-semibold mb-1">Good {greeting}, {firstName}</h1>
        <p className="text-sm text-gray-400 mb-5">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="card">
            <div className="text-xs text-gray-400 mb-1">Total Players</div>
            <div className="text-2xl font-semibold">{players?.length ?? 0}</div>
          </div>
          <div className="card">
            <div className="text-xs text-gray-400 mb-1">Need Evaluation</div>
            <div className="text-2xl font-semibold text-brand-amber">{pendingCount}</div>
          </div>
        </div>

        <Link href="/evaluate" className="btn-primary block text-center mb-5">
          Start Evaluation
        </Link>

        <div className="card">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Players
          </p>
          {players && players.length > 0 ? (
            players.slice(0, 6).map((player) => {
              const evals = player.evaluations ?? [];
              const lastEval = evals[evals.length - 1];
              const done = lastEval &&
                Date.now() - new Date(lastEval.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;
              return (
                <Link key={player.id} href={`/players/${player.id}`}
                  className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green-dark text-xs font-semibold">
                    {player.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{player.name}</div>
                    <div className="text-xs text-gray-400">{player.position} · {player.age_group}</div>
                  </div>
                  {done
                    ? <CheckCircle2 size={16} className="text-brand-green" />
                    : <Clock size={16} className="text-brand-amber" />}
                  <ChevronRight size={14} className="text-gray-300" />
                </Link>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-3">No players yet</p>
              <Link href="/players" className="text-sm text-brand-green font-medium">
                Add your first player →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
