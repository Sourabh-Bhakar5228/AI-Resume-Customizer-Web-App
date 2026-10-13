"use client";

import React from "react";
import { Sparkles, Trash2, FileCode } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

const SAMPLE_JDS = [
  {
    title: "Full Stack Engineer (Next.js + Python)",
    text: `Job Title: Senior Full Stack Engineer
Location: Remote
Company: NovaTech Solutions

About the Role:
We are seeking an experienced Full Stack Engineer to build and scale our high-throughput AI-powered SaaS platform. You will work across the entire stack—designing responsive Next.js web applications, building robust Python (FastAPI/Flask) REST services, and integrating cutting-edge LLMs.

Key Responsibilities:
- Design, develop, and deploy modular frontends using Next.js 14 (App Router), React, and Tailwind CSS.
- Build scalable backend microservices and APIs with Python (FastAPI), Pydantic, and async background workers.
- Integrate LLM APIs (OpenAI, Gemini, Groq) with structured JSON schemas and prompt evaluation.
- Implement robust CI/CD pipelines and containerize services with Docker on cloud platforms (AWS, GCP, Render).
- Optimize SQL queries and data models for PostgreSQL/Redis caching.

Required Qualifications:
- 3+ years of professional full-stack software development experience.
- Strong proficiency in modern TypeScript/JavaScript and Python 3.10+.
- Hands-on experience with modern frontend state management, RESTful APIs, and document processing.
- Proven familiarity with Git workflows, unit/integration testing, and agile sprints.
- Excellent communication and collaborative problem-solving skills.`
  },
  {
    title: "Backend / AI Systems Engineer",
    text: `Role: Backend Engineer - AI Integrations
Location: Hybrid / Remote

Overview:
Looking for a Backend Engineer passionate about AI applications, data pipelines, and scalable APIs.

Requirements:
- Strong expertise with Python, FastAPI, and asynchronous task queues (Celery/Redis).
- Experience integrating LLM APIs (Gemini, Anthropic, OpenAI) with prompt engineering and vector databases.
- Solid understanding of document parsing (PDF, DOCX) and text preprocessing.
- Experience with Docker, cloud deployments (Render, AWS ECS, GCP), and automated tests.`
  }
];

export default function JobDescriptionInput({ value, onChange, error }: JobDescriptionInputProps) {
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <span>2. Job Description (JD)</span>
          <span className="text-xs font-normal text-slate-400">({wordCount} words, min 30 chars)</span>
        </label>
        <div className="flex items-center space-x-2">
          {/* Preset Samples Dropdown */}
          <button
            type="button"
            onClick={() => onChange(SAMPLE_JDS[0].text)}
            className="text-xs text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Load Sample JD</span>
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-slate-400 hover:text-rose-400 p-1 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={9}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the target Job Description (role requirements, responsibilities, tech stack, qualifications)..."
          className={`w-full rounded-2xl p-4 text-sm bg-slate-900/60 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all font-sans resize-y ${
            error ? "border-rose-500/60" : "border-slate-800 focus:border-teal-500/50"
          }`}
        />
        <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 pointer-events-none">
          {charCount} characters
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      )}
    </div>
  );
}
