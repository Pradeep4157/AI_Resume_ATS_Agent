from typing import TypedDict, List, Optional, Dict, Annotated
import operator

class ResumeData(TypedDict):
    basics: Dict[str, str]
    skills: List[str]
    experience: List[Dict[str, str]] # company, role, dates, bullets
    education: List[Dict[str, str]]

class GapQuestion(TypedDict):
    id: str
    missing_skill: str
    question: str
    user_response: Optional[str]

class AgentState(TypedDict):
    # Inputs
    raw_resume: str
    job_description: str
    
    # Processed Data
    parsed_resume: ResumeData
    target_domain: str # e.g., "Software Engineering", "Data Science"
    
    # Analysis & ATS Metrics
    ats_score: int
    missing_keywords: List[str]
    weak_bullets: List[Dict[str, str]] # original bullet, issue, target_section
    
    # Human-in-the-Loop (HITL) State
    gap_questions: List[GapQuestion]
    current_question_index: int
    
    # Final Output
    optimized_resume: ResumeData
    logs: Annotated[List[str], operator.add] # Append-only event log