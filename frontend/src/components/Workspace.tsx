import React, { useState } from "react";
import { Loader2, Sparkles, LayoutTemplate, Check } from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { ChatInterface } from "./ChatInterface";
import type {
  AgentState,
  GapPlacement,
  GapAnswerInput,
} from "../types/resume";

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
    <div className="h-screen w-screen bg-[#0B0C0F] text-white flex flex-col overflow-hidden">

      {/* =========================================================
          TOP WORKSPACE BAR
      ========================================================= */}
      <header
        className="
          h-[62px]
          shrink-0
          px-5
          flex items-center justify-between
          bg-[#111318]/95
          border-b border-white/[0.08]
          backdrop-blur-xl
          z-10
          shadow-[0_4px_20px_rgba(0,0,0,0.18)]
        "
      >
        {/* Aligna workspace identity */}
        <div className="flex items-center gap-3.5">
          <div
            className="
              w-9 h-9
              rounded-xl
              bg-[#0A84FF]
              flex items-center justify-center
              shadow-[0_4px_16px_rgba(10,132,255,0.28)]
            "
          >
            <span className="text-white font-bold text-sm tracking-tight">
              A
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-[15px] text-[#F5F7FA] tracking-tight">
              Aligna
            </span>

            <span className="text-[11px] text-[#7F8793]">
              Resume optimization workspace
            </span>
          </div>
        </div>

        {/* Template selector */}
        <div
          className="
            flex items-center gap-1.5
            bg-[#191C21]
            p-1
            rounded-xl
            border border-white/[0.08]
            shadow-[0_4px_16px_rgba(0,0,0,0.18)]
          "
        >
          <div
            className="
              flex items-center gap-2
              px-3
              text-xs
              text-[#8E96A3]
              border-r border-white/[0.07]
              mr-1
            "
          >
            <LayoutTemplate size={14} />
            <span className="font-medium hidden sm:inline">
              Resume style
            </span>
          </div>

          <button
            onClick={() => setSelectedTemplate("jake")}
            className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
              selectedTemplate === "jake"
                ? "bg-[#0A84FF] text-white shadow-[0_3px_10px_rgba(10,132,255,0.25)]"
                : "text-[#8E96A3] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            Jake's
          </button>

          <button
            onClick={() => setSelectedTemplate("compact")}
            className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
              selectedTemplate === "compact"
                ? "bg-[#0A84FF] text-white shadow-[0_3px_10px_rgba(10,132,255,0.25)]"
                : "text-[#8E96A3] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            Compact
          </button>

          <button
            onClick={() => setSelectedTemplate("executive")}
            className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
              selectedTemplate === "executive"
                ? "bg-[#0A84FF] text-white shadow-[0_3px_10px_rgba(10,132,255,0.25)]"
                : "text-[#8E96A3] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            Executive
          </button>

          <button
            onClick={() => setSelectedTemplate("faang")}
            className={`px-3.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
              selectedTemplate === "faang"
                ? "bg-[#0A84FF] text-white shadow-[0_3px_10px_rgba(10,132,255,0.25)]"
                : "text-[#8E96A3] hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            FAANG
          </button>
        </div>

        {/* Status Indicator */}
        {isProcessing ? (
          <div
            className="
              flex items-center gap-2
              text-xs
              text-[#5AA7FF]
              bg-[#0A84FF]/10
              px-3.5 py-2
              rounded-full
              border border-[#0A84FF]/20
              shadow-[0_3px_12px_rgba(10,132,255,0.08)]
            "
          >
            <Loader2 size={13} className="animate-spin" />
            <span className="font-medium">Analyzing resume...</span>
          </div>
        ) : (
          <div
            className="
              flex items-center gap-2
              text-xs
              text-[#55D977]
              bg-[#30D158]/10
              px-3.5 py-2
              rounded-full
              border border-[#30D158]/15
            "
          >
            <Check size={13} />
            <span className="font-medium">Workspace ready</span>
          </div>
        )}
      </header>

      {/* =========================================================
          TWO-PANE WORKSPACE
      ========================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-3.875rem)]">

        {/* =======================================================
            LEFT — AGENT INSPECTOR
        ======================================================= */}
        <div
          className="
            lg:col-span-5
            border-r border-white/[0.08]
            flex flex-col
            bg-[#15171B]
            overflow-hidden
            h-full
          "
        >
          <ChatInterface
            state={state}
            isProcessing={isProcessing ?? false}
            onSendResponse={(gapId, placement, answerInput) => {
              sendResponse?.(gapId, placement, answerInput);
            }}
            onReformat={reformatAnswer ?? (async () => "")}
          />
        </div>

        {/* =======================================================
            RIGHT — RESUME CANVAS
        ======================================================= */}
        <div
          className="
            lg:col-span-7
            bg-[#0D0F12]
            flex flex-col
            h-full
            overflow-hidden
            p-4
          "
        >
          {resumeData ? (
            <ResumePreview
              resumeData={resumeData}
              isComplete={isComplete}
              selectedTemplate={selectedTemplate}
            />
          ) : isProcessing ? (
            <div
              className="
                flex flex-col
                items-center justify-center
                h-full
                my-auto
                text-center
                p-8
              "
            >
              <div
                className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#0A84FF]/10
                  border border-[#0A84FF]/20
                  flex items-center justify-center
                  mb-5
                  shadow-[0_8px_30px_rgba(10,132,255,0.12)]
                "
              >
                <Loader2
                  size={25}
                  className="animate-spin text-[#0A84FF]"
                />
              </div>

              <h3 className="text-base font-semibold mb-1.5 text-[#F5F7FA]">
                Extracting & Structuring Resume
              </h3>

              <p className="text-xs text-[#858D99] max-w-sm leading-relaxed">
                Gemini is processing your file and populating your chosen
                template...
              </p>
            </div>
          ) : (
            <div
              className="
                flex flex-col
                items-center justify-center
                h-full
                my-auto
                text-center
                p-8
              "
            >
              <div
                className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#1A1D22]
                  border border-white/[0.07]
                  flex items-center justify-center
                  mb-4
                "
              >
                <Sparkles size={24} className="text-[#727A87]" />
              </div>

              <p className="text-sm font-medium text-[#A5ACB7]">
                No resume data loaded yet.
              </p>

              <p className="text-xs text-[#656D79] mt-1">
                Your optimized resume will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};