import os
from typing import List, Dict
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.state import AgentState


class ParsedExperience(BaseModel):
    company: str = Field(description="Name of the company or organization")
    role: str = Field(description="Job title")
    dates: str = Field(description="Employment date range")
    bullets: List[str] = Field(description="Bullet points describing achievements")


class ParsedEducation(BaseModel):
    institution: str = Field(description="School or university name")
    degree: str = Field(description="Degree or certificate title")
    dates: str = Field(description="Graduation date or date range")


class ParsedResumeSchema(BaseModel):
    basics: Dict[str, str] = Field(description="Candidate basics: name, email, phone, location, links")
    skills: List[str] = Field(description="Extracted hard and soft skills")
    experience: List[ParsedExperience] = Field(description="List of work experience entries")
    education: List[ParsedEducation] = Field(description="List of education entries")


class IngestOutputSchema(BaseModel):
    parsed_resume: ParsedResumeSchema
    target_domain: str = Field(description="Domain classification: e.g. Software Engineering, Data Science, Product")


def ingest_agent_node(state: AgentState) -> dict:
    """Parses raw text resume and JD into structured JSON data using Gemini."""
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", temperature=0)
    structured_llm = llm.with_structured_output(IngestOutputSchema)

    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/ingest_prompt.txt")
    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "RAW RESUME:\n{raw_resume}\n\nTARGET JOB DESCRIPTION:\n{job_description}")
    ])

    chain = prompt | structured_llm
    result: IngestOutputSchema = chain.invoke({
        "raw_resume": state.get("raw_resume", ""),
        "job_description": state.get("job_description", "")
    })

    return {
        "parsed_resume": result.parsed_resume.model_dump(),
        "target_domain": result.target_domain,
        "logs": ["Ingestion Agent (Gemini): Parsed resume and categorized target domain."]
    }