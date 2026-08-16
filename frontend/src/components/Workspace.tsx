import React, { useState } from "react";
import { Loader2, Sparkles, LayoutTemplate, Check } from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { ChatInterface } from "./ChatInterface";
import type { AgentState, GapPlacement, GapAnswerInput } from "../types/resume";

interface WorkspaceProps {
  state: AgentState | null;
  isProcessing?: boolean;
  isComplete?: boolean;
  sendResponse?: (
    gapId: string,
    placement: GapPlacement,
    answerInput: GapAnswerInput | null
  ) => Promise<void>;
  reformatAnswer?: (answerInput: GapAnswerInput) => Promise<string>;
  exportPdf?: (template?: string) => Promise<void>;
}

/* Inside Workspace.tsx */

export const Workspace: React.FC<WorkspaceProps> = ({
  state,
  isProcessing,
  isComplete,
  sendResponse,
  reformatAnswer,
  exportPdf,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("jake");
  const resumeData = state?.optimized_resume || state?.parsed_resume;

  return (
    /* 1. LOCK FULL SCREEN HEIGHT AND DISABLE MAIN WINDOW SCROLL */
    <div className="h-screen w-screen bg-[#121212] text-white flex flex-col overflow-hidden">
      
      {/* Fixed Top Header (56px / h-14) */}
      <header className="h-14 shrink-0 border-b border-white/10 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-[#0A84FF] flex items-center justify-center font-bold text-xs">
            R
          </div>
          <span className="font-semibold text-sm">ResuMax Workspace</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1C1C1E] p-1 rounded-xl border border-white/10">
        <div className="flex items-center gap-1.5 px-2 text-xs text-[#86868B]">
          <LayoutTemplate size={14} />
          <span className="font-medium hidden sm:inline">Template:</span>
        </div>

        <button
          onClick={() => setSelectedTemplate("jake")}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedTemplate === "jake"
              ? "bg-[#0A84FF] text-white shadow-sm"
              : "text-[#86868B] hover:text-white"
          }`}
        >
          Jake's
        </button>

        <button
          onClick={() => setSelectedTemplate("compact")}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedTemplate === "compact"
              ? "bg-[#0A84FF] text-white shadow-sm"
              : "text-[#86868B] hover:text-white"
          }`}
        >
          Compact
        </button>

        <button
          onClick={() => setSelectedTemplate("executive")}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedTemplate === "executive"
              ? "bg-[#0A84FF] text-white shadow-sm"
              : "text-[#86868B] hover:text-white"
          }`}
        >
          Executive
        </button>

        <button
          onClick={() => setSelectedTemplate("faang")}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedTemplate === "faang"
              ? "bg-[#0A84FF] text-white shadow-sm"
              : "text-[#86868B] hover:text-white"
          }`}
        >
          FAANG
        </button>
      </div>
        {/* Status Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-[#0A84FF] bg-[#0A84FF]/10 px-3 py-1 rounded-full border border-[#0A84FF]/20">
            <Loader2 size={12} className="animate-spin" />
            <span>Analyzing...</span>
          </div>
        )}
      </header>

      {/* 2. FLEX CONTAINER FOR THE TWO PANES (CALCULATE REMAINING HEIGHT) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-3.5rem)]">
        
        {/* Left Pane: Chat Interface (FIXED, DOES NOT SCROLL WITH RESUME) */}
        <div className="lg:col-span-5 border-r border-white/10 flex flex-col bg-[#18181A] overflow-hidden h-full">
          <ChatInterface
            state={state}
            isProcessing={isProcessing ?? false}
            onSendResponse={(gapId, placement, answerInput) => {
              sendResponse?.(gapId, placement, answerInput);
            }}
            onReformat={reformatAnswer ?? (async () => "")}
          />
        </div>

        {/* Right Pane: Resume Canvas (ONLY THIS PANE SCROLLS) */}
        <div className="lg:col-span-7 bg-[#0F0F10] flex flex-col h-full overflow-hidden p-4">
          {resumeData ? (
            <ResumePreview 
              resumeData={resumeData}
              isComplete={isComplete}
              selectedTemplate={selectedTemplate}
              onExportPdf={() => exportPdf?.(selectedTemplate)}
            />
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center h-full my-auto text-center p-8">
              <Loader2 size={32} className="animate-spin text-[#0A84FF] mb-4" />
              <h3 className="text-base font-semibold mb-1 text-white">Extracting & Structuring Resume</h3>
              <p className="text-xs text-[#86868B]">
                Gemini is processing your file and populating your chosen template...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full my-auto text-center p-8">
              <Sparkles size={32} className="text-[#86868B] mb-2" />
              <p className="text-xs text-[#86868B]">No resume data loaded yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};