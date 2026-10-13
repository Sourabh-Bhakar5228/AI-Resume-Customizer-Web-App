from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ExperienceItem(BaseModel):
    role: str = Field(..., description="Job title / role")
    company: str = Field(..., description="Company or organization name")
    duration: Optional[str] = Field(None, description="Employment dates or period")
    location: Optional[str] = Field(None, description="Location or remote status")
    original_bullets: List[str] = Field(default_factory=list, description="Original bullet points")
    tailored_bullets: List[str] = Field(default_factory=list, description="Action-oriented, JD-aligned bullet points")

class SkillCategorization(BaseModel):
    matched_skills: List[str] = Field(default_factory=list, description="Skills present in both resume and JD")
    missing_critical_skills: List[str] = Field(default_factory=list, description="Important JD skills not found in resume")
    recommended_skills: List[str] = Field(default_factory=list, description="Suggested skills or technologies to highlight")

class DiffHighlight(BaseModel):
    section: str = Field(..., description="Section where changes occurred")
    change_type: str = Field(..., description="modified, added, reordered")
    original_text: str = Field(..., description="Original text excerpt")
    tailored_text: str = Field(..., description="Tailored text excerpt")
    explanation: str = Field(..., description="Why this change improves JD alignment")

class CustomizeResumeResponse(BaseModel):
    candidate_name: Optional[str] = Field(None, description="Extracted candidate name")
    candidate_contact: Optional[str] = Field(None, description="Extracted contact info / links")
    original_summary: Optional[str] = Field(None, description="Original summary or objective")
    tailored_summary: str = Field(..., description="Optimized professional summary matching JD")
    skills: SkillCategorization
    experience: List[ExperienceItem] = Field(default_factory=list)
    education: Optional[str] = Field(None, description="Education section summary")
    certifications_or_projects: Optional[str] = Field(None, description="Projects or certifications")
    
    # Analysis & Scoring Metrics (Bonus)
    match_score_before: int = Field(..., ge=0, le=100, description="Match score before customization")
    match_score_after: int = Field(..., ge=0, le=100, description="Match score after customization")
    ats_score: int = Field(..., ge=0, le=100, description="Estimated ATS compatibility score")
    ats_feedback: List[str] = Field(default_factory=list, description="ATS improvement tips")
    missing_keywords: List[str] = Field(default_factory=list, description="Keywords missing from original resume")
    
    # Diff View & Ready Markdown
    diff_highlights: List[DiffHighlight] = Field(default_factory=list)
    full_tailored_markdown: str = Field(..., description="Complete tailored resume in formatted markdown")
    raw_original_text: Optional[str] = Field(None, description="Raw extracted text of the uploaded resume")

class CoverLetterRequest(BaseModel):
    job_description: str
    resume_text: str
    candidate_name: Optional[str] = None
    company_name: Optional[str] = None
    job_title: Optional[str] = None

class CoverLetterResponse(BaseModel):
    cover_letter_markdown: str
    key_selling_points: List[str] = Field(default_factory=list)

class ExportRequest(BaseModel):
    tailored_markdown: str
    candidate_name: Optional[str] = "Resume"
    export_format: str = "pdf" # 'pdf' | 'docx' | 'txt'

class HealthResponse(BaseModel):
    status: str
    version: str
    llm_provider: str
    active_model: str
    api_key_configured: bool
