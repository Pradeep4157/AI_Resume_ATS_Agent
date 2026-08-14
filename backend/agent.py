import os
import json
from typing import List, Optional, Union
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Initialize Gemini Client
client = genai.Client()

# ==========================================
# 1. STANDARDIZED RESUME JSON SCHEMAS
# ==========================================

class GapQuestion(BaseModel):
    id: str                                  # e.g., "gap_1"
    missing_requirement: str                 # e.g., "Docker / Containerization"
    explanation: str                         # Why the JD needs this
    category: str                            # "technical_skill", "domain_responsibility", or "certification_achievement"

class ProjectAnswerInput(BaseModel):
    category: str = Field(default="project")
    name: str
    description: str
    tech_stack: List[str] = Field(default_factory=list)
    link: Optional[str] = ""

class ExperienceAnswerInput(BaseModel):
    category: str = Field(default="experience")
    role: str
    company: str
    description: str
    dates: Optional[str] = ""
    location: Optional[str] = ""

class AchievementAnswerInput(BaseModel):
    category: str = Field(default="achievement")
    description: str
    dates: Optional[str] = ""
    achievement_category: Optional[str] = "Other"

class PolishRequest(BaseModel):
    answer_input: Union[ProjectAnswerInput, ExperienceAnswerInput, AchievementAnswerInput]
    mode: str  # "rewrite" | "structure_only"

class PolishedText(BaseModel):
    text: str  # single block, for "rewrite" mode — goes back into the textarea

class PolishedBullets(BaseModel):
    bullets: List[str]  # array, for "structure_only" mode — used to build the resume item

class GapAnalysis(BaseModel):
    ats_score: int
    target_domain: str
    missing_keywords: List[str]
    gap_questions: List[GapQuestion]

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


class ReformatRequest(BaseModel):
    answer_input: Union[ProjectAnswerInput, ExperienceAnswerInput, AchievementAnswerInput]

class ReformattedText(BaseModel):
    text: str = Field(
        description="A single rewritten block of resume-appropriate prose, professional tone, "
                    "no bullet markers or numbering — just clean text the user can further edit."
    )


# ==========================================
# GAP ANSWER — NORMALIZE (structure only, preserve wording)
# ==========================================

class NormalizeRequest(BaseModel):
    text: str  # whatever is currently in the textarea at submit time

class PolishedBullets(BaseModel):
    bullets: List[str] = Field(
        description="The input text split into clean resume bullet points, with any leading "
                    "numbering or bullet markers removed. Wording must be preserved exactly as "
                    "given — do not rewrite, rephrase, or improve the text."
    )

def reformat_gap_answer(
    payload: Union[ProjectAnswerInput, ExperienceAnswerInput, AchievementAnswerInput]
) -> ReformattedText:
    if isinstance(payload, ProjectAnswerInput):
        context = f"""
        Project Name: {payload.name}
        Tech Stack: {", ".join(payload.tech_stack) if payload.tech_stack else "Not specified"}
        User's raw description: {payload.description}
        """
    elif isinstance(payload, ExperienceAnswerInput):
        context = f"""
        Role: {payload.role}
        Company: {payload.company}
        User's raw description: {payload.description}
        """
    else:
        context = f"""
        User's raw description of achievement: {payload.description}
        """

    prompt = f"""
    You are an expert resume writer. The user has given a raw, casual description
    of something they did. Rewrite it into professional, resume-appropriate prose.

    Rules:
    1. Use strong action verbs (Built, Led, Designed, Optimized, Implemented, etc.)
    2. Quantify impact where the user's description implies a number, scale, or result —
       do NOT invent metrics the user didn't mention or imply.
    3. Keep the writing concise.
    4. Do not add skills, tools, or claims the user did not mention.
    5. Return ONE continuous block of text. Do NOT add bullet markers, numbering,
       or line breaks — the user will structure it themselves afterward.

    Context:
    {context}
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ReformattedText,
            temperature=0.3,
        ),
    )

    return ReformattedText.model_validate_json(response.text)


def normalize_answer_text(raw_text: str) -> PolishedBullets:
    prompt = f"""
    You are a resume formatting utility. Convert the following text into a clean
    array of resume bullet points.

    Rules:
    1. Preserve the user's exact wording. Do NOT rewrite, rephrase, improve, or
       change the tone of the text in any way.
    2. If the text has numbered items (1. 2. 3. or 1) 2) 3) etc.), bullet markers
       (-, •, *), or clear line-separated points, split them into separate array items.
    3. Strip any leading numbers or bullet markers from each item — return clean text only.
    4. If the text is a single continuous thought with no clear separations, return it
       as a single-item array. Do not force a split that isn't there.
    5. Ignore incidental line wraps that don't represent intentional separate points.

    Text:
    {raw_text}
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PolishedBullets,
            temperature=0,
        ),
    )

    return PolishedBullets.model_validate_json(response.text)

def polish_gap_answer(
    payload: Union[ProjectAnswerInput, ExperienceAnswerInput, AchievementAnswerInput]
) -> PolishedBullets:
    if isinstance(payload, ProjectAnswerInput):
        context = f"""
        Project Name: {payload.name}
        Tech Stack: {", ".join(payload.tech_stack) if payload.tech_stack else "Not specified"}
        User's raw description: {payload.description}
        """
    elif isinstance(payload, ExperienceAnswerInput):
        context = f"""
        Role: {payload.role}
        Company: {payload.company}
        User's raw description: {payload.description}
        """
    else:
        context = f"""
        User's raw description of achievement: {payload.description}
        """

    prompt = f"""
    You are an expert resume writer. The user has given a raw, casual description
    of something they did. Rewrite it into 1-3 concise, professional, resume-style
    bullet points.

    Rules:
    1. Use strong action verbs (Built, Led, Designed, Optimized, Implemented, etc.)
    2. Quantify impact where the user's description implies a number, scale, or result —
       do NOT invent metrics the user didn't mention or imply.
    3. Keep each bullet under ~20 words.
    4. Do not add skills, tools, or claims the user did not mention.

    Context:
    {context}
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PolishedBullets,
            temperature=0.3,
        ),
    )

    return PolishedBullets.model_validate_json(response.text)

def analyze_gaps(parsed_resume: NormalizedResume, jd_text: str) -> GapAnalysis:
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) analyst and career coach.

    Compare the candidate's structured resume against the target job description below.
    Identify the target job domain, calculate an ATS match score (0-100),
    find important keywords from the JD missing in the resume, and generate
    a short list of clarifying questions to help fill experience gaps.

    Candidate Resume (structured):
    {parsed_resume.model_dump_json()}

    Target Job Description:
    {jd_text}

    Rules:
    1. ats_score: integer 0-100 estimating keyword/skill/experience match quality.
    2. target_domain: a short label for the role's field (e.g. "Product Management", "Backend Engineering").
    3. missing_keywords: important skills/tools/terms present in the JD but absent from the resume.
    4. gap_questions: 3-5 short, specific questions to ask the candidate to surface
       relevant experience not currently reflected in their resume. Assign sequential
       ids like 'q_1', 'q_2', etc.
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GapAnalysis,
            temperature=0.2,
        ),
    )

    return GapAnalysis.model_validate_json(response.text)
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