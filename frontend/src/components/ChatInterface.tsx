import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, CheckCircle2, ShieldCheck, Terminal, Wand2 } from "lucide-react";
import type { AgentState, GapPlacement, GapAnswerInput } from "../types/resume";

interface ChatInterfaceProps {
  state: AgentState | null;
  isProcessing: boolean;
  onSendResponse: (
    gapId: string,
    placement: GapPlacement,
    answerInput: GapAnswerInput | null
  ) => void;
  onReformat: (answerInput: GapAnswerInput) => Promise<string>;
}

const PLACEMENT_OPTIONS: { value: GapPlacement; label: string }[] = [
  { value: "experience", label: "Work Experience" },
  { value: "project", label: "Project" },
  { value: "achievement", label: "Achievement" },
  { value: "none", label: "Haven't worked on this" },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  state,
  isProcessing,
  onSendResponse,
  onReformat,
}) => {
  const [placement, setPlacement] = useState<GapPlacement | null>(null);
  const [isReformatting, setIsReformatting] = useState(false);

  // Project fields
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectLink, setProjectLink] = useState("");

  // Experience fields
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expDates, setExpDates] = useState("");
  const [expLocation, setExpLocation] = useState("");

  // Achievement fields
  const [achievementDescription, setAchievementDescription] = useState("");
  const [achievementDates, setAchievementDates] = useState("");
  const [achievementCategory, setAchievementCategory] = useState("");

  const questions = state?.gap_questions || [];
  const currIndex = state?.current_question_index || 0;
  const currentQuestion = questions[currIndex];

  const resetFields = () => {
    setPlacement(null);
    setProjectName("");
    setProjectDescription("");
    setProjectTechStack("");
    setProjectLink("");
    setExpRole("");
    setExpCompany("");
    setExpDescription("");
    setExpDates("");
    setExpLocation("");
    setAchievementDescription("");
    setAchievementDates("");
    setAchievementCategory("");
  };

  const isFormValid = (): boolean => {
    if (!placement || placement === "none") return true;
    if (placement === "project") return !!projectName.trim() && !!projectDescription.trim();
    if (placement === "experience") return !!expRole.trim() && !!expCompany.trim() && !!expDescription.trim();
    if (placement === "achievement") return !!achievementDescription.trim();
    return false;
  };

  const buildAnswerInput = (): GapAnswerInput | null => {
    if (placement === "project") {
      return {
        category: "project",
        name: projectName.trim(),
        description: projectDescription.trim(),
        tech_stack: projectTechStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        link: projectLink.trim(),
      };
    }

    if (placement === "experience") {
      return {
        category: "experience",
        role: expRole.trim(),
        company: expCompany.trim(),
        description: expDescription.trim(),
        dates: expDates.trim(),
        location: expLocation.trim(),
      };
    }

    if (placement === "achievement") {
      return {
        category: "achievement",
        description: achievementDescription.trim(),
        dates: achievementDates.trim(),
        achievement_category: achievementCategory.trim(),
      };
    }

    return null;
  };

  const handleReformat = async () => {
    const answerInput = buildAnswerInput();
    if (!answerInput || !answerInput.description.trim()) return;

    setIsReformatting(true);
    try {
      const polished = await onReformat(answerInput);
      if (placement === "project") setProjectDescription(polished);
      else if (placement === "experience") setExpDescription(polished);
      else if (placement === "achievement") setAchievementDescription(polished);
    } catch (err) {
      console.error("Reformat failed:", err);
    } finally {
      setIsReformatting(false);
    }
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    onSendResponse(currentQuestion.id, "none", null);
    resetFields();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || !placement) return;

    if (placement === "none") {
      onSendResponse(currentQuestion.id, "none", null);
      resetFields();
      return;
    }

    if (!isFormValid()) return;

    const answerInput = buildAnswerInput();
    onSendResponse(currentQuestion.id, placement, answerInput);
    resetFields();
  };

  const currentDescription =
    placement === "project" ? projectDescription :
    placement === "experience" ? expDescription :
    placement === "achievement" ? achievementDescription : "";

  return (
    <div className="flex flex-col h-full bg-[#1C1C1E] rounded-xl p-4 flex-1 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2C2C2E] border border-white/10 flex items-center justify-center text-[#0A84FF]">
            <Bot size={17} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#F5F5F7]">Agent Inspector</h3>
            <p className="text-[11px] text-[#86868B]">
              {state?.target_domain ? `Specialist: ${state.target_domain}` : "Initializing workflow..."}
            </p>
          </div>
        </div>

        {state?.ats_score !== undefined && (
          <div className="flex items-center gap-1.5 bg-[#0A84FF]/15 border border-[#0A84FF]/30 px-2.5 py-1 rounded-full">
            <ShieldCheck size={13} className="text-[#0A84FF]" />
            <span className="text-xs font-medium text-[#0A84FF]">ATS Match: {state.ats_score}%</span>
          </div>
        )}
      </div>

      {/* Main Stream Area */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {state?.missing_keywords && state.missing_keywords.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#2C2C2E] border border-white/10">
            <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider block mb-2">
              Detected Gap Keywords
            </span>
            <div className="flex flex-wrap gap-1.5">
              {state.missing_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#1C1C1E] border border-white/10 text-[#F5F5F7]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Question Container */}
        <AnimatePresence mode="wait">
          {currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/25 text-[#F5F5F7] space-y-3"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#0A84FF]">
                <Sparkles size={13} />
                <span>Question {currIndex + 1} of {questions.length}</span>
              </div>
              <div>
                <p className="text-xs font-semibold leading-relaxed text-[#F5F5F7]">
                  Missing: {currentQuestion.missing_requirement}
                </p>
                <p className="text-[11px] leading-relaxed text-[#A1A1A6] mt-1">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Placement selector */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {PLACEMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPlacement(opt.value)}
                    disabled={isProcessing}
                    className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all disabled:opacity-50 cursor-pointer ${
                      placement === opt.value
                        ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                        : "bg-[#1C1C1E] border-white/10 text-[#A1A1A6] hover:text-white hover:border-white/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Project sub-fields */}
              {placement === "project" && (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                  />
                  <input
                    type="text"
                    value={projectTechStack}
                    onChange={(e) => setProjectTechStack(e.target.value)}
                    placeholder="Tech stack (comma separated, optional)"
                    className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                  />
                  <input
                    type="text"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="Live link / GitHub repo (optional)"
                    className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              )}

              {/* Experience sub-fields */}
              {placement === "experience" && (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="Position / role"
                      className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="Company"
                      className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={expDates}
                      onChange={(e) => setExpDates(e.target.value)}
                      placeholder="Dates (e.g. Jun 2024 – Present)"
                      className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={expLocation}
                      onChange={(e) => setExpLocation(e.target.value)}
                      placeholder="Location (optional)"
                      className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Achievement sub-fields */}
              {placement === "achievement" && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    value={achievementCategory}
                    onChange={(e) => setAchievementCategory(e.target.value)}
                    placeholder="Category (e.g. Hackathon, Award)"
                    className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                  />
                  <input
                    type="text"
                    value={achievementDates}
                    onChange={(e) => setAchievementDates(e.target.value)}
                    placeholder="Date (optional)"
                    className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              )}

              {/* Shared description textarea — Reformat writes back into this */}
              {placement && placement !== "none" && (
                <div className="space-y-1.5 pt-1">
                  <textarea
                    value={currentDescription}
                    onChange={(e) => {
                      if (placement === "project") setProjectDescription(e.target.value);
                      else if (placement === "experience") setExpDescription(e.target.value);
                      else if (placement === "achievement") setAchievementDescription(e.target.value);
                    }}
                    placeholder={
                      placement === "achievement"
                        ? "Describe the achievement"
                        : "What did you do? One point per line — press Enter to add another."
                    }
                    rows={4}
                    disabled={isReformatting}
                    className="w-full bg-[#1C1C1E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-lg px-3 py-2 outline-none resize-none disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={handleReformat}
                    disabled={!currentDescription.trim() || isReformatting || isProcessing}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border bg-[#1C1C1E] border-white/10 text-[#0A84FF] hover:border-[#0A84FF]/40 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isReformatting ? (
                      <div className="w-3 h-3 border-2 border-[#0A84FF] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Wand2 size={12} />
                    )}
                    <span>{isReformatting ? "Reformatting..." : "Reformat using AI"}</span>
                  </button>
                </div>
              )}

              {/* Submit */}
              {placement && placement !== "none" && (
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={!isFormValid() || isProcessing || isReformatting}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isProcessing ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Submit Answer</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {placement === "none" && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full py-2 rounded-lg bg-[#2C2C2E] hover:bg-[#3A3A3C] text-[#F5F5F7] text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer"
                >
                  Confirm & Skip
                </button>
              )}
            </motion.div>
          ) : (
            <div className="p-6 text-center border border-dashed border-white/10 rounded-xl bg-[#2C2C2E]/40">
              <CheckCircle2 size={22} className="mx-auto text-[#30D158] mb-1.5" />
              <p className="text-xs font-medium text-[#F5F5F7]">All gaps resolved</p>
              <p className="text-[11px] text-[#86868B] mt-0.5">Your resume has been updated with your answers.</p>
            </div>
          )}
        </AnimatePresence>

        {/* System Event Log */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#86868B] mb-2">
            <Terminal size={12} />
            <span>Agent Event Log</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-[#A1A1A6]">
            {state?.logs?.slice(-3).map((log, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-[#0A84FF]">›</span>
                <span className="truncate">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick skip, always available while a question is active */}
      {currentQuestion && (
        <button
          type="button"
          onClick={handleSkip}
          disabled={isProcessing}
          className="mt-2 self-end px-2.5 py-1 text-[10px] font-medium text-[#86868B] hover:text-white bg-[#1C1C1E] border border-white/10 rounded-md disabled:opacity-50 cursor-pointer"
        >
          Skip this question
        </button>
      )}
    </div>
  );
};