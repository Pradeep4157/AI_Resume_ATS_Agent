export interface ReformattedText {
  text: string;
}
export interface Basics {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  dates: string;
  location?: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  tech_stack: string[];
  link?: string;
  bullets: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  dates?: string;
  details: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  dates: string;
}

export interface ResumeData {
  basics: Basics;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  education: EducationItem[];
}

// ==========================================
// Gap analysis / questions
// ==========================================

export type GapCategory = "technical_skill" | "domain_responsibility" | "certification_achievement";

export interface GapQuestion {
  id: string;
  missing_requirement: string;
  explanation: string;
  category: GapCategory;
}

// ==========================================
// User's placement choice + structured answer
// ==========================================

export type GapPlacement = "experience" | "project" | "achievement" | "none";

export interface ProjectAnswerInput {
  category: "project";
  name: string;
  description: string;
  tech_stack: string[];
  link?: string;
}
export interface ExperienceAnswerInput {
  category: "experience";
  role: string;
  company: string;
  description: string;
  dates?: string;
  location?: string;
}

export interface AchievementAnswerInput {
  category: "achievement";
  description: string;
  dates?: string;
  achievement_category?: string; // e.g. "Research", "Certification", "Hackathon" — matches AchievementItem.category
}

export type GapAnswerInput = ProjectAnswerInput | ExperienceAnswerInput | AchievementAnswerInput;

export interface PolishedBullets {
  bullets: string[];
}

// ==========================================
// Agent state
// ==========================================

export interface AgentState {
  ats_score?: number;
  target_domain?: string;
  missing_keywords?: string[];
  parsed_resume?: ResumeData;
  optimized_resume?: ResumeData;
  gap_questions?: GapQuestion[];
  current_question_index?: number;
  logs?: string[];
}