import React, { useState } from "react";
import { Loader2, Sparkles, LayoutTemplate, Check } from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { ChatInterface } from "./ChatInterface";

interface WorkspaceProps {
  resumeData?: any;
  isProcessing?: boolean;
  isComplete?: boolean;
  sendResponse?: (msg: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  resumeData,
  isProcessing,
  isComplete,
  sendResponse,
}) => {
  // Template state: "jake" | "modern" | "compact"
  const [selectedTemplate, setSelectedTemplate] = useState<string>("jake");

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Top Header with Template Selector */}
      <header className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-[#0A84FF] flex items-center justify-center font-bold text-xs">
            R
          </div>
          <span className="font-semibold text-sm">ResuMax Workspace</span>
        </div>

        {/* Template Selector Options */}
        <div className="flex items-center gap-2 bg-[#1C1C1E] p-1 rounded-xl border border-white/10">
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
            Jake's Resume (ATS Classic)
          </button>

          <button
            onClick={() => setSelectedTemplate("modern")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              selectedTemplate === "modern"
                ? "bg-[#0A84FF] text-white shadow-sm"
                : "text-[#86868B] hover:text-white"
            }`}
          >
            Modern Minimal
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

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Pane: Chat / Agent Stream */}
        <div className="lg:col-span-5 border-r border-white/10 flex flex-col bg-[#18181A] overflow-hidden">
          <ChatInterface 
            isProcessing={isProcessing} 
            isComplete={isComplete} 
            sendResponse={sendResponse} 
          />
        </div>

        {/* Right Pane: Resume Canvas */}
        <div className="lg:col-span-7 bg-[#0F0F10] overflow-y-auto p-6 flex flex-col items-center justify-start">
          {resumeData ? (
            <div className="w-full max-w-[800px] shadow-2xl rounded-lg overflow-hidden border border-white/10 bg-white">
              {/* Pass the chosen template into ResumePreview */}
              <ResumePreview data={resumeData} template={selectedTemplate} />
            </div>
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