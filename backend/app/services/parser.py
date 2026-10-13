import io
import re
from typing import Tuple
from fastapi import UploadFile, HTTPException

def clean_text(text: str) -> str:
    """Normalize extracted text whitespace and linebreaks."""
    if not text:
        return ""
    # Replace non-breaking and special spaces with standard space
    text = text.replace('\xa0', ' ').replace('\u200b', '').replace('\u202f', ' ')
    # Replace carriage returns and excessive newlines
    text = re.sub(r'\r\n', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove null or strange non-printable characters
    text = "".join(char for char in text if char.isprintable() or char in "\n\t\r")
    return text.strip()

def extract_candidate_header(text: str) -> dict:
    """
    Extracts candidate name, email, phone, LinkedIn, GitHub, location,
    and a formatted contact line directly from raw resume text.
    """
    if not text:
        return {
            "candidate_name": "Candidate",
            "email": "",
            "phone": "",
            "linkedin": "",
            "github": "",
            "formatted_contact": ""
        }

    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # Extract emails
    emails = re.findall(r'\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\b', text)
    email = emails[0].strip() if emails else ""

    # Extract phone numbers
    phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}'
    phones = [p.strip() for p in re.findall(phone_pattern, text) if len(re.sub(r'\D', '', p)) >= 10]
    phone = phones[0] if phones else ""

    # Extract LinkedIn
    linkedin_matches = re.findall(r'(?:https?://)?(?:www\.)?(linkedin\.com/(?:in/)?[\w-]+)', text, re.IGNORECASE)
    linkedin = linkedin_matches[0] if linkedin_matches else ""
    if linkedin and not linkedin.startswith("http"):
        linkedin = f"linkedin.com/{linkedin.split('linkedin.com/')[-1]}"

    # Extract GitHub
    github_matches = re.findall(r'(?:https?://)?(?:www\.)?(github\.com/[\w-]+)', text, re.IGNORECASE)
    github = github_matches[0] if github_matches else ""
    if github and not github.startswith("http"):
        github = f"github.com/{github.split('github.com/')[-1]}"

    # Candidate Name heuristic
    candidate_name = ""
    header_blacklist = {"resume", "curriculum", "vitae", "cv", "profile", "summary", "contact", "experience", "education", "skills"}
    for line in lines[:5]:
        cleaned_line = re.sub(r'[^a-zA-Z\s]', '', line).strip()
        words = cleaned_line.split()
        if 1 <= len(words) <= 4 and "@" not in line and not re.search(r'\d', line):
            if not any(w.lower() in header_blacklist for w in words):
                candidate_name = line
                break

    if not candidate_name and lines:
        candidate_name = lines[0] if len(lines[0]) < 40 else "Candidate Name"

    # Assemble contact elements
    contact_parts = []
    if email:
        contact_parts.append(email)
    if phone:
        contact_parts.append(phone)

    # Search for City, State / Country location in the top 5 lines
    for line in lines[:5]:
        loc_match = re.search(r'([A-Za-z\s]+,\s*[A-Z]{2}(?:\s*\d{5})?|[A-Za-z\s]+,\s*[A-Za-z]+)', line)
        if loc_match:
            cand_loc = loc_match.group(1).strip()
            if cand_loc != candidate_name and "@" not in cand_loc and "linkedin" not in cand_loc.lower() and "github" not in cand_loc.lower():
                if cand_loc not in contact_parts:
                    contact_parts.append(cand_loc)
            break

    if linkedin and linkedin not in contact_parts:
        contact_parts.append(linkedin)
    if github and github not in contact_parts:
        contact_parts.append(github)

    # Fallback to literal 2nd line if it has typical contact separator '|'
    if not contact_parts and len(lines) > 1:
        second_line = lines[1]
        if any(c in second_line for c in ["@", "|", ".com", "(", "+"]):
            formatted_contact = second_line
        else:
            formatted_contact = ""
    else:
        formatted_contact = " | ".join(contact_parts)

    return {
        "candidate_name": candidate_name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "formatted_contact": formatted_contact
    }

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF using pdfplumber with fallback to pypdf."""
    extracted_text = []
    
    # Attempt with pdfplumber first
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                # Extract text with tolerance for tighter column/line formatting
                page_text = page.extract_text(x_tolerance=2, y_tolerance=2)
                if not page_text:
                    page_text = page.extract_text()
                if page_text:
                    extracted_text.append(page_text)
        if extracted_text:
            return clean_text("\n\n".join(extracted_text))
    except Exception as e:
        # Fallback to pypdf
        pass

    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted_text.append(t)
        return clean_text("\n\n".join(extracted_text))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to extract text from PDF: {str(e)}"
        )

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX using python-docx."""
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        
        # Also extract table text if present
        table_texts = []
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                if row_text:
                    table_texts.append(row_text)
                    
        combined = "\n".join(paragraphs)
        if table_texts:
            combined += "\n\n" + "\n".join(table_texts)
            
        return clean_text(combined)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to extract text from DOCX: {str(e)}"
        )

async def extract_text_from_file(file: UploadFile) -> Tuple[str, dict]:
    """
    Validates uploaded file and extracts text based on extension and content type.
    Returns: (extracted_text, metadata_dict)
    """
    filename = file.filename or "unknown_file"
    file_ext = filename.lower().split(".")[-1] if "." in filename else ""
    
    # Read content
    contents = await file.read()
    file_size_bytes = len(contents)
    file_size_kb = round(file_size_bytes / 1024, 2)
    
    if file_size_bytes == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")
        
    MAX_SIZE = 10 * 1024 * 1024 # 10MB
    if file_size_bytes > MAX_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"File exceeds maximum allowed size of 10MB (Uploaded: {file_size_kb} KB)."
        )

    extracted_text = ""
    if file_ext == "pdf" or file.content_type == "application/pdf":
        extracted_text = extract_text_from_pdf(contents)
    elif file_ext in ["docx", "doc"] or file.content_type in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ]:
        extracted_text = extract_text_from_docx(contents)
    elif file_ext in ["txt", "md"] or file.content_type == "text/plain":
        extracted_text = clean_text(contents.decode("utf-8", errors="replace"))
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file_ext}'. Please upload a PDF or DOCX file."
        )

    if not extracted_text or len(extracted_text.strip()) < 30:
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from the file. Ensure the PDF/DOCX is not password-protected or scanned image-only."
        )

    metadata = {
        "filename": filename,
        "extension": file_ext,
        "size_kb": file_size_kb,
        "char_count": len(extracted_text),
        "word_count": len(extracted_text.split())
    }
    
    return extracted_text, metadata
