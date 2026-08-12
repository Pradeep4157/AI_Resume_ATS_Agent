import asyncio
import json
import uuid
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.graph import app_graph

app = FastAPI(title="ATS Resume Maxxer API")

# Enable CORS for Next.js frontend running on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class StartRequest(BaseModel):
    raw_resume: str
    job_description: str

class AnswerRequest(BaseModel):
    thread_id: str
    question_id: str
    user_response: str


@app.post("/api/start")
async def start_workflow(req: StartRequest):
    """Starts a new agent session thread with user inputs."""
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    
    initial_state = {
        "raw_resume": req.raw_resume,
        "job_description": req.job_description,
        "current_question_index": 0,
        "gap_questions": [],
        "logs": ["Workflow initialized."]
    }
    
    # Run the graph until it reaches the 'interviewer' interrupt or finishes
    app_graph.invoke(initial_state, config=config)
    
    # Fetch current snapshot
    snapshot = app_graph.get_state(config)
    
    return {
        "thread_id": thread_id,
        "state": snapshot.values,
        "next_step": snapshot.next
    }


@app.post("/api/respond")
async def record_user_response(req: AnswerRequest):
    """Updates state with human answer and resumes graph execution."""
    config = {"configurable": {"thread_id": req.thread_id}}
    snapshot = app_graph.get_state(config)
    
    if not snapshot.values:
        raise HTTPException(status_code=404, detail="Session not found")

    # Update state with the user's response
    gap_questions = snapshot.values.get("gap_questions", [])
    curr_idx = snapshot.values.get("current_question_index", 0)

    if curr_idx < len(gap_questions):
        gap_questions[curr_idx]["user_response"] = req.user_response

    # Update state in memory checkpoint
    app_graph.update_state(config, {"gap_questions": gap_questions})

    # Resume graph execution (None advances past the interrupt)
    app_graph.invoke(None, config=config)

    new_snapshot = app_graph.get_state(config)
    
    return {
        "status": "success",
        "state": new_snapshot.values,
        "next_step": new_snapshot.next
    }


@app.get("/api/stream/{thread_id}")
async def stream_agent_updates(thread_id: str):
    """Server-Sent Events (SSE) endpoint to stream state updates live to frontend."""
    config = {"configurable": {"thread_id": thread_id}}

    async def event_generator():
        while True:
            snapshot = app_graph.get_state(config)
            if snapshot and snapshot.values:
                # Send current state as SSE event payload
                payload = {
                    "values": snapshot.values,
                    "next": list(snapshot.next) if snapshot.next else []
                }
                yield f"data: {json.dumps(payload)}\n\n"

            # End stream if graph execution reached the END node
            if snapshot and not snapshot.next:
                yield f"data: {json.dumps({'status': 'COMPLETE'})}\n\n"
                break
                
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")