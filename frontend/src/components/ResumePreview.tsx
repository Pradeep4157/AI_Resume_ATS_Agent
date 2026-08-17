import React, { useState } from "react";
import { Download } from "lucide-react";

import { JakeTemplate } from "./templates/JakeTemplate";
import { CompactTemplate } from "./templates/CompactTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { FaangTemplate } from "./templates/FaangTemplate";
import ExportGuideModal from "./ExportGuideModal";

interface ResumePreviewProps {
  resumeData: any;
  isComplete?: boolean;
  selectedTemplate?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  isComplete,
  selectedTemplate = "jake",
}) => {
  const [showExportGuide, setShowExportGuide] = useState(false);

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

  
  const handleExportPDF = () => {
    window.print();
  };

  const handleExportClick = () => {
    const hasSeenGuide = sessionStorage.getItem("hasSeenExportGuide");

    if (hasSeenGuide) {
      handleExportPDF();
    } else {
      setShowExportGuide(true);
    }
  };

  const confirmExport = () => {
    sessionStorage.setItem("hasSeenExportGuide", "true");
    setShowExportGuide(false);

    // Give React a moment to remove the modal before opening print
    setTimeout(() => {
      handleExportPDF();
    }, 100);
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden">
      {/* Controls Bar */}
      <div className="w-full shrink-0 flex items-center justify-between bg-[#1C1C1E] px-4 py-2 rounded-lg border border-white/10 mb-3 shadow-md text-xs text-[#86868B]">
        
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">
            A4 Document Canvas
          </span>

          {isComplete && (
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px]">
              Ready
            </span>
          )}
        </div>

        <button
          onClick={handleExportClick}
          className="flex items-center gap-1.5 bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium px-3 py-1.5 rounded-md shadow transition"
        >
          <Download size={14} />
          <span>Export PDF</span>
        </button>

        
      </div>

      {/* Resume Preview */}
      <div className="w-full flex-1 overflow-auto flex justify-center items-start p-4 custom-scrollbar">
        <div className="my-2 shadow-2xl rounded-sm shrink-0">
          <div
            id="resume-print-area"
            className="w-[210mm] min-h-[297mm] bg-white text-black p-[12mm] box-border"
          >
            {renderActiveTemplate()}
          </div>
        </div>
      </div>

      {showExportGuide && (
      <ExportGuideModal
        onConfirm={confirmExport}
        onCancel={() => setShowExportGuide(false)}
      />
    )}
    </div>
  );
};