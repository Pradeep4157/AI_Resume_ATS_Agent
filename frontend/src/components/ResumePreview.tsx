import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import type { ResumeData } from "../types/resume";

interface ResumePreviewProps {
  resumeData?: any; // Accepting our normalized resume JSON
  isComplete?: boolean;
}

type TemplateChoice = "jake" | "faang";

const formatUrl = (url: string) => {
  if (!url) return "";
  const href = url.startsWith("http") ? url : `https://${url}`;
  const display = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return { href, display };
};
export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  isComplete = false,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateChoice>("jake");

  if (!resumeData) {
    return (
      <div className="h-full bg-[#1C1C1E] rounded-xl border border-white/10 p-8 flex flex-col items-center justify-center text-center font-sans">
        <FileText size={32} className="text-[#86868B] mb-2.5" />
        <h4 className="text-xs font-semibold text-[#F5F5F7]">Document Canvas</h4>
        <p className="text-[11px] text-[#86868B] max-w-xs mt-1">
          Upload or parse a resume to preview document...
        </p>
      </div>
    );
  }

  const { basics, skills, experience, projects, achievements, education } = resumeData;

  return (
    <div className="h-full bg-[#1C1C1E] rounded-xl border border-white/10 flex flex-col overflow-hidden font-sans shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 bg-[#2C2C2E]/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#30D158]" />
          <span className="text-xs font-medium text-[#A1A1A6]">Document Preview</span>
        </div>

        {/* Template Selector & Export Button */}
        <div className="flex items-center gap-3">
          <label className="text-[11px] text-[#86868B] font-medium">Template:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as TemplateChoice)}
            className="bg-[#1C1C1E] border border-white/10 text-[#F5F5F7] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
          >
            <option value="jake">Jake's Resume (CS Classic)</option>
            <option value="faang">FAANG Compact (Modern)</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium text-xs transition-all shadow-sm cursor-pointer"
          >
            <Download size={13} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Document Sheet Canvas */}
      <div className="flex-1 overflow-y-auto p-6 bg-black">
        <div className="max-w-3xl mx-auto">
          {selectedTemplate === "jake" ? (
            /* ================= JAKE'S RESUME TEMPLATE ================= */
            <div className="bg-white text-black font-serif p-8 rounded-lg shadow-2xl text-[12px] leading-relaxed">
              {/* Header */}
              <div className="text-center border-b border-black pb-2 mb-3">
                <h1 className="text-2xl font-bold uppercase tracking-wide">{basics?.name}</h1>
                <p className="text-[11px] text-gray-700 mt-1">
                  {[basics?.phone, basics?.email, basics?.location, basics?.links]
                    .filter(Boolean)
                    .join("  |  ")}
                </p>
              </div>

              {/* Education */}
              {education?.length > 0 && (
                <div className="mb-3">
                  <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1 font-sans">
                    Education
                  </h2>
                  {education.map((edu: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-baseline my-0.5">
                      <div>
                        <span className="font-bold">{edu.institution}</span> — <span>{edu.degree}</span>
                      </div>
                      <span className="text-[11px] font-mono">{edu.dates}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {skills?.length > 0 && (
                <div className="mb-3">
                  <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1 font-sans">
                    Technical Skills
                  </h2>
                  <p className="text-[11px]">
                    <span className="font-bold">Languages & Tools: </span>
                    {skills.join(", ")}
                  </p>
                </div>
              )}

              {/* Experience */}
              {experience?.length > 0 && (
                <div className="mb-3">
                  <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1.5 font-sans">
                    Experience
                  </h2>
                  {experience.map((exp: any) => (
                    <div key={exp.id || exp.role} className="mb-2">
                      <div className="flex justify-between font-bold">
                        <span>{exp.role}</span>
                        <span className="text-[11px] font-mono font-normal">{exp.dates}</span>
                      </div>
                      <div className="flex justify-between italic text-[11px] text-gray-800 mb-0.5">
                        <span>{exp.company}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900">
                        {exp.bullets?.map((b: string, i: number) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

                {/* Projects - Jake's Template */}
                {projects?.length > 0 && (
                <div className="mb-3">
                    <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1.5 font-sans">
                    Projects
                    </h2>
                    {projects.map((proj: any) => {
                    const urlInfo = proj.link ? formatUrl(proj.link) : null;
                    return (
                        <div key={proj.id || proj.name} className="mb-2">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold">
                            {proj.name}
                            {proj.tech_stack?.length > 0 && (
                                <span className="font-normal italic text-[11px] text-gray-700">
                                {" "}| {proj.tech_stack.join(", ")}
                                </span>
                            )}
                            </span>
                            {urlInfo && (
                            <a
                                href={urlInfo.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-blue-700 hover:underline"
                            >
                                [{urlInfo.display}]
                            </a>
                            )}
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900 mt-0.5">
                            {proj.bullets?.map((b: string, i: number) => (
                            <li key={i}>{b}</li>
                            ))}
                        </ul>
                        </div>
                    );
                    })}
                </div>
                )}

              {/* Achievements */}
              {achievements?.length > 0 && (
                <div>
                  <h2 className="font-bold uppercase text-[11px] border-b border-black mb-1 font-sans">
                    Achievements & Recognition
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900">
                    {achievements.map((ach: any) => (
                      <li key={ach.id || ach.title}>
                        <span className="font-bold">{ach.title}</span>: {ach.details?.join(" • ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* ================= FAANG COMPACT TEMPLATE ================= */
            <div className="bg-white text-zinc-900 font-sans p-8 rounded-lg shadow-2xl text-[11px] leading-normal">
              {/* Header */}
              <div className="border-b-2 border-zinc-900 pb-2.5 mb-3">
                <h1 className="text-2xl font-black tracking-tight text-zinc-900">{basics?.name}</h1>
                <div className="flex flex-wrap gap-2 text-zinc-600 mt-1 text-[10px]">
                  {[basics?.email, basics?.phone, basics?.location, basics?.links]
                    .filter(Boolean)
                    .map((item: string, idx: number) => (
                      <span key={idx}>
                        {idx > 0 && <span className="mr-2 text-zinc-400">•</span>}
                        {item}
                      </span>
                    ))}
                </div>
              </div>

              {/* Skills */}
              {skills?.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1.5">
                    Skills & Competencies
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((s: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded text-[10px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {experience?.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1.5">
                    Experience
                  </h2>
                  {experience.map((exp: any) => (
                    <div key={exp.id || exp.role} className="mb-2">
                      <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                        <span>
                          {exp.role} <span className="text-zinc-500 font-normal">@ {exp.company}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">{exp.dates}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-zinc-700 mt-0.5">
                        {exp.bullets?.map((b: string, i: number) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
                {/* Projects - FAANG Template */}
                {projects?.length > 0 && (
                <div className="mb-3">
                    <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1.5">
                    Projects
                    </h2>
                    {projects.map((proj: any) => {
                    const urlInfo = proj.link ? formatUrl(proj.link) : null;
                    return (
                        <div key={proj.id || proj.name} className="mb-2">
                        <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                            <span>{proj.name}</span>
                            {urlInfo && (
                            <a
                                href={urlInfo.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-blue-600 hover:underline"
                            >
                                {urlInfo.display}
                            </a>
                            )}
                        </div>
                        {proj.tech_stack?.length > 0 && (
                            <p className="text-[10px] text-zinc-500 font-mono mb-0.5">
                            Stack: {proj.tech_stack.join(" • ")}
                            </p>
                        )}
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-700">
                            {proj.bullets?.map((b: string, i: number) => (
                            <li key={i}>{b}</li>
                            ))}
                        </ul>
                        </div>
                    );
                    })}
                </div>
                )}

              {/* Achievements */}
              {achievements?.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1.5">
                    Achievements
                  </h2>
                  <div className="space-y-0.5 text-zinc-800">
                    {achievements.map((ach: any) => (
                      <div key={ach.id || ach.title} className="flex justify-between items-baseline">
                        <div>
                          <span className="font-bold">{ach.title}</span> — {ach.details?.join(", ")}
                        </div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400">{ach.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education?.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1.5">
                    Education
                  </h2>
                  {education.map((edu: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-zinc-800">
                      <span>
                        <strong className="text-zinc-900">{edu.degree}</strong>, {edu.institution}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{edu.dates}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};