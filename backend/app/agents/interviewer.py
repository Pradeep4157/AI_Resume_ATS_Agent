from app.state import AgentState

def interviewer_hitl_node(state: AgentState) -> dict:
    """
    Human-in-the-Loop node.
    
    When execution resumes after user input, this node checks if a response 
    was recorded for the current question index and advances the index counter.
    """
    idx = state.get("current_question_index", 0)
    questions = state.get("gap_questions", [])

    if idx < len(questions):
        current_q = questions[idx]
        user_resp = current_q.get("user_response")
        
        log_msg = f"Interviewer Node: Recorded answer for question '{current_q.get('id')}': {user_resp}"
        
        # Advance index to evaluate the next question in conditional routing
        return {
            "current_question_index": idx + 1,
            "logs": [log_msg]
        }

    return {"logs": ["Interviewer Node: All gap questions completed."]}