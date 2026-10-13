# 🎯 AI Resume Customizer Web App

An intelligent full-stack web application designed to help job seekers tailor and optimize their resumes for any Job Description (JD). Powered by modern Large Language Models (LLMs), the app analyzes resume text against job requirements, rewrites summaries, re-aligns skills and experience bullet points, calculates match & ATS scores, highlights changes in a visual Diff view, and exports ready-to-submit resumes in PDF, DOCX, and TXT formats.

---

## 🚀 Live Demo & Repository
- **Frontend App URL**: [https://frontend-ten-wheat-49.vercel.app](https://frontend-ten-wheat-49.vercel.app/)
- **Backend API URL**: [https://ai-resume-customizer-web-app.onrender.com](https://ai-resume-customizer-web-app.onrender.com)
- **API Health Check**: [https://ai-resume-customizer-web-app.onrender.com/api/health](https://ai-resume-customizer-web-app.onrender.com/api/health)
- **GitHub Repository**: [https://github.com/Sourabh-Bhakar5228/AI-Resume-Customizer-Web-App](https://github.com/Sourabh-Bhakar5228/AI-Resume-Customizer-Web-App)

---

## 🌟 Key Features

### Core Features
1. **Job Description Input**:
   - Clean textarea supporting long-form job specs.
   - Validation for non-empty input and minimum length thresholds.
   - Convenient "Load Sample JD" preset for quick testing.
2. **Resume Upload & Parsing**:
   - Accepts **PDF** and **DOCX** files up to 10MB.
   - Real-time display of file metadata (name, size, type).
   - High-fidelity text extraction using `pdfplumber` and `python-docx`.
3. **LLM-Powered Intelligent Customization**:
   - **Targeted Professional Summary**: Rewrites the profile summary to emphasize qualifications relevant to the target role.
   - **Skills Prioritization**: Categorizes and elevates matching hard/soft skills.
   - **Bullet Point Rephrasing**: Refines work experience bullet points using action verbs and quantifiable results matching JD keywords.
   - **Missing Keywords Detection**: Flags essential keywords found in the JD that are absent from the resume.
4. **Structured Output & Multi-Format Downloads**:
   - Interactive UI with tabbed view (Tailored Resume, Analysis & Scores, Diff View).
   - Instant export to **PDF**, **DOCX**, and **Markdown/Plain Text**.
5. **Comprehensive Error Handling**:
   - Client-side and server-side validation for unsupported formats, oversized files, and empty submissions.
   - Graceful fallback with descriptive error messages upon LLM rate-limit or API issues.

### 🎁 Bonus Features Implemented
- **📊 Match Score Analyzer**: Before vs. After compatibility score (%) showing how well the resume aligns with the JD.
- **🛡️ ATS Compatibility Rating**: Detailed ATS readiness index with actionable formatting and keyword suggestions.
- **🔍 Visual Diff Comparison**: Interactive side-by-side comparison highlighting rephrased and inserted sections.
- **🎛️ Section-Wise Customization**: Option to selectively target specific sections (Summary only, Experience only, or Full Resume).
- **✉️ Cover Letter Generator**: Generates an aligned cover letter with one click based on the extracted resume and target JD.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 14 Frontend                  │
│       (App Router, TypeScript, Tailwind CSS, Lucide)   │
│                                                        │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │ JD Textarea      │  │ Resume Dropzone (PDF/DOCX) │  │
│  └──────────────────┘  └────────────────────────────┘  │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │ Match & ATS View │  │ Side-by-Side Diff Viewer   │  │
│  └──────────────────┘  └────────────────────────────┘  │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │ Export Menu      │  │ Cover Letter Generator     │  │
│  └──────────────────┘  └────────────────────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (Multipart / JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Python FastAPI Backend                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ File Parser: pdfplumber & python-docx            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Prompt Orchestrator & Structured Pydantic Output │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Document Exporters: python-docx & ReportLab      │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │ Structured Inference
                            ▼
┌────────────────────────────────────────────────────────┐
│                  LLM Provider Layer                    │
│      Google Gemini 1.5 Flash / Groq Llama 3            │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router) | Modern React framework with server/client components |
| **Language** | TypeScript | Strong typing across frontend models |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Responsive, modern utility-first UI design |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean iconography |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance asynchronous Python web framework |
| **Parsing** | `pdfplumber` & `python-docx` | Robust text and metadata extraction from PDF and Word documents |
| **Exporting** | `python-docx` & `reportlab` | Programmatic DOCX and PDF document synthesis |
| **LLM Engine** | Google Gemini 1.5 Flash (or Groq Llama 3) | Fast, structured JSON generation with high context window |

---

## 📋 Prerequisites

Before running the project locally, ensure you have:
- **Node.js** (v18.17.0 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**
- An API Key for either:
  - **Google Gemini API**: Free key from [Google AI Studio](https://aistudio.google.com/)
  - **Groq API**: Free key from [Groq Console](https://console.groq.com/) *(Optional alternate)*

---

## ⚙️ Local Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/resume-customizer.git
cd resume-customizer
```

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Open `.env` in `backend/` and set your API key:
```env
# Choose your provider: 'gemini' or 'groq'
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Groq configuration
GROQ_API_KEY=your_groq_api_key_here

# Server Settings
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
Backend API docs will be accessible at: `http://localhost:8000/docs`

---

### 3. Frontend Setup (Next.js)
```bash
# Open a new terminal tab and navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Configure environment variables
cp .env.example .env.local
```

Set `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Endpoints Specification

| Method | Endpoint | Description | Request Body / Form |
|---|---|---|---|
| `GET` | `/api/health` | Healthcheck and active LLM status | None |
| `POST` | `/api/customize` | Analyze JD & tailor uploaded resume | `file` (PDF/DOCX), `job_description` (text), `sections` (optional array) |
| `POST` | `/api/export/pdf` | Generate and download styled PDF | Formatted resume JSON |
| `POST` | `/api/export/docx` | Generate and download styled DOCX | Formatted resume JSON |
| `POST` | `/api/cover-letter` | Generate tailored cover letter | `job_description` (text), `resume_text` (text) |

---

## 🚢 Deployment Guide

### Option 1: Frontend on Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select the repository and set the **Root Directory** to `frontend`.
4. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://resume-customizer-api.onrender.com`).
5. Click **Deploy**.

### Option 2: Backend on Render
1. Sign in to [Render](https://render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository and set **Root Directory** to `backend`.
3. Choose **Python 3** environment:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, configure:
   - `LLM_PROVIDER`: `gemini`
   - `GEMINI_API_KEY`: *(Your Google AI Studio API key)*
   - `CORS_ORIGINS`: Your Vercel frontend URL
5. Click **Deploy Web Service**.

*(Alternatively, use the included `backend/Dockerfile` to deploy on Google Cloud Run or Railway).*

---

## ⚖️ Known Limitations & Trade-offs
1. **Multi-Column & Graphic Resumes**: Resumes with highly intricate multi-column graphic layouts (e.g., Canva templates) may experience minor reordering during raw text extraction compared to single-column standard resumes.
2. **LLM Rate Limits (Free Tier)**: Free-tier Gemini / Groq API accounts have requests-per-minute (RPM) limits. The backend implements exponential backoff and friendly error notices when throttled.
3. **No Database Persistence in Core Flow**: To ensure applicant privacy and simplicity, uploaded resumes are parsed in memory and not stored permanently on disk or database.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
