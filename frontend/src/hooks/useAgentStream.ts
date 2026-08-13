import { useState } from "react";
import type { AgentState, ResumeData } from "../types/resume";

const API_BASE_URL = "http://localhost:8000";

export function useAgentStream() {
  const [state, setState] = useState<AgentState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [jdText, setJdText] = useState("");

  // Step 1: Send Resume & JD to /api/analyze
  const startAnalysis = async (resumeInput: string | File, targetJd: string) => {
    setIsProcessing(true);
    setIsComplete(false);
    setUserAnswers({});
    setJdText(targetJd);

    const formData = new FormData();
    formData.append("jd_text", targetJd);

    if (resumeInput instanceof File) {
      formData.append("resume_file", resumeInput);
    } else {
      formData.append("resume_text", resumeInput);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const data = await res.json();

      setState({
        ats_score: data.ats_score,
        target_domain: data.target_domain,
        missing_keywords: data.missing_keywords,
        parsed_resume: data.parsed_resume,
        gap_questions: data.gap_questions || [],
        current_question_index: 0,
        logs: [
          "Resume & Job Description ingested successfully.",
          `Calculated initial ATS Match: ${data.ats_score}%`,
          `Identified ${data.gap_questions?.length || 0} optimization opportunities.`,
        ],
      });
    } catch (err: any) {
      console.error("Failed to analyze resume:", err);
      setState((prev) => ({
        ...prev,
        logs: [...(prev?.logs || []), `Error: ${err.message}`],
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Handle user responses to gap questions
  const sendResponse = async (questionId: string, answerText: string) => {
    if (!state) return;

    const updatedAnswers = { ...userAnswers, [questionId]: answerText };
    setUserAnswers(updatedAnswers);

    const nextIdx = (state.current_question_index || 0) + 1;
    const questions = state.gap_questions || [];

    if (nextIdx < questions.length) {
      // Advance to next question
      setState({
        ...state,
        current_question_index: nextIdx,
        logs: [
          ...(state.logs || []),
          `Answer logged for question ${nextIdx}.`,
        ],
      });
    } else {
      // All questions answered -> Trigger synthesis
      setIsProcessing(true);
      setState({
        ...state,
        current_question_index: nextIdx,
        logs: [...(state.logs || []), "All questions answered. Synthesizing final resume..."],
      });

      try {
        const res = await fetch(`${API_BASE_URL}/api/synthesize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parsed_resume: state.parsed_resume,
            jd_text: jdText,
            user_answers: updatedAnswers,
          }),
        });

        if (!res.ok) throw new Error("Synthesis failed");

        const data = await res.json();

        setState((prev) =>
          prev
            ? {
                ...prev,
                optimized_resume: data.optimized_resume,
                logs: [...(prev.logs || []), "Final ATS-optimized resume generated successfully!"],
              }
            : null
        );
        setIsComplete(true);
      } catch (err: any) {
        console.error("Synthesis error:", err);
        setState((prev) =>
          prev
            ? {
                ...prev,
                logs: [...(prev.logs || []), `Synthesis error: ${err.message}`],
              }
            : null
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return {
    state,
    isProcessing,
    isComplete,
    startAnalysis,
    sendResponse,
  };
}