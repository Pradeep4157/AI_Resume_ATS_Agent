import io
from fastapi import UploadFile, HTTPException
from pypdf import PdfReader
from docx import Document
import io
import pdfplumber
from docx import Document
from fastapi import HTTPException, UploadFile


async def extract_text_from_file(file: UploadFile) -> str:
    filename = file.filename.lower()
    content = await file.read()

    if filename.endswith(".pdf"):
        try:
            extracted_pages = []
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text() or ""

                    # Extract embedded PDF links/annotations
                    links = []
                    if hasattr(page, "hyperlinks") and page.hyperlinks:
                        for link in page.hyperlinks:
                            uri = link.get("uri")
                            if uri:
                                links.append(f"[Link: {uri}]")

                    if links:
                        page_text += (
                            f"\n\n--- Discovered Links ---\n"
                            + "\n".join(links)
                        )

                    extracted_pages.append(page_text)

            return "\n\n".join(extracted_pages).strip()
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Failed to parse PDF: {str(e)}"
            )

    elif filename.endswith(".docx"):
        try:
            doc = Document(io.BytesIO(content))
            text = "\n".join([p.text for p in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Failed to parse DOCX: {str(e)}"
            )

    elif filename.endswith(".txt") or filename.endswith(".md"):
        # Fixed utf-8 encoding typo here
        return content.decode("utf-8", errors="ignore").strip()

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Upload PDF, DOCX, or TXT.",
        )