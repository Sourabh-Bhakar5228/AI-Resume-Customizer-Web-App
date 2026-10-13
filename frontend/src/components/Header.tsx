"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { checkBackendHealth } from "@/lib/api";
import { HealthResponse } from "@/types";

export default function Header() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    checkBackendHealth().then(setHealth);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">ResumeTailor</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Intelligent Job Description Alignment & ATS Optimization</p>
          </div>
        </div>

        {/* Backend & Model Status Indicator */}
        <div className="flex items-center space-x-3">
          {health?.status === "healthy" ? (
            <div className="flex items-center space-x-2 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono">
                {health.llm_provider.toUpperCase()}: {health.active_model}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>FastAPI Ready</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
