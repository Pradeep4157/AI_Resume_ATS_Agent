from dotenv import load_dotenv

load_dotenv()

import io
import os
from typing import Optional, Union

import json

import pdfplumber
from fastapi import Body, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel
from weasyprint import HTML

from parser import extract_text_from_file

from agent import (
    AchievementAnswerInput,
    ExperienceAnswerInput,
    NormalizeRequest,
    PolishedBullets,
    ProjectAnswerInput,
    ReformatRequest,
    ReformattedText,
    analyze_gaps,
    normalize_answer_text,
    parse_and_normalize_resume,
    polish_gap_answer,
    reformat_gap_answer,
)


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(title="ResuMax AI Engine")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Jinja2 / PDF configuration
# --------------------------------------------------

TEMPLATE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "templates",
)

jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR)
)


class ExportPdfRequest(BaseModel):
    resume: dict
    template: str = "jake"


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "ResuMax Backend Engine running",
    }


# --------------------------------------------------
# Export PDF
# --------------------------------------------------

@app.post("/api/export-pdf")
async def export_pdf(payload: ExportPdfRequest):
    template_file_map = {
        "jake": "jake_resume.html",
    }

    template_file = template_file_map.get(payload.template)

    if not template_file:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown template: {payload.template}",
        )

    template = jinja_env.get_template(template_file)

    html_content = template.render(**payload.resume)


    print("========== RESUME JSON ==========")
    print(json.dumps(payload.resume, indent=2, ensure_ascii=False))

    with open("debug_resume.json", "w", encoding="utf-8") as f:
        json.dump(payload.resume, f, indent=2, ensure_ascii=False)

    template = jinja_env.get_template(template_file)

    html_content = template.render(**payload.resume)

    with open("debug_resume.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    pdf_bytes = HTML(
        string=html_content
    ).write_pdf()

    filename = (
        f"{payload.resume.get('basics', {}).get('name', 'resume')}"
        .replace(" ", "_")
        + "_resume.pdf"
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )


# --------------------------------------------------
# Reformat answer
# --------------------------------------------------

@app.post(
    "/api/reformat-answer",
    response_model=ReformattedText,
)
async def reformat_answer(payload: ReformatRequest):
    return reformat_gap_answer(payload.answer_input)


# --------------------------------------------------
# Normalize answer
# --------------------------------------------------

@app.post(
    "/api/normalize-answer",
    response_model=PolishedBullets,
)
async def normalize_answer(payload: NormalizeRequest):
    return normalize_answer_text(payload.text)


# --------------------------------------------------
# Polish answer
# --------------------------------------------------

@app.post(
    "/api/polish-answer",
    response_model=PolishedBullets,
)
async def polish_answer(
    payload: Union[
        ProjectAnswerInput,
        ExperienceAnswerInput,
        AchievementAnswerInput,
    ] = Body(...),
):
    return polish_gap_answer(payload)


# --------------------------------------------------
# Analyze resume
# --------------------------------------------------

@app.post("/api/analyze")
async def analyze_resume(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    jd_text: str = Form(...),
):
    text_to_parse = ""

    if resume_file:
        text_to_parse = await extract_text_from_file(resume_file)

    elif resume_text and resume_text.strip():
        text_to_parse = resume_text

    else:
        raise HTTPException(
            status_code=400,
            detail="Please provide a resume file or text.",
        )

    parsed_resume = parse_and_normalize_resume(
        text_to_parse
    )

    gap_analysis = analyze_gaps(
        parsed_resume,
        jd_text,
    )

    return {
        "status": "success",
        "parsed_resume": parsed_resume,
        "jd_text": jd_text,
        "ats_score": gap_analysis.ats_score,
        "target_domain": gap_analysis.target_domain,
        "missing_keywords": gap_analysis.missing_keywords,
        "gap_questions": [
            q.model_dump()
            for q in gap_analysis.gap_questions
        ],
    }


# --------------------------------------------------
# PDF content extraction
# --------------------------------------------------

def extract_pdf_content(file_bytes: bytes) -> str:
    """
    Extract raw text and embedded hyperlinked URLs
    from PDF bytes.
    """

    extracted_pages = []

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:

            page_text = page.extract_text() or ""

            links = []

            if hasattr(page, "hyperlinks") and page.hyperlinks:
                for link in page.hyperlinks:
                    uri = link.get("uri")

                    if uri:
                        links.append(
                            f"[Embedded Link: {uri}]"
                        )

            if links:
                links_str = "\n".join(links)

                page_text += (
                    "\n\n"
                    "--- Discovered Links on Page ---\n"
                    f"{links_str}"
                )

            extracted_pages.append(page_text)

    return "\n\n".join(extracted_pages)


# --------------------------------------------------
# Parse test
# --------------------------------------------------

@app.post("/api/parse-test")
async def parse_test(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
):
    text_to_parse = ""

    # User pasted raw text
    if resume_text and resume_text.strip():

        text_to_parse = resume_text

    # User uploaded a file
    elif resume_file:

        content_bytes = await resume_file.read()

        filename = (
            resume_file.filename.lower()
            if resume_file.filename
            else ""
        )

        if filename.endswith(".pdf"):

            text_to_parse = extract_pdf_content(
                content_bytes
            )

        elif filename.endswith(".txt"):

            text_to_parse = content_bytes.decode(
                "utf-8",
                errors="ignore",
            )

        elif filename.endswith(".docx"):

            # TODO: Add DOCX extraction if required.
            raise HTTPException(
                status_code=400,
                detail="DOCX parsing is not implemented yet.",
            )

        else:

            raise HTTPException(
                status_code=400,
                detail="Unsupported file format.",
            )

    else:

        raise HTTPException(
            status_code=400,
            detail="No file or text was provided.",
        )

    normalized_data = parse_and_normalize_resume(
        text_to_parse
    )

    return normalized_data
