"use client";

import React, { useState } from "react";
import { Download, Copy, Check, FileDown, Edit3, Eye, FileText } from "lucide-react";
import { downloadResumeFile } from "@/lib/api";
import { CustomizeResumeResponse } from "@/types";

interface ResumePreviewProps {
  data: CustomizeResumeResponse;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const [content, setContent] = useState(data.full_tailored_markdown);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format: "pdf" | "docx" | "txt") => {
    try {
      setDownloading(format);
      await downloadResumeFile(content, data.candidate_name || "Tailored_Resume", format);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-xs px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-colors ${
              isEditing
                ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                : "bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white"
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? "View Rendered" : "Edit Markdown"}</span>
          </button>

          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>
        </div>

        {/* Download Action Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Export As:</span>
          
          <button
            onClick={() => handleExport("pdf")}
            disabled={downloading !== null}
            className="text-xs px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{downloading === "pdf" ? "Building..." : "PDF"}</span>
          </button>

          <button
            onClick={() => handleExport("docx")}
            disabled={downloading !== null}
            className="text-xs px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{downloading === "docx" ? "Building..." : "DOCX"}</span>
          </button>

          <button
            onClick={() => handleExport("txt")}
            disabled={downloading !== null}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <span>TXT</span>
          </button>
        </div>
      </div>

      {/* Editor / Rendered Document Area */}
      {isEditing ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className="w-full p-6 bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
          {/* Formatted Clean Resume Preview */}
          <div className="max-w-3xl mx-auto space-y-6 text-slate-200">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-5 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {data.candidate_name || "Tailored Candidate"}
              </h1>
              {data.candidate_contact && (
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {data.candidate_contact}
                </p>
              )}
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {data.tailored_summary}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
                Technical Competencies & Skills
              </h2>
              <div className="text-xs text-slate-300 space-y-1.5">
                <p>
                  <strong className="text-slate-100 font-semibold">Matched Core: </strong>
                  {data.skills?.matched_skills?.join(", ") || "General Engineering, Analytical Thinking"}
                </p>
                {data.skills?.recommended_skills && data.skills.recommended_skills.length > 0 && (
                  <p>
                    <strong className="text-slate-100 font-semibold">Related Technologies: </strong>
                    {data.skills.recommended_skills.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
                Professional Experience
              </h2>
              {data.experience && data.experience.length > 0 ? (
                data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                      <span className="font-bold text-sm text-slate-100">
                        {exp.role} <span className="font-normal text-slate-400">at {exp.company}</span>
                      </span>
                      <span className="text-slate-500 font-mono mt-0.5 sm:mt-0">
                        {exp.duration || ""} {exp.location ? `| ${exp.location}` : ""}
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-slate-300">
                      {(exp.tailored_bullets && exp.tailored_bullets.length > 0
                        ? exp.tailored_bullets
                        : exp.original_bullets
                      ).map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">Experience detailed in tailored markdown.</div>
              )}
            </div>

            {/* Education */}
            {data.education && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
                  Education & Credentials
                </h2>
                <p className="text-xs text-slate-300">{data.education}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
