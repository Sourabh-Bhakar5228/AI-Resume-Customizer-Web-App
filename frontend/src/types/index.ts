export interface ExperienceItem {
  role: string;
  company: string;
  duration?: string;
  location?: string;
  original_bullets: string[];
  tailored_bullets: string[];
}

export interface SkillCategorization {
  matched_skills: string[];
  missing_critical_skills: string[];
  recommended_skills: string[];
}

export interface DiffHighlight {
  section: string;
  change_type: string;
  original_text: string;
  tailored_text: string;
  explanation: string;
}

export interface CustomizeResumeResponse {
  candidate_name?: string;
  candidate_contact?: string;
  original_summary?: string;
  tailored_summary: string;
  skills: SkillCategorization;
  experience: ExperienceItem[];
  education?: string;
  certifications_or_projects?: string;
  match_score_before: number;
  match_score_after: number;
  ats_score: number;
  ats_feedback: string[];
  missing_keywords: string[];
  diff_highlights: DiffHighlight[];
  full_tailored_markdown: string;
  raw_original_text?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  llm_provider: string;
  active_model: string;
  api_key_configured: boolean;
}

export interface CoverLetterResponse {
  cover_letter_markdown: string;
  key_selling_points: string[];
}
