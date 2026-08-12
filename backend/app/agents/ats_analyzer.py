import os
from typing import List
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.state import AgentState


class WeakBulletSchema(BaseModel):
    experience_id: str = Field(description="Company or role context for the bullet")
    original_text: str = Field(description="The weak resume bullet point text")
    reason: str = Field(description="Why this bullet is weak or lacks impact/keywords")


class ATSOutputSchema(BaseModel):
    ats_score: int = Field(description="Overall ATS compatibility match score (0 to 100)")
    missing_keywords: List[str] = Field(description="High-priority hard skills missing from resume")
    weak_bullets: List[WeakBulletSchema] = Field(description="Up to 5 weak bullet points to optimize")


def ats_analyzer_node(state: AgentState) -> dict:
    """Evaluates keyword match percentage and flags weak bullet points using Gemini."""
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", temperature=0)
    structured_llm = llm.with_structured_output(ATSOutputSchema)

    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/ats_prompt.txt")
    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "PARSED RESUME JSON:\n{parsed_resume}\n\nJOB DESCRIPTION:\n{job_description}")
    ])

    chain = prompt | structured_llm
    result: ATSOutputSchema = chain.invoke({
        "parsed_resume": state.get("parsed_resume"),
        "job_description": state.get("job_description", "")
    })

    return {
        "ats_score": result.ats_score,
        "missing_keywords": result.missing_keywords,
        "weak_bullets": [wb.model_dump() for wb in result.weak_bullets],
        "logs": [f"ATS Analyzer Agent (Gemini): Evaluated profile with score {result.ats_score}%."]
    }