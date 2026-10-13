import io
from typing import Optional
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_docx_bytes(markdown_text: str, candidate_name: Optional[str] = "Resume") -> bytes:
    """Converts tailored resume markdown into an ATS-friendly, styled DOCX file."""
    doc = docx.Document()
    
    # Page Margins (0.75 in for standard ATS resume layout)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.6)
        section.bottom_margin = Inches(0.6)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)
        
    lines = markdown_text.split("\n")
    
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            doc.add_paragraph("")
            continue
            
        # H1 Title / Candidate Name
        if line.startswith("# "):
            p = doc.add_paragraph()
            run = p.add_run(line[2:])
            run.font.size = Pt(20)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(6)
            
        # H2 Section Header
        elif line.startswith("## "):
            p = doc.add_paragraph()
            run = p.add_run(line[3:])
            run.font.size = Pt(13)
            run.font.bold = True
            run.font.color.rgb = RGBColor(14, 116, 144) # Teal / Slate
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            
        # H3 Job Role / Subheader
        elif line.startswith("### "):
            p = doc.add_paragraph()
            run = p.add_run(line[4:])
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(51, 65, 85)
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(1)
            
        # Bullet Points
        elif line.startswith("- ") or line.startswith("* "):
            p = doc.add_paragraph(style='List Bullet')
            # Check for bold tags like **keyword**
            bullet_content = line[2:]
            parts = bullet_content.split("**")
            for i, part in enumerate(parts):
                if not part:
                    continue
                r = p.add_run(part)
                r.font.size = Pt(10)
                if i % 2 == 1: # Odd index was inside **bold**
                    r.font.bold = True
            p.paragraph_format.space_after = Pt(2)
            
        # Regular or italicized text
        else:
            p = doc.add_paragraph()
            clean_line = line.replace("*", "")
            r = p.add_run(clean_line)
            r.font.size = Pt(10)
            if line.startswith("*") and line.endswith("*"):
                r.font.italic = True
            p.paragraph_format.space_after = Pt(2)

    target_stream = io.BytesIO()
    doc.save(target_stream)
    return target_stream.getvalue()

def generate_pdf_bytes(markdown_text: str, candidate_name: Optional[str] = "Resume") -> bytes:
    """Converts tailored resume markdown into an ATS-friendly, clean PDF using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        fontName='Helvetica-Bold',
        spaceAfter=4
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Normal'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0369a1'),
        fontName='Helvetica-Bold',
        spaceBefore=10,
        spaceAfter=4,
        textTransform='uppercase'
    )
    
    h3_style = ParagraphStyle(
        'DocH3',
        parent=styles['Normal'],
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#1e293b'),
        fontName='Helvetica-Bold',
        spaceBefore=4,
        spaceAfter=2
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=3
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        leftIndent=15,
        textColor=colors.HexColor('#334155'),
        spaceAfter=2
    )

    story = []
    lines = markdown_text.split("\n")
    
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            story.append(Spacer(1, 3))
            continue
            
        # Clean markdown bold for reportlab tags
        formatted = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        formatted = formatted.replace("**", "<b>", 1)
        while "**" in formatted:
            formatted = formatted.replace("**", "</b>", 1)
            
        if line.startswith("# "):
            story.append(Paragraph(formatted[2:], title_style))
            story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceAfter=6))
        elif line.startswith("## "):
            story.append(Paragraph(formatted[3:], h2_style))
        elif line.startswith("### "):
            story.append(Paragraph(formatted[4:], h3_style))
        elif line.startswith("- ") or line.startswith("* "):
            story.append(Paragraph(f"&bull; {formatted[2:]}", bullet_style))
        else:
            story.append(Paragraph(formatted, body_style))

    doc.build(story)
    return buffer.getvalue()
