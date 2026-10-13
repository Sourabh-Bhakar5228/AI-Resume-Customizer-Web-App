"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, X, Sparkles, Loader2 } from "lucide-react";
import { generateCoverLetter } from "@/lib/api";

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: string;
  resumeText: string;
  candidateName?: string;
}

export default function CoverLetterModal({
  isOpen,
  onClose,
  jobDescription,
  resumeText,
  candidateName,
}: CoverLetterModalProps) {
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [points, setPoints] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await generateCoverLetter(
        jobDescription,
        resumeText,
        candidateName,
        companyName || "Hiring Team",
        jobTitle || "the position"
      );
      setCoverLetter(res.cover_letter_markdown);
      setPoints(res.key_selling_points || []);
    } catch (err: any) {
      alert(`Cover letter generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cover Letter Generator</h3>
            <p className="text-xs text-slate-400">Customized letter connecting resume achievements to this role</p>
          </div>
        </div>

        {!coverLetter && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Company Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Target Job Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Tailored Cover Letter</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-300 font-medium">Crafting tailored letter aligned to role requirements...</p>
          </div>
        )}

        {coverLetter && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Generated Cover Letter</span>
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
              {coverLetter}
            </div>

            {points.length > 0 && (
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 space-y-1">
                <span className="font-semibold block">Key Selling Points Highlighted:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-teal-200">
                  {points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
