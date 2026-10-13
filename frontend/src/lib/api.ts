import { CustomizeResumeResponse, HealthResponse, CoverLetterResponse } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://ai-resume-customizer-web-app.onrender.com"
    : "http://localhost:8000");

export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: "GET" });
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch (err) {
    return {
      status: "offline",
      version: "unknown",
      llm_provider: "none",
      active_model: "offline",
      api_key_configured: false,
    };
  }
}

export async function customizeResume(
  file: File,
  jobDescription: string,
  sections?: string[]
): Promise<CustomizeResumeResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);
  if (sections && sections.length > 0) {
    formData.append("sections", sections.join(","));
  }

  const res = await fetch(`${API_BASE}/api/customize`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to customize resume." }));
    throw new Error(errorData.detail || "Error during resume customization.");
  }

  return await res.json();
}

export async function generateCoverLetter(
  jobDescription: string,
  resumeText: string,
  candidateName?: string,
  companyName?: string,
  jobTitle?: string
): Promise<CoverLetterResponse> {
  const res = await fetch(`${API_BASE}/api/cover-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_description: jobDescription,
      resume_text: resumeText,
      candidate_name: candidateName,
      company_name: companyName,
      job_title: jobTitle,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to generate cover letter." }));
    throw new Error(errorData.detail || "Error generating cover letter.");
  }

  return await res.json();
}

export async function downloadResumeFile(
  markdown: string,
  candidateName: string,
  format: "pdf" | "docx" | "txt"
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/export/${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tailored_markdown: markdown,
      candidate_name: candidateName,
      export_format: format,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to export ${format.toUpperCase()}`);
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ext = format === "txt" ? "txt" : format;
  a.href = url;
  a.download = `${candidateName.replace(/\s+/g, "_")}_Tailored_Resume.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
