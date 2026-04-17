"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Play, Clock, MapPin } from "lucide-react";
import { DRILLS } from "@/lib/utils";

type Category = "all" | "technical" | "tactical" | "physical" | "mental";

const CATEGORY_COLORS: Record<string, string> = {
  technical: "bg-brand-green-light text-brand-green-dark",
  tactical: "bg-brand-blue-light text-blue-800",
  physical: "bg-brand-amber-light text-amber-800",
  mental: "bg-brand-coral-light text-red-800",
};

const ICON_BG: Record<string, string> = {
  technical: "bg-brand-green-light",
  tactical: "bg-brand-blue-light",
  physical: "bg-brand-amber-light",
  mental: "bg-brand-coral-light",
};

export default function TrainingPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = activeCategory === "all"
    ? DRILLS
    : DRILLS.filter(d => d.category === activeCategory);

  return (
    <AppLayout>
      <div className="px-4 py-5">
        <h1 className="text-xl font-semibold mb-1">Training Library</h1>
        <p className="text-sm text-gray-400 mb-4">Drills matched to focus areas</p>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {(["all", "technical", "tactical", "physical", "mental"] as Category[]).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-brand-green text-white border-brand-green"
                  : "border-gray-200 text-gray-500 bg-white"
              }`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(drill => (
            <div key={drill.id} className="card">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${ICON_BG[drill.category]}`}>
                  <Play size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-sm font-medium">{drill.title}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${CATEGORY_COLORS[drill.category]}`}>
                      {drill.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{drill.description}</p>
                  <div className="flex items-center gap-3">
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
      </div>
    </AppLayout>
  );
}
