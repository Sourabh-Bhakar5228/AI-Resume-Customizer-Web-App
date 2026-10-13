"use client";

import React, { useState } from "react";
import { DiffHighlight } from "@/types";
import { ArrowRight, Sparkles, Check, Split } from "lucide-react";

interface DiffViewerProps {
  highlights: DiffHighlight[];
  originalText?: string;
  tailoredText: string;
}

export default function DiffViewer({
  highlights,
  originalText,
  tailoredText,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<"highlights" | "sideBySide">("highlights");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Review the precise rephrasing, additions, and metric enhancements made to align with the JD.
        </p>
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("highlights")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
              viewMode === "highlights"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Key Changes
          </button>
          <button
            onClick={() => setViewMode("sideBySide")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
              viewMode === "sideBySide"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Split className="w-3 h-3" />
            <span>Raw Comparison</span>
          </button>
        </div>
      </div>

      {viewMode === "highlights" ? (
        <div className="space-y-4">
          {highlights && highlights.length > 0 ? (
            highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700">
                    {item.section}
                  </span>
                  <span className="text-[11px] text-slate-400 italic">{item.explanation}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  {/* Before */}
                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Original Text</span>
                    <p className="line-clamp-4 text-slate-400 font-mono text-[11px] leading-relaxed">
                      {item.original_text || "(Generic or unaddressed in original)"}
                    </p>
                  </div>

                  {/* After */}
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-slate-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                      Tailored & ATS Enhanced
                    </span>
                    <p className="font-mono text-[11px] text-emerald-200 leading-relaxed">{item.tailored_text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-sm">
              Customization synthesized and enhanced across the full document.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Original Resume (Raw Extracted)
            </span>
            <pre className="text-xs font-mono text-slate-400 p-3 bg-slate-950/70 rounded-xl overflow-x-auto h-[450px] whitespace-pre-wrap leading-relaxed">
              {originalText || "No raw text available."}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-teal-500/30 space-y-2">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block">
              Tailored Resume (Markdown)
            </span>
            <pre className="text-xs font-mono text-slate-200 p-3 bg-slate-950/70 rounded-xl overflow-x-auto h-[450px] whitespace-pre-wrap leading-relaxed">
              {tailoredText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
