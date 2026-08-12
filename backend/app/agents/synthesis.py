import os
from typing import List, Dict
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.state import AgentState


class UpdatedExperience(BaseModel):
    company: str
    role: str
    dates: str
    bullets: List[str] = Field(description="Optimized experience bullets using Google XYZ format")


class UpdatedEducation(BaseModel):
    institution: str
    degree: str
    dates: str


class OptimizedResumeSchema(BaseModel):
    basics: Dict[str, str]
    skills: List[str] = Field(description="Updated skills list including verified missing keywords")
    experience: List[UpdatedExperience]
    education: List[UpdatedEducation]


class SynthesisOutputSchema(BaseModel):
    optimized_resume: OptimizedResumeSchema


def synthesis_agent_node(state: AgentState) -> dict:
    """Synthesizes candidate responses and emits optimized resume JSON using Gemini."""
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", temperature=0.2)
    structured_llm = llm.with_structured_output(SynthesisOutputSchema)

    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/synthesis_prompt.txt")
    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "PARSED RESUME:\n{parsed_resume}\n\nMISSING KEYWORDS:\n{missing_keywords}\n\nUSER GAP RESPONSES:\n{gap_questions}")
    ])

    chain = prompt | structured_llm
    result: SynthesisOutputSchema = chain.invoke({
        "parsed_resume": state.get("parsed_resume"),
        "missing_keywords": state.get("missing_keywords", []),
        "gap_questions": state.get("gap_questions", [])
    })

    return {
        "optimized_resume": result.optimized_resume.model_dump(),
        "logs": ["Synthesis Agent (Gemini): Built final optimized resume state."]
    }