from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

# 1. Import state definition
from app.state import AgentState

# 2. Import node functions from individual agent modules
from app.agents.ingest import ingest_agent_node
from app.agents.ats_analyzer import ats_analyzer_node
from app.agents.domain_specialist import domain_specialist_node
from app.agents.interviewer import interviewer_hitl_node
from app.agents.synthesis import synthesis_agent_node

# 3. Initialize Graph Builder with AgentState
builder = StateGraph(AgentState)

# 4. Add Nodes to the Graph
builder.add_node("ingest", ingest_agent_node)
builder.add_node("ats_analyze", ats_analyzer_node)
builder.add_node("domain_specialist", domain_specialist_node)
builder.add_node("interviewer", interviewer_hitl_node)
builder.add_node("synthesis", synthesis_agent_node)

# 5. Define Flow Edges
builder.set_entry_point("ingest")
builder.add_edge("ingest", "ats_analyze")
builder.add_edge("ats_analyze", "domain_specialist")
builder.add_edge("domain_specialist", "interviewer")

# 6. Conditional Edge to route based on pending interview questions
def check_questions_remaining(state: AgentState) -> str:
    """
    Checks if there are still gap questions left to ask the candidate.
    Routes back to 'interviewer' if questions remain, otherwise moves to 'synthesis'.
    """
    idx = state.get("current_question_index", 0)
    questions = state.get("gap_questions", [])
    
    if idx < len(questions):
        return "interviewer"
    return "synthesis"

builder.add_conditional_edges(
    "interviewer",
    check_questions_remaining,
    {
        "interviewer": "interviewer",
        "synthesis": "synthesis"
    }
)

builder.add_edge("synthesis", END)

# 7. Add Checkpointer for State Persistence & Human-in-the-Loop Interrupts
memory = MemorySaver()

# 8. Compile the Graph
# Graph pauses BEFORE executing 'interviewer' so frontend can collect user response
app_graph = builder.compile(
    checkpointer=memory,
    interrupt_before=["interviewer"]
)