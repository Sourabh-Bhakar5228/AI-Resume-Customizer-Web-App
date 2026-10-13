"use client";

import React from "react";
import { TrendingUp, ShieldCheck, AlertTriangle, CheckCircle, Tag, Sparkles } from "lucide-react";
import { CustomizeResumeResponse } from "@/types";

interface MatchAnalysisProps {
  data: CustomizeResumeResponse;
}

export default function MatchAnalysis({ data }: MatchAnalysisProps) {
  const scoreDiff = data.match_score_after - data.match_score_before;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Match Score Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Job Match Score</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +{scoreDiff}% Boost
            </span>
          </div>

          <div className="mt-4 flex items-baseline space-x-3">
            <span className="text-4xl font-extrabold text-white tracking-tight">{data.match_score_after}%</span>
            <span className="text-sm text-slate-500 line-through">from {data.match_score_before}%</span>
          </div>

          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.match_score_after}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Keywords and qualification alignment strongly boosted.</p>
        </div>

        {/* ATS Score Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ATS Readiness</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>

          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-teal-400 tracking-tight">{data.ats_score}%</span>
            <span className="text-xs text-teal-500 font-medium">ATS Optimized</span>
          </div>

          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.ats_score}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Parsed into machine-scannable structure & headers.</p>
        </div>

        {/* Missing Keywords Identified */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Missing Keywords</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>

          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-amber-400 tracking-tight">
              {data.missing_keywords?.length || 0}
            </span>
            <span className="text-xs text-slate-400">Actionable terms</span>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            Integrate these identified JD terms where truthful to maximize interview calls.
          </p>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Aligned Skills ({data.skills?.matched_skills?.length || 0})</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills?.matched_skills?.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / High-Priority Keywords */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-sm font-semibold text-amber-400">
            <Tag className="w-4 h-4" />
            <span>Recommended Missing Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.missing_keywords?.map((kw, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ATS Optimization Checklist */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>ATS Recommendations & Best Practices</span>
        </div>
        <ul className="space-y-2 pt-1">
          {data.ats_feedback?.map((tip, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
              <span className="text-teal-400 font-bold mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
