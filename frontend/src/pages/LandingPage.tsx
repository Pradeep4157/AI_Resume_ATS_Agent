import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  FileText,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

interface LandingPageProps {
  agentStream: ReturnType<
    typeof import("../hooks/useAgentStream").useAgentStream
  >;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  agentStream,
}) => {
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startAnalysis } = agentStream;

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);

    if (
      file.type === "text/plain" ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md")
    ) {
      const text = await file.text();
      setResumeText(text);
    } else {
      setResumeText(
        `[Uploaded File: ${file.name}] - Content extracted successfully.`
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setResumeText("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLaunch = () => {
    if ((!resumeText.trim() && !selectedFile) || !jdText.trim()) return;

    startAnalysis(selectedFile || resumeText, jdText);
    navigate("/workspace");
  };

  const canLaunch =
    (!!resumeText.trim() || !!selectedFile) && !!jdText.trim();

  return (
    <div className="min-h-screen overflow-hidden bg-[#050506] text-[#F5F5F7] font-sans antialiased selection:bg-[#0A84FF]/30 selection:text-white">
      {/* =========================================================
          AMBIENT BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-[#0A84FF]/[0.065] blur-[150px]" />

        <div className="absolute left-[-300px] top-[45%] h-[450px] w-[450px] rounded-full bg-violet-500/[0.035] blur-[130px]" />

        <div className="absolute right-[-250px] bottom-[-150px] h-[450px] w-[450px] rounded-full bg-blue-400/[0.035] blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.022] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      {/* =========================================================
          PREMIUM ALIGNА HEADER
      ========================================================= */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-5">
        <nav className="relative mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between overflow-hidden rounded-[22px] border border-white/[0.11] bg-[#101216]/80 px-5 shadow-[0_18px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:px-6 lg:px-8">

          {/* -------------------------------------------------------
              Subtle blue light inside header
          ------------------------------------------------------- */}
          <div className="pointer-events-none absolute -left-20 -top-24 h-52 w-80 rounded-full bg-[#0A84FF]/[0.10] blur-[70px]" />

          <div className="pointer-events-none absolute bottom-0 left-[42%] h-16 w-64 rounded-full bg-[#0A84FF]/[0.045] blur-[45px]" />

          {/* -------------------------------------------------------
              LEFT — BRAND
          ------------------------------------------------------- */}
          <div className="relative flex items-center">
            {/* Logo */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.12] bg-gradient-to-br from-[#168BFF] via-[#0878EA] to-[#005FCC] shadow-[0_8px_28px_rgba(10,132,255,0.35)]">
              <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-br from-white/[0.16] to-transparent" />

              <span className="relative text-[17px] font-bold tracking-[-0.04em] text-white">
                A
              </span>
            </div>

            {/* Brand */}
            <div className="ml-4 flex items-center">
              <div className="flex flex-col">
                <span className="text-[18px] font-semibold leading-none tracking-[-0.04em] text-[#F5F5F7]">
                  Aligna
                </span>

                <span className="mt-1 text-[8px] font-medium leading-none tracking-[0.11em] text-[#676970]">
                  RESUME INTELLIGENCE
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 hidden h-9 w-px bg-gradient-to-b from-transparent via-white/[0.15] to-transparent lg:block" />

            {/* Tagline */}
            <div className="hidden flex-col justify-center lg:flex">
              <span className="text-[11px] font-medium uppercase tracking-[0.13em] text-[#4F525A]">
                
              </span>

              <span className="mt-1 text-[13px] font-medium tracking-[-0.01em] text-[#B5B7BE]">
                {" "}
                <span className="text-[#5AA9FF]"></span>
              </span>
            </div>
          </div>

          {/* -------------------------------------------------------
              RIGHT — INTELLIGENCE STATUS
          ------------------------------------------------------- */}
          <div className="relative flex items-center gap-3">
            {/* Intelligence pill */}
            <div className="hidden items-center gap-2.5 rounded-full border border-white/[0.10] bg-white/[0.035] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:flex">
              <Sparkles
                size={14}
                className="text-[#1888FF]"
                strokeWidth={1.8}
              />

              <span className="text-[11px] font-medium text-[#9699A1]">
                AI Engine · Ready 
              </span>
            </div>

            {/* Divider */}
            <div className="hidden h-7 w-px bg-white/[0.10] sm:block" />

            {/* AI status */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
                <span className="relative block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              </div>

              <div className="hidden flex-col leading-none sm:flex">
                <span className="text-[11px] font-medium text-[#C1C2C7]">
                  Online
                </span>

                {/* <span className="mt-1 text-[8px] text-[#55575E]">

                </span> */}
              </div>

              <span className="text-[11px] font-medium text-[#A1A1A6] sm:hidden">
                AI
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* =========================================================
          MAIN
          EVERYTHING BELOW THE HEADER REMAINS THE SAME
      ========================================================= */}
      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 sm:pt-36">

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-1.5 text-[11px] font-medium text-[#8D8D92] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
            <Sparkles size={12} className="text-[#0A84FF]" />

            <span>Resume intelligence for the role you want</span>
          </div>

          <h1 className="animate-fade-up-delay text-[48px] font-bold leading-[0.98] tracking-[-0.055em] text-[#F5F5F7] sm:text-[68px] lg:text-[80px]">
            Your experience.
            <br />

            <span className="bg-gradient-to-r from-[#F5F5F7] via-[#DCE9FF] to-[#0A84FF] bg-clip-text text-transparent">
              The right role.
            </span>
          </h1>

          <p className="mt-5 text-[22px] font-medium tracking-[-0.035em] text-[#A1A1A6] sm:text-[26px]">
            Aligned.
          </p>

          <p className="mx-auto mt-6 max-w-xl text-[14px] leading-6 tracking-[-0.01em] text-[#77777D] sm:text-[15px]">
            Aligna analyzes your resume against the job you're targeting,
            identifies what matters, and helps you build a stronger match.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[#5F5F64]">
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-400" />
              ATS-aware
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-400" />
              Job-specific
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-emerald-400" />
              AI-powered
            </span>
          </div>
        </section>

        {/* =====================================================
            APPLICATION WINDOW
        ===================================================== */}
        <section className="relative mx-auto mt-12 max-w-4xl">
          <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-[#0A84FF]/[0.035] blur-3xl" />

          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#111113]/90 shadow-[0_35px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.025)] backdrop-blur-2xl">

            {/* Window chrome */}
            <div className="relative flex h-12 items-center justify-between border-b border-white/[0.07] px-5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium text-[#66666B]">
                
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[#66666B]">
                {/* <Zap size={11} />
                Aligna */}
              </div>
            </div>

            <div className="p-5 sm:p-7">

              {/* =================================================
                  RESUME INPUT
              ================================================= */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-semibold text-[#A1A1A6]">
                        01
                      </span>

                      <label className="text-[12px] font-semibold tracking-wide text-[#D1D1D6]">
                        YOUR RESUME
                      </label>
                    </div>

                    <p className="ml-7 mt-1 text-[10px] text-[#626267]">
                      Start with the experience you already have
                    </p>
                  </div>

                  <div className="hidden rounded-lg border border-white/[0.07] bg-white/[0.035] p-0.5 sm:flex">
                    <button
                      type="button"
                      onClick={() => setInputMode("upload")}
                      className={`rounded-md px-3 py-1.5 text-[10px] font-medium transition-all ${
                        inputMode === "upload"
                          ? "bg-white/[0.10] text-[#F5F5F7] shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                          : "text-[#6E6E73] hover:text-[#A1A1A6]"
                      }`}
                    >
                      Upload
                    </button>

                    <button
                      type="button"
                      onClick={() => setInputMode("paste")}
                      className={`rounded-md px-3 py-1.5 text-[10px] font-medium transition-all ${
                        inputMode === "paste"
                          ? "bg-white/[0.10] text-[#F5F5F7] shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                          : "text-[#6E6E73] hover:text-[#A1A1A6]"
                      }`}
                    >
                      Paste
                    </button>
                  </div>
                </div>

                <div className="mb-3 flex rounded-lg border border-white/[0.07] bg-white/[0.025] p-0.5 sm:hidden">
                  <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`flex-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
                      inputMode === "upload"
                        ? "bg-white/[0.09] text-[#F5F5F7]"
                        : "text-[#6E6E73]"
                    }`}
                  >
                    Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputMode("paste")}
                    className={`flex-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
                      inputMode === "paste"
                        ? "bg-white/[0.09] text-[#F5F5F7]"
                        : "text-[#6E6E73]"
                    }`}
                  >
                    Paste
                  </button>
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
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isDragging
                        ? "border-[#0A84FF]/70 bg-[#0A84FF]/[0.08] shadow-[0_0_35px_rgba(10,132,255,0.12)]"
                        : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.04]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileSelect(e.target.files[0])
                      }
                    />

                    {selectedFile ? (
                      <div className="flex min-h-[145px] items-center justify-center px-5">
                        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A84FF]/10">
                            <FileText
                              size={18}
                              className="text-[#0A84FF]"
                            />
                          </div>

                          <div className="max-w-[220px]">
                            <p className="truncate text-[12px] font-medium text-[#F5F5F7]">
                              {selectedFile.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#6E6E73]">
                              Ready for alignment
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="ml-2 rounded-lg p-1.5 text-[#6E6E73] transition hover:bg-white/[0.07] hover:text-[#F5F5F7]"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex min-h-[145px] flex-col items-center justify-center px-5">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                        <div className="relative mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:-translate-y-0.5">
                          <Upload
                            size={18}
                            className="text-[#A1A1A6] transition-colors group-hover:text-[#0A84FF]"
                          />
                        </div>

                        <p className="relative text-[12px] font-medium text-[#D1D1D6]">
                          Drop your resume here
                        </p>

                        <p className="relative mt-1 text-[10px] text-[#6E6E73]">
                          or click to browse · PDF, DOCX, TXT
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows={6}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content here..."
                    className="min-h-[145px] w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-[12px] leading-5 text-[#F5F5F7] placeholder:text-[#55555A] outline-none transition-all focus:border-[#0A84FF]/40 focus:bg-white/[0.035] focus:ring-4 focus:ring-[#0A84FF]/[0.06]"
                  />
                )}
              </div>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.06]" />
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* =================================================
                  TARGET ROLE
              ================================================= */}
              <div>
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-semibold text-[#A1A1A6]">
                      02
                    </span>

                    <label className="text-[12px] font-semibold tracking-wide text-[#D1D1D6]">
                      TARGET ROLE
                    </label>
                  </div>

                  <p className="ml-7 mt-1 text-[10px] text-[#626267]">
                    Give Aligna the role you're trying to reach
                  </p>
                </div>

                <textarea
                  rows={6}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the full job description or requirements here..."
                  className="min-h-[145px] w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-[12px] leading-5 text-[#F5F5F7] placeholder:text-[#55555A] outline-none transition-all focus:border-[#0A84FF]/40 focus:bg-white/[0.035] focus:ring-4 focus:ring-[#0A84FF]/[0.06]"
                />
              </div>

              {/* =================================================
                  CTA
              ================================================= */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleLaunch}
                  disabled={!canLaunch}
                  className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#0A84FF] py-3.5 text-[12px] font-semibold text-white shadow-[0_10px_30px_rgba(10,132,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1689ff] hover:shadow-[0_15px_40px_rgba(10,132,255,0.3)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <Sparkles size={15} />

                  <span>Align My Resume</span>

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>

                <p className="mt-3 text-center text-[9px] text-[#55555A]">
                  Aligna compares your experience with the role you want.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            BOTTOM MESSAGE
        ===================================================== */}
        <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-[#55555A]">
          <span>No generic resume scoring</span>

          <span className="h-1 w-1 rounded-full bg-white/15" />

          <span>Built around your target role</span>

          <span className="h-1 w-1 rounded-full bg-white/15" />

          <span>Real-time AI analysis</span>
        </div>
      </main>
    </div>
  );
};