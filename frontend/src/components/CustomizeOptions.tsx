"use client";

import React from "react";
import { SlidersHorizontal, Check } from "lucide-react";

interface CustomizeOptionsProps {
  selectedSections: string[];
  onToggleSection: (section: string) => void;
}

const AVAILABLE_SECTIONS = [
  { id: "summary", label: "Executive Summary" },
  { id: "skills", label: "Skills & Keywords" },
  { id: "experience", label: "Work Experience" },
  { id: "projects", label: "Projects & Impact" },
];

export default function CustomizeOptions({
  selectedSections,
  onToggleSection,
}: CustomizeOptionsProps) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
          <span>Tailoring Scope (Bonus: Section Toggles)</span>
        </div>
        <span className="text-[11px] text-slate-500">
          {selectedSections.length === 0 ? "Full Resume" : `${selectedSections.length} sections selected`}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {AVAILABLE_SECTIONS.map((sec) => {
          const isSelected = selectedSections.includes(sec.id);
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onToggleSection(sec.id)}
              className={`text-xs px-3 py-2 rounded-xl border flex items-center justify-between transition-all ${
                isSelected
                  ? "bg-teal-500/15 border-teal-500/40 text-teal-300 font-medium"
                  : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <span>{sec.label}</span>
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                  isSelected
                    ? "bg-teal-500 border-teal-400 text-slate-950 font-bold"
                    : "border-slate-600 bg-transparent"
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
