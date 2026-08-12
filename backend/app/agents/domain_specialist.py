import os
from typing import List
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.state import AgentState


class GapQuestionSchema(BaseModel):
    id: str = Field(description="Unique question ID (e.g. q1, q2)")
    missing_skill: str = Field(description="Skill or tool being queried")
    question: str = Field(description="Conversational interview question for the candidate")


class DomainSpecialistOutputSchema(BaseModel):
    gap_questions: List[GapQuestionSchema] = Field(description="Targeted interview questions to discover hidden experience")


def domain_specialist_node(state: AgentState) -> dict:
    """Generates domain-specific interview questions using Gemini."""
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", temperature=0)
    structured_llm = llm.with_structured_output(DomainSpecialistOutputSchema)

    prompt_path = os.path.join(os.path.dirname(__file__), "../prompts/domain_prompt.txt")
    with open(prompt_path, "r") as f:
        system_prompt = f.read()

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "DOMAIN: {target_domain}\nMISSING KEYWORDS: {missing_keywords}\nWEAK BULLETS: {weak_bullets}")
    ])

    chain = prompt | structured_llm
    result: DomainSpecialistOutputSchema = chain.invoke({
        "target_domain": state.get("target_domain", "General"),
        "missing_keywords": state.get("missing_keywords", []),
        "weak_bullets": state.get("weak_bullets", [])
    })

    formatted_questions = [
        {**q.model_dump(), "user_response": None} for q in result.gap_questions
    ]

    return {
        "gap_questions": formatted_questions,
        "current_question_index": 0,
        "logs": [f"Domain Specialist Agent (Gemini): Formulated {len(formatted_questions)} gap-discovery questions."]
    }