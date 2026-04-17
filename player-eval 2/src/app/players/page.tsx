"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Plus, ChevronRight, Search } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { getInitials } from "@/lib/utils";
import { Player } from "@/types";

const AVATAR_COLORS = [
  "bg-brand-green-light text-brand-green-dark",
  "bg-brand-blue-light text-blue-800",
  "bg-brand-amber-light text-amber-800",
  "bg-brand-coral-light text-red-800",
];

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const AGE_GROUPS = ["U8", "U10", "U12", "U14", "U16", "U18"];

export default function PlayersPage() {
  const { user } = useUser();
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", position: "", age_group: "", jersey_number: ""
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("players")
      .select("*")
      .eq("coach_user_id", user.id)
      .order("name")
      .then(({ data }) => { setPlayers(data ?? []); setLoading(false); });
  }, [user]);

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function addPlayer() {
    if (!user || !form.name.trim()) return;
    const { data } = await supabase.from("players").insert({
      name: form.name.trim(),
      position: form.position || "Unknown",
      age_group: form.age_group || "U14",
      jersey_number: form.jersey_number ? parseInt(form.jersey_number) : null,
      coach_user_id: user.id,
      team_id: user.id,
    }).select().single();
    if (data) {
      setPlayers(prev => [...prev, data]);
      setShowAdd(false);
      setForm({ name: "", position: "", age_group: "", jersey_number: "" });
    }
  }

  return (
    <AppLayout>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Players</h1>
          <button onClick={() => setShowAdd(true)}
            className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search players..."
            className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-brand-green" />
        </div>

        {showAdd && (
          <div className="card mb-4 border border-brand-green">
            <p className="text-sm font-medium mb-3">Add New Player</p>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Full name *"
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm mb-2 focus:outline-none focus:border-brand-green" />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
                className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-green">
                <option value="">Position</option>
                {POSITIONS.map(p => <option key={p}>{p}</option>)}
              </select>
              <select value={form.age_group} onChange={e => setForm({ ...form, age_group: e.target.value })}
                className="px-3 py-2 border border-gray-100 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-green">
                <option value="">Age Group</option>
                {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <input value={form.jersey_number} onChange={e => setForm({ ...form, jersey_number: e.target.value })}
              placeholder="Jersey # (optional)" type="number"
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm mb-3 focus:outline-none focus:border-brand-green" />
            <div className="flex gap-2">
              <button onClick={addPlayer}
                className="flex-1 py-2 bg-brand-green text-white rounded-lg text-sm font-medium">
                Add Player
              </button>
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="card">
          {loading ? (
            <div className="text-center py-8 text-sm text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-2">
                {search ? "No players found" : "No players yet"}
              </p>
              {!search && (
                <button onClick={() => setShowAdd(true)}
                  className="text-sm text-brand-green font-medium">
                  Add your first player
                </button>
              )}
            </div>
          ) : (
            filtered.map((player, i) => (
              <Link key={player.id} href={`/players/${player.id}`}
                className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {getInitials(player.name)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{player.name}</div>
                  <div className="text-xs text-gray-400">
                    {player.position} · {player.age_group}
                    {player.jersey_number ? ` · #${player.jersey_number}` : ""}
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </Link>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
