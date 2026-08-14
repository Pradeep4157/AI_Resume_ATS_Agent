import React, { useState, useRef } from "react";
import { Sparkles, ArrowRight, Upload, FileText, X, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAgentStream } from "./hooks/useAgentStream";
import { Workspace } from "./components/Workspace";

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [jdText, setJdText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Everything comes directly from your stream hook!
  const { state, isProcessing, isComplete, startAnalysis, sendResponse, reformatAnswer } = useAgentStream();

  // Get current parsed or optimized resume from agent stream state
  const currentResumeData = state?.optimized_resume || state?.parsed_resume;

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);

    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const text = await file.text();
      setResumeText(text);
    } else {
      setResumeText(`[Uploaded File: ${file.name}] - Content extracted successfully.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setResumeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLaunch = () => {
    if ((!resumeText.trim() && !selectedFile) || !jdText.trim()) return;
    setHasStarted(true);
    
    // Pass selectedFile if present, otherwise pass resumeText
    startAnalysis(selectedFile || resumeText, jdText);
  };

  // =========================================================================
  // CONDITIONAL RENDER: If analysis has started or data exists, show Workspace
  // =========================================================================
  if (hasStarted || currentResumeData) {
    return (
      <Workspace
        state={state}
        isProcessing={isProcessing}
        isComplete={isComplete}
        sendResponse={sendResponse}
        reformatAnswer={reformatAnswer}
      />
    );
  }

  // =========================================================================
  // INITIAL LANDING / UPLOAD PAGE
  // =========================================================================
  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] font-sans antialiased selection:bg-[#0A84FF]/25 selection:text-[#0A84FF]">
      {/* macOS Translucent Header */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-3">
        <nav className="max-w-6xl mx-auto apple-glass-dark border border-white/10 rounded-2xl px-5 py-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#0A84FF] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
              R
            </div>
            <span className="font-medium text-sm text-[#F5F5F7] tracking-tight">
              ResuMax <span className="text-[#86868B] font-normal">AI</span>
            </span>
          </div>
        </nav>
      </header>

      {/* Main Form Container */}
      <main className="pt-28 pb-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Optimize Your Resume for <span className="text-[#0A84FF]">Target Roles</span>
          </h1>
          <p className="text-sm text-[#86868B] max-w-lg mx-auto">
            Upload your existing resume and paste the job description to begin real-time ATS optimization.
          </p>
        </div>

        <div className="space-y-6 bg-[#1C1C1E] p-6 rounded-2xl border border-white/10 shadow-2xl">
          {/* Resume Input Mode Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#A1A1A6]">1. YOUR RESUME</label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode("upload")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    inputMode === "upload" ? "bg-[#0A84FF] text-white" : "text-[#86868B] hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("paste")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    inputMode === "paste" ? "bg-[#0A84FF] text-white" : "text-[#86868B] hover:text-white"
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputMode === "upload" ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#0A84FF] bg-[#0A84FF]/10"
                    : "border-white/10 hover:border-white/20 bg-[#2C2C2E]/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText size={20} className="text-[#0A84FF]" />
                    <span className="text-sm font-medium text-[#F5F5F7]">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="p-1 hover:bg-white/10 rounded-full text-[#86868B]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={28} className="mx-auto text-[#86868B] mb-2" />
                    <p className="text-xs text-[#F5F5F7] font-medium">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-[#86868B] mt-1">PDF, DOCX, or TXT</p>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste raw resume text here..."
                className="w-full bg-[#2C2C2E]/40 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#0A84FF] resize-none"
              />
            )}
          </div>

          {/* Job Description Input */}
          <div>
            <label className="block text-xs font-semibold text-[#A1A1A6] mb-2">
              2. TARGET JOB DESCRIPTION
            </label>
            <textarea
              rows={6}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description or requirements here..."
              className="w-full bg-[#2C2C2E]/40 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#0A84FF] resize-none"
            />
          </div>

          {/* Launch Action */}
          <button
            type="button"
            onClick={handleLaunch}
            disabled={(!resumeText.trim() && !selectedFile) || !jdText.trim()}
            className="w-full py-3 rounded-xl bg-[#0A84FF] hover:bg-[#0071E3] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Start AI Optimization</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}