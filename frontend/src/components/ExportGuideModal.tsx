import React from "react";

interface ExportGuideModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ExportGuideModal: React.FC<ExportGuideModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-sm font-semibold text-white mb-2">Before you print</h3>
        <ul className="text-xs text-[#A1A1A6] leading-relaxed mb-4 space-y-2 list-disc list-outside ml-4">
        <li>
            Set <span className="text-white font-medium">Destination</span> to{" "}
            <span className="text-[#0A84FF] font-medium">Save as PDF</span> — not
            "Microsoft Print to PDF" — so text stays selectable and links stay clickable.
        </li>
        <li>
            Under <span className="text-white font-medium">More settings</span>, turn off{" "}
            <span className="text-white font-medium">Headers and footers</span> so the page
            URL and date don't get added to your resume.
        </li>
        </ul>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-[#A1A1A6] hover:text-white bg-[#2C2C2E] border border-white/10 rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#0A84FF] hover:bg-[#0071E3] rounded-lg transition-all cursor-pointer"
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportGuideModal;