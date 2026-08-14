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
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  isComplete,
  selectedTemplate = "jake",
}) => {
  const [zoom, setZoom] = useState<number>(0.65);
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Clean Native Print Window Handler
  const handleExportPDF = () => {
    const printElement = printContainerRef.current;
    if (!printElement) return;

    // Create a temporary hidden iframe to isolate the print layout completely
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // Grab all loaded application styles (Tailwind, fonts, etc.)
    const styleTags = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((el) => el.outerHTML)
      .join("\n");

    // Write a clean, isolated A4 document into the iframe
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData?.basics?.name || "Resume"}_CV</title>
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              width: 210mm !important;
              min-height: 297mm !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-wrapper {
              width: 210mm !important;
              min-height: 297mm !important;
              padding: 12mm !important;
              box-sizing: border-box !important;
              background: #ffffff !important;
              color: #000000 !important;
            }
          </style>
        </head>
        <body>
          <div class="print-wrapper">
            ${printElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger native window print after DOM render
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Remove iframe after user closes dialog
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 300);
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

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
            className="p-1 hover:text-white hover:bg-white/10 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="w-10 text-center font-mono text-[11px] text-white">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
            className="p-1 hover:text-white hover:bg-white/10 rounded transition"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(0.65)}
            className="p-1 hover:text-white hover:bg-white/10 rounded transition ml-1"
            title="Reset Zoom"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        {/* Export PDF Button */}
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-1.5 bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium px-3 py-1.5 rounded-md shadow transition"
        >
          <Download size={14} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Live Canvas Window */}
      <div className="w-full flex-1 overflow-y-auto flex justify-center items-start p-4 custom-scrollbar">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="shadow-2xl rounded-sm my-2"
        >
          {/* Target Printable Area */}
          <div
            ref={printContainerRef}
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