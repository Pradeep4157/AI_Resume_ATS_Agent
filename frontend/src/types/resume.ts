export interface ExperienceItem {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  dates: string;
}

export interface Basics {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: string;
}

export interface ResumeData {
  basics: Basics;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface GapQuestion {
  id: string;
  question: string;
  target_keyword: string;
}

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