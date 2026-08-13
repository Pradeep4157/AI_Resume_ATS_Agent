import React, { useState } from "react";
import { JakesTemplate } from "./JakeTemplate";
import { FaangTemplate } from "./FaangTemplate";

type TemplateChoice = "jake" | "faang";

export function ResumePreviewContainer({ resumeData }: { resumeData: any }) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateChoice>("jake");

  if (!resumeData) {
    return (
      <div className="h-full flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-500 text-sm">
        Upload a resume to preview document...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
      {/* Top Workspace Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#27272a] bg-[#18181b]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Document Canvas
          </span>
        </div>

        {/* Template Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-zinc-400 font-medium">Template:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as TemplateChoice)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="jake">Jake's Resume (Classic CS)</option>
            <option value="faang">FAANG Compact (Modern)</option>
          </select>

          <button className="ml-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm">
            Export PDF
          </button>
        </div>
      </div>

      {/* Scrollable Viewport */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700 bg-zinc-950">
        <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
          {selectedTemplate === "jake" && <JakesTemplate data={resumeData} />}
          {selectedTemplate === "faang" && <FaangTemplate data={resumeData} />}
        </div>
      </div>
    </div>
  );
}