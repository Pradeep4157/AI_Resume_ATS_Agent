from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional


# Import parser utility and updated agent logic
from parser import extract_text_from_file
from agent import parse_and_normalize_resume, NormalizedResume
import io
import pdfplumber

app = FastAPI(title="ResuMax AI Engine")
@app.post("/api/analyze")
async def analyze_resume(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    jd_text: str = Form(...),
):
    text_to_parse = ""

    if resume_file:
        text_to_parse = await extract_text_from_file(resume_file)
    elif resume_text:
        text_to_parse = resume_text
    else:
        raise HTTPException(
            status_code=400, detail="Please provide a resume file or text."
        )

    # Extract structured resume using Gemini
    parsed_resume = parse_and_normalize_resume(text_to_parse)

    return {
        "status": "success",
        "parsed_resume": parsed_resume,
        "jd_text": jd_text,
    }

def extract_pdf_content(file_bytes: bytes) -> str:
    """Extracts raw text and embedded hyperlinked URLs from PDF bytes."""
    extracted_pages = []

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""

            # Extract embedded PDF links/annotations
            links = []
            if hasattr(page, "hyperlinks") and page.hyperlinks:
                for link in page.hyperlinks:
                    uri = link.get("uri")
                    if uri:
                        # Optional: extract text inside the link's bounding box if available
                        links.append(f"[Embedded Link: {uri}]")

            # Combine page text with discovered hyperlinks
            if links:
                links_str = "\n".join(links)
                page_text += f"\n\n--- Discovered Links on Page ---\n{links_str}"

            extracted_pages.append(page_text)

    return "\n\n".join(extracted_pages)


# CORS Settings
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



@app.get("/")
def health_check():
    return {"status": "ok", "message": "ResuMax Backend Engine running"}

@app.post("/api/parse-test")
async def parse_test(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
):
    text_to_parse = ""

    # Case 1: User pasted raw text
    if resume_text and resume_text.strip():
        text_to_parse = resume_text

    # Case 2: User uploaded a file
    elif resume_file:
        content_bytes = await resume_file.read()
        filename = resume_file.filename.lower() if resume_file.filename else ""

        if filename.endswith(".pdf"):
            # Extract PDF text + embedded URLs
            text_to_parse = extract_pdf_content(content_bytes)

        elif filename.endswith(".txt"):
            text_to_parse = content_bytes.decode("utf-8", errors="ignore")

        elif filename.endswith(".docx"):
            # (Use python-docx for docx handling if needed)
            pass
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")

    else:
        raise HTTPException(
            status_code=400, detail="No file or text was provided."
        )

    # Pass the text with extracted URLs directly into your Gemini parser!
    normalized_data = parse_and_normalize_resume(text_to_parse)
    return normalized_data