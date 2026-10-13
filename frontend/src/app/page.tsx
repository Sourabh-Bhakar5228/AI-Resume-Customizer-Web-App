"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import CustomizeOptions from "@/components/CustomizeOptions";
import MatchAnalysis from "@/components/MatchAnalysis";
import ResumePreview from "@/components/ResumePreview";
import DiffViewer from "@/components/DiffViewer";
import CoverLetterModal from "@/components/CoverLetterModal";
import { customizeResume } from "@/lib/api";
import { CustomizeResumeResponse } from "@/types";
import {
  Sparkles,
  Loader2,
  FileCheck,
  BarChart3,
  GitCompare,
  Mail,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CustomizeResumeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"resume" | "analysis" | "diff">("resume");
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);

  const handleToggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleCustomize = async () => {
    setError(null);

    // Validation
    if (!file) {
      setError("Please upload your resume (PDF or DOCX).");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      setError("Please provide a Job Description with at least 30 characters.");
      return;
    }

    try {
      setLoading(true);
      const data = await customizeResume(file, jobDescription, selectedSections);
      setResult(data);
      setActiveTab("resume");
    } catch (err: any) {
      setError(err.message || "Failed to customize resume. Please check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Intelligent Resume Tailoring & ATS Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Tailor Your Resume for Any Job{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-indigo-400">
              in Seconds
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Upload your existing resume, paste the target Job Description, and let AI rewrite your summary,
            re-align experience bullets with quantifiable metrics, and maximize your ATS match score.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form (5 cols on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-6">
              <ResumeUpload file={file} onFileSelect={setFile} />

              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />

              <CustomizeOptions
                selectedSections={selectedSections}
                onToggleSection={handleToggleSection}
              />

              <button
                type="button"
                onClick={handleCustomize}
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-indigo-600 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing & Tailoring Resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Tailor Resume with AI</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output / Dashboard (7 cols on large screens) */}
          <div className="lg:col-span-7">
            {!result ? (
              // Empty State
              <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white">Your Tailored Resume Will Appear Here</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Once you upload your resume and submit a Job Description, the AI will extract your competencies,
                    enhance bullet points, and present live match metrics and download options.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-lg mx-auto text-left">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <span className="font-semibold text-teal-400 block mb-1">1. Summary Rewrite</span>
                    <span className="text-slate-400 text-[11px]">Directly hooks hiring managers for the target role.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <span className="font-semibold text-indigo-400 block mb-1">2. Experience Tuning</span>
                    <span className="text-slate-400 text-[11px]">Applies metric formulas to work accomplishments.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <span className="font-semibold text-emerald-400 block mb-1">3. ATS & Diff View</span>
                    <span className="text-slate-400 text-[11px]">Compare side-by-side and export in PDF / DOCX.</span>
                  </div>
                </div>
              </div>
            ) : (
              // Output Dashboard
              <div className="space-y-6">
                {/* Result Navigation Tabs & Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setActiveTab("resume")}
                      className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                        activeTab === "resume"
                          ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Tailored Resume</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("analysis")}
                      className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                        activeTab === "analysis"
                          ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Match & ATS ({result.match_score_after}%)</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("diff")}
                      className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                        activeTab === "diff"
                          ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <GitCompare className="w-4 h-4" />
                      <span>Diff View</span>
                    </button>
                  </div>

                  {/* Bonus Action: Generate Cover Letter */}
                  <button
                    onClick={() => setIsCoverLetterOpen(true)}
                    className="text-xs px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium flex items-center space-x-1.5 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Generate Cover Letter</span>
                  </button>
                </div>

                {/* Tab Panels */}
                {activeTab === "resume" && <ResumePreview data={result} />}
                {activeTab === "analysis" && <MatchAnalysis data={result} />}
                {activeTab === "diff" && (
                  <DiffViewer
                    highlights={result.diff_highlights}
                    originalText={result.raw_original_text}
                    tailoredText={result.full_tailored_markdown}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bonus Cover Letter Generator Modal */}
      {result && (
        <CoverLetterModal
          isOpen={isCoverLetterOpen}
          onClose={() => setIsCoverLetterOpen(false)}
          jobDescription={jobDescription}
          resumeText={result.raw_original_text || result.full_tailored_markdown}
          candidateName={result.candidate_name}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <p>AI Resume Customizer &copy; 2026. Built with Next.js 14, FastAPI & Gemini LLM.</p>
      </footer>
    </div>
  );
}
