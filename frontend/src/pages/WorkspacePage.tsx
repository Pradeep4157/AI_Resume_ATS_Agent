import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Workspace } from "../components/Workspace";

interface WorkspacePageProps {
  agentStream: ReturnType<typeof import("../hooks/useAgentStream").useAgentStream>;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ agentStream }) => {
  const navigate = useNavigate();
  const { state, isProcessing, isComplete, sendResponse, reformatAnswer, exportPdf, resetSession } = agentStream;

  // If someone lands on /workspace directly with no data at all (fresh browser, never analyzed anything),
  // send them back to start rather than showing an empty workspace.
  if (!state && !isProcessing) {
    navigate("/", { replace: true });
    return null;
  }

  if (!state && isProcessing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={32} className="animate-spin text-[#0A84FF] mb-4" />
        <h3 className="text-base font-semibold mb-1 text-white">Setting up your workspace</h3>
        <p className="text-xs text-[#86868B]">
          Parsing your resume and generating optimization questions...
        </p>
      </div>
    );
  }

  if (!state) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <Workspace
      state={state}
      isProcessing={isProcessing}
      isComplete={isComplete}
      sendResponse={sendResponse}
      reformatAnswer={reformatAnswer}
      exportPdf={exportPdf}
    />
  );
};