import { Routes, Route} from "react-router-dom";
import { useAgentStream } from "./hooks/useAgentStream";
import { LandingPage } from "./pages/LandingPage";
import { WorkspacePage } from "./pages/WorkspacePage";

export default function App() {
  const agentStream = useAgentStream();

  return (
    <Routes>
      <Route path="/" element={<LandingPage agentStream={agentStream} />} />
      <Route path="/workspace" element={<WorkspacePage agentStream={agentStream} />} />
    </Routes>
  );
}
// import React, { useState, useRef } from "react";
// import { Sparkles, ArrowRight, Upload, FileText, X, RefreshCw } from "lucide-react";
// import { motion } from "framer-motion";
// import { useAgentStream } from "./hooks/useAgentStream";
// import { Workspace } from "./components/Workspace";

// export default function App() {
//   const [resumeText, setResumeText] = useState("");
//   const [hasStarted, setHasStarted] = useState(false);
//   const [jdText, setJdText] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Everything comes directly from your stream hook!
//   const { state, isProcessing, isComplete, startAnalysis, sendResponse, reformatAnswer, exportPdf } = useAgentStream();

//   // Get current parsed or optimized resume from agent stream state
//   const currentResumeData = state?.optimized_resume || state?.parsed_resume;

//   const handleFileSelect = async (file: File) => {
//     setSelectedFile(file);

//     if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
//       const text = await file.text();
//       setResumeText(text);
//     } else {
//       setResumeText(`[Uploaded File: ${file.name}] - Content extracted successfully.`);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileSelect(e.dataTransfer.files[0]);
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setResumeText("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleLaunch = () => {
//     if ((!resumeText.trim() && !selectedFile) || !jdText.trim()) return;
//     setHasStarted(true);
    
//     // Pass selectedFile if present, otherwise pass resumeText
//     startAnalysis(selectedFile || resumeText, jdText);
//   };

//   // =========================================================================
//   // CONDITIONAL RENDER: If analysis has started or data exists, show Workspace
//   // =========================================================================
//   if (hasStarted || currentResumeData) {
//     return (
//       <Workspace
//         state={state}
//         isProcessing={isProcessing}
//         isComplete={isComplete}
//         sendResponse={sendResponse}
//         reformatAnswer={reformatAnswer}
//         exportPdf={exportPdf}
//       />
//     );
//   }

//   // =========================================================================
//   // INITIAL LANDING / UPLOAD PAGE
//   // =========================================================================
  
  
// }