"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

const POSITIONS = ["Forward", "Midfielder", "Defender", "Goalkeeper"];
const AGE_GROUPS = ["U8", "U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17", "U18"];

export function AddPlayerButton({ coachId }: { coachId: string }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", position: "Forward", age_group: "U14", jersey_number: "" });
  const router = useRouter();

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setOpen(false);
    setForm({ name: "", position: "Forward", age_group: "U14", jersey_number: "" });
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 bg-brand-green text-white rounded-xl text-sm font-medium"
      >
        <Plus size={14} />
        Add Player
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold">Add Player</h2>
              <button onClick={() => setOpen(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full name</label>
                <input
                  type="text"
                  placeholder="e.g. Jamie Lee"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Position</label>
                <select
                  value={form.position}
                  onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green bg-white"
                >
                  {POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Age group</label>
                <select
                  value={form.age_group}
                  onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green bg-white"
                >
                  {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Jersey number (optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={form.jersey_number}
                  onChange={e => setForm(f => ({ ...f, jersey_number: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="mt-5 btn-primary disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Player"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
