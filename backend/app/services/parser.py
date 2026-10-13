import io
import re
from typing import Tuple
from fastapi import UploadFile, HTTPException

def clean_text(text: str) -> str:
    """Normalize extracted text whitespace and linebreaks."""
    if not text:
        return ""
    # Replace multiple empty lines with maximum 2
    text = re.sub(r'\r\n', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove null or strange non-printable characters
    text = "".join(char for char in text if char.isprintable() or char in "\n\t\r")
    return text.strip()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF using pdfplumber with fallback to pypdf."""
    extracted_text = []
    
    # Attempt with pdfplumber first
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
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
