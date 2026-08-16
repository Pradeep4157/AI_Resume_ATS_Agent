import React, { useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";
import { JakeTemplate } from "./templates/JakeTemplate";
import { CompactTemplate } from "./templates/CompactTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { FaangTemplate } from "./templates/FaangTemplate";

interface ResumePreviewProps {
  resumeData: any;
  isComplete?: boolean;
  selectedTemplate?: string;
  onExportPdf?: () => void;
}
export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  isComplete,
  selectedTemplate = "jake",
  onExportPdf,
}) => {
  const [zoom, setZoom] = useState<number>(0.65);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    window.print();
  };

  const renderActiveTemplate = () => {
    switch (selectedTemplate) {
      case "compact":
        return <CompactTemplate data={resumeData} />;
      case "executive":
        return <ExecutiveTemplate data={resumeData} />;
      case "faang":
        return <FaangTemplate data={resumeData} />;
      case "jake":
      default:
        return <JakeTemplate data={resumeData} />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden">
      {/* Controls Bar */}
      <div className="w-full shrink-0 flex items-center justify-between bg-[#1C1C1E] px-4 py-2 rounded-lg border border-white/10 mb-3 shadow-md text-xs text-[#86868B]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">A4 Document Canvas</span>
          {isComplete && (
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px]">
              Ready
            </span>
          )}
        </div>

        {/* Zoom Controls stay the same */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          {/* ...unchanged zoom buttons... */}
        </div>

        {/* Export PDF Button — now calls the passed-in prop */}
        <button
          onClick={() => onExportPdf?.()}
          className="flex items-center gap-1.5 bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium px-3 py-1.5 rounded-md shadow transition"
        >
          <Download size={14} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Live Canvas Window — unchanged, still shows the zoomed preview on screen */}
      <div className="w-full flex-1 overflow-y-auto flex justify-center items-start p-4 custom-scrollbar">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="zoom-wrapper shadow-2xl rounded-sm my-2"
        >
          <div
            id="resume-print-area"
            className="w-[210mm] min-h-[297mm] bg-white text-black p-[12mm] box-border shadow-2xl"
          >
            {renderActiveTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};