import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, CheckCircle2, ShieldCheck, Terminal } from "lucide-react";
import type { AgentState } from "../types/resume";

interface ChatInterfaceProps {
  state: AgentState | null;
  isProcessing: boolean;
  onSendResponse: (questionId: string, text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ state, isProcessing, onSendResponse }) => {
  const [input, setInput] = useState("");

  const questions = state?.gap_questions || [];
  const currIndex = state?.current_question_index || 0;
  const currentQuestion = questions[currIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentQuestion) return;
    onSendResponse(currentQuestion.id, input.trim());
    setInput("");
  };

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
            <span className="text-xs font-medium text-[#0A84FF]">
              ATS Match: {state.ats_score}%
            </span>
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
              className="p-4 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/25 text-[#F5F5F7] space-y-2"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#0A84FF]">
                <Sparkles size={13} />
                <span>Question {currIndex + 1} of {questions.length}</span>
              </div>
              <p className="text-xs font-normal leading-relaxed text-[#F5F5F7]">
                {currentQuestion.question}
              </p>
            </motion.div>
          ) : (
            <div className="p-6 text-center border border-dashed border-white/10 rounded-xl bg-[#2C2C2E]/40">
              <CheckCircle2 size={22} className="mx-auto text-[#30D158] mb-1.5" />
              <p className="text-xs font-medium text-[#F5F5F7]">All gaps resolved</p>
              <p className="text-[11px] text-[#86868B] mt-0.5">Synthesis Agent is rendering your final resume.</p>
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

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="relative pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!currentQuestion || isProcessing}
          placeholder={currentQuestion ? "Type your response..." : "Optimization finished"}
          className="w-full bg-[#2C2C2E] border border-white/10 focus:border-[#0A84FF] text-xs text-[#F5F5F7] placeholder-[#86868B] rounded-xl px-3.5 py-2.5 pr-20 outline-none transition-all disabled:opacity-50"
        />
        <div className="absolute right-1.5 top-3.5 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (currentQuestion) onSendResponse(currentQuestion.id, "No experience");
            }}
            disabled={!currentQuestion || isProcessing}
            className="px-2 py-1 text-[10px] font-medium text-[#A1A1A6] hover:text-white bg-[#1C1C1E] border border-white/10 rounded-md disabled:opacity-50 cursor-pointer"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={!currentQuestion || !input.trim() || isProcessing}
            className="p-1 rounded-md bg-[#0A84FF] hover:bg-[#0071E3] text-white transition-all disabled:opacity-40 cursor-pointer"
          >
            {isProcessing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={12} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};