import os
import json
from typing import List, Optional
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Initialize Gemini Client
client = genai.Client()

# ==========================================
# 1. STANDARDIZED RESUME JSON SCHEMAS
# ==========================================

class Basics(BaseModel):
    name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    links: Optional[str] = ""

class ExperienceItem(BaseModel):
    id: str = Field(description="Unique ID e.g. exp_1, exp_2")
    company: str
    role: str
    dates: str
    location: Optional[str] = ""
    bullets: List[str]

class ProjectItem(BaseModel):
    id: str = Field(description="Unique ID e.g. proj_1, proj_2")
    name: str
    tech_stack: List[str] = Field(
        default_factory=list, description="Array of tools/technologies used"
    )
    link: Optional[str] = Field(
        default="",
        description="The URL, GitHub link, live demo, or deployment link associated with the project. If no link is present, return an empty string.",
    )
    bullets: List[str] = Field(default_factory=list)

class GapQuestion(BaseModel):
    id: str                                  # e.g., "gap_1"
    missing_requirement: str                 # e.g., "Docker / Containerization"
    explanation: str                         # Why the JD needs this
    category: str                            # "technical_skill", "domain_responsibility", or "certification_achievement"

class AchievementItem(BaseModel):
    id: str = Field(description="Unique ID e.g. ach_1, ach_2")
    title: str
    category: str = Field(description="Category e.g. Research, Certification, Hackathon, Contest, Award")
    dates: Optional[str] = ""
    details: List[str]

class EducationItem(BaseModel):
    degree: str
    institution: str
    dates: str

class NormalizedResume(BaseModel):
    basics: Basics
    skills: List[str]
    experience: List[ExperienceItem]
    projects: List[ProjectItem]
    achievements: List[AchievementItem]
    education: List[EducationItem]


# ==========================================
# 2. PARSE & NORMALIZE FUNCTION
# ==========================================
def parse_and_normalize_resume(resume_text: str) -> NormalizedResume:
    prompt = f"""
    You are an expert ATS Document Parser. 
    Extract and structure all details from the provided raw resume text into our standardized JSON format.

    Raw Resume Text:
    {resume_text}

    Parsing Rules:
    1. Assign clean sequential IDs to items:
       - Work Experience: 'exp_1', 'exp_2', etc.
       - Projects: 'proj_1', 'proj_2', etc.
       - Achievements/Certs/Research: 'ach_1', 'ach_2', etc.
    2. Normalize technical skills into a clean array of individual tools/frameworks.
    3. Keep existing bullet points concise, metric-driven, and structured.
    4. If any section (e.g. projects, achievements) is missing from the resume, return an empty array [] for that field.
    5. When extracting projects, carefully check for hyperlinked text, URLs in parentheses,
       GitHub repo links (e.g., github.com/username/project), or demo links. Normalize links to include `https://` if missing.
       If no link exists for a project, return "" for that project's link field.
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",  # Or your active Gemini model
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=NormalizedResume,  # Pydantic automatically generates the schema!
            temperature=0.1,
        ),
    )

    return NormalizedResume.model_validate_json(response.text)