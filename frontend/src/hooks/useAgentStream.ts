import { useState, useEffect } from "react";
import type {
  AgentState,
  ResumeData,
  ExperienceItem,
  ProjectItem,
  AchievementItem,
  GapAnswerInput,
  GapPlacement,
  ReformattedText,
  PolishedBullets,
} from "../types/resume";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "resumax_agent_state";

function loadPersistedState(): AgentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistState(state: AgentState | null) {
  try {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage can throw in private-browsing/quota-exceeded cases — fail silently, app still works, just no persistence
  }
}



// Helper: generate the next sequential id for a section, e.g. "proj_3"
function nextId(prefix: string, items: { id: string }[]): string {
  return `${prefix}_${items.length + 1}`;
}




export function useAgentStream() {
  const [state, setState] = useState<AgentState | null>(() => loadPersistedState());
  useEffect(() => {
    persistState(state);
  }, [state]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const resetSession = () => {
    setState(null);
    setIsProcessing(false);
    setIsComplete(false);
    persistState(null);
  };

  const exportPdf = async (template: string = "jake") => {
    if (!state?.parsed_resume) return;

    const resumeToExport = state.optimized_resume || state.parsed_resume;

    try {
      const res = await fetch(`${API_BASE_URL}/api/export-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeToExport, template }),
      });

      if (!res.ok) {
        throw new Error("Failed to export PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeToExport.basics?.name?.replace(/\s+/g, "_") || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("PDF export failed:", err);
      setState((prev) =>
        prev ? { ...prev, logs: [...(prev.logs || []), `PDF export error: ${err.message}`] } : prev
      );
    }
  };

  // Step 1: Send Resume & JD to /api/analyze
  const startAnalysis = async (resumeInput: string | File, targetJd: string) => {
    setState(null);          // clear any stale/previous session immediately
    persistState(null);      // and wipe it from localStorage too, so a mid-load refresh doesn't resurrect old data
    setIsProcessing(true);
    setIsComplete(false);
    setIsProcessing(true);
    setIsComplete(false);

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

  // Live "Reformat using AI" — rewrites tone, returns editable text for the textarea
  const reformatAnswer = async (answerInput: GapAnswerInput): Promise<string> => {
    const res = await fetch(`${API_BASE_URL}/api/reformat-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer_input: answerInput }),
    });

    if (!res.ok) {
      throw new Error("Failed to reformat answer");
    }

    const data: ReformattedText = await res.json();
    return data.text;
  };

  // Submit-time — always runs, normalizes final text into clean bullets
  const normalizeAnswer = async (text: string): Promise<string[]> => {
    const res = await fetch(`${API_BASE_URL}/api/normalize-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Failed to normalize answer");
    }

    const data: PolishedBullets = await res.json();
    return data.bullets;
  };

  // Patch parsed_resume locally with a new item, given the placement + final bullets
  const patchResume = (
    resume: ResumeData,
    placement: GapPlacement,
    answerInput: GapAnswerInput,
    bullets: string[]
  ): ResumeData => {
    if (placement === "project" && answerInput.category === "project") {
      const newProject: ProjectItem = {
        id: nextId("proj", resume.projects),
        name: answerInput.name,
        tech_stack: answerInput.tech_stack,
        link: answerInput.link?.trim() || "",
        bullets,
      };
      return { ...resume, projects: [...resume.projects, newProject] };
    }

    if (placement === "experience" && answerInput.category === "experience") {
      const newExperience: ExperienceItem = {
        id: nextId("exp", resume.experience),
        role: answerInput.role,
        company: answerInput.company,
        dates: answerInput.dates?.trim() || "",
        location: answerInput.location?.trim() || "",
        bullets,
      };
      return { ...resume, experience: [...resume.experience, newExperience] };
    }

    if (placement === "achievement" && answerInput.category === "achievement") {
      const newAchievement: AchievementItem = {
        id: nextId("ach", resume.achievements),
        title: bullets[0] || answerInput.description,
        category: answerInput.achievement_category?.trim() || "Other",
        dates: answerInput.dates?.trim() || "",
        details: bullets,
      };
      return { ...resume, achievements: [...resume.achievements, newAchievement] };
    }

    // Placement/category mismatch — return resume unchanged rather than guessing.
    return resume;
  };

  // Step 2: Handle one gap-question answer at a time
  const sendResponse = async (
    gapId: string,
    placement: GapPlacement,
    answerInput: GapAnswerInput | null
  ) => {
    if (!state) return;

    const questions = state.gap_questions || [];
    const currIndex = state.current_question_index || 0;
    const nextIdx = currIndex + 1;

    // User said "I haven't worked on this" — skip, no resume mutation.
    if (placement === "none" || !answerInput) {
      setState({
        ...state,
        current_question_index: nextIdx,
        logs: [...(state.logs || []), `Gap "${gapId}" skipped — no relevant experience.`],
      });
      if (nextIdx >= questions.length) setIsComplete(true);
      return;
    }

    if (!state.parsed_resume) return;

    setIsProcessing(true);
    try {
      const bullets = await normalizeAnswer(answerInput.description);
      const updatedResume = patchResume(state.parsed_resume, placement, answerInput, bullets);

      setState((prev) =>
        prev
          ? {
              ...prev,
              parsed_resume: updatedResume,
              current_question_index: nextIdx,
              logs: [...(prev.logs || []), `Gap "${gapId}" resolved — added to ${placement}.`],
            }
          : prev
      );

      if (nextIdx >= questions.length) {
        setIsComplete(true);
      }
    } catch (err: any) {
      console.error("Failed to process gap answer:", err);
      setState((prev) =>
        prev
          ? { ...prev, logs: [...(prev.logs || []), `Error resolving gap "${gapId}": ${err.message}`] }
          : prev
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    state,
    isProcessing,
    isComplete,
    startAnalysis,
    sendResponse,
    reformatAnswer,
    exportPdf,
    resetSession,
  };
}