import io
import logging
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from app.config import settings
from app.models.schemas import (
    CustomizeResumeResponse,
    HealthResponse,
    CoverLetterRequest,
    CoverLetterResponse,
    ExportRequest,
)
from app.services.parser import extract_text_from_file
from app.services.llm_service import customize_resume_with_llm, generate_cover_letter_with_llm
from app.services.exporter import generate_docx_bytes, generate_pdf_bytes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

app = FastAPI(
    title="AI Resume Customizer API",
    description="Intelligent API to tailor candidate resumes to Job Descriptions with ATS scoring & diff metrics.",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, configure through CORS_ORIGINS environment variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Verify backend status and LLM configuration."""
    api_key_configured = bool(
        (settings.LLM_PROVIDER == "gemini" and settings.GEMINI_API_KEY)
        or (settings.LLM_PROVIDER == "groq" and settings.GROQ_API_KEY)
    )
    active_model = settings.GEMINI_MODEL if settings.LLM_PROVIDER == "gemini" else settings.GROQ_MODEL
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        llm_provider=settings.LLM_PROVIDER,
        active_model=active_model,
        api_key_configured=api_key_configured,
    )

@app.post("/api/customize", response_model=CustomizeResumeResponse)
async def customize_resume(
    file: UploadFile = File(..., description="Uploaded resume in PDF or DOCX format"),
    job_description: str = Form(..., description="Job Description text to tailor the resume against"),
    sections: Optional[str] = Form(None, description="Comma-separated sections to customize (optional)")
):
    """
    Core Endpoint:
    1. Parses uploaded PDF/DOCX file
    2. Validates JD length & content
    3. Customizes summary, skills, and experience via LLM
    4. Computes Match Score, ATS score, missing keywords, and diff highlights
    """
    # 1. Validation
    jd_clean = job_description.strip()
    if not jd_clean or len(jd_clean) < 30:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short. Please provide at least 30 characters of job details."
        )

    # 2. Extract Text from File
    resume_text, metadata = await extract_text_from_file(file)
    logger.info(f"Successfully parsed resume: {metadata['filename']} ({metadata['size_kb']} KB, {metadata['word_count']} words)")

    # 3. Parse optional sections list
    target_sections = [s.strip() for s in sections.split(",")] if sections else None

    # 4. Invoke LLM Customization
    result = await customize_resume_with_llm(
        resume_text=resume_text,
        job_description=jd_clean,
        sections_to_customize=target_sections
    )

    return result

@app.post("/api/cover-letter", response_model=CoverLetterResponse)
async def create_cover_letter(payload: CoverLetterRequest):
    """Bonus Feature: Generate tailored cover letter based on JD and Resume."""
    if not payload.job_description.strip() or not payload.resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Both job description and resume text are required to generate a cover letter."
        )

    res = await generate_cover_letter_with_llm(
        job_description=payload.job_description,
        resume_text=payload.resume_text,
        candidate_name=payload.candidate_name,
        company_name=payload.company_name,
        job_title=payload.job_title
    )
    return CoverLetterResponse(**res)

@app.post("/api/export/docx")
async def export_docx(payload: ExportRequest):
    """Export formatted resume markdown as a styled DOCX document."""
    if not payload.tailored_markdown.strip():
        raise HTTPException(status_code=400, detail="Cannot export empty resume content.")

    docx_bytes = generate_docx_bytes(payload.tailored_markdown, payload.candidate_name)
    safe_name = "".join(c for c in (payload.candidate_name or "Resume") if c.isalnum() or c in (' ', '_', '-')).strip()
    filename = f"{safe_name.replace(' ', '_')}_Tailored_Resume.docx"

    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@app.post("/api/export/pdf")
async def export_pdf(payload: ExportRequest):
    """Export formatted resume markdown as an ATS-optimized PDF document."""
    if not payload.tailored_markdown.strip():
        raise HTTPException(status_code=400, detail="Cannot export empty resume content.")

    pdf_bytes = generate_pdf_bytes(payload.tailored_markdown, payload.candidate_name)
    safe_name = "".join(c for c in (payload.candidate_name or "Resume") if c.isalnum() or c in (' ', '_', '-')).strip()
    filename = f"{safe_name.replace(' ', '_')}_Tailored_Resume.pdf"

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@app.post("/api/export/txt")
async def export_txt(payload: ExportRequest):
    """Export resume as clean plain text / markdown."""
    safe_name = "".join(c for c in (payload.candidate_name or "Resume") if c.isalnum() or c in (' ', '_', '-')).strip()
    filename = f"{safe_name.replace(' ', '_')}_Tailored_Resume.txt"
    
    return Response(
        content=payload.tailored_markdown.encode("utf-8"),
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
