export interface ProfileInfo {
  full_name: string;
  headline: string;
  email: string;
  mobile: string;
  university: string;
  program_pursued: string;
  portrait_cutout_url: string;
  portrait_original_url: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  status: string;
  cgpa: string;
  cgpa_scale: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  items: string[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  category: string;
  summary: string;
  objectives: string[];
  technologies: string[];
}

export interface AchievementEntry {
  index: string;
  title: string;
  description: string;
}

export interface PortfolioData {
  profile: ProfileInfo;
  career_objective: string;
  education: EducationEntry;
  technical_skills: SkillCategory[];
  projects: ProjectEntry[];
  achievements: AchievementEntry[];
  career_interests: string[];
  personal_strengths: string[];
  languages: string[];
  powered_by: string;
}

export interface CareerTrack {
  id: string;
  label: string;
  description: string;
  required_skills: string[];
}

export interface LearningStep {
  skill: string;
  priority: string;
  recommendation: string;
}

export interface GapAnalysisResult {
  track_id: string;
  track_label: string;
  readiness_score: number;
  readiness_level: string;
  matched_count: number;
  total_required: number;
  matched_skills: string[];
  missing_skills: string[];
  roadmap: LearningStep[];
  summary: string;
}

export interface PortfolioApiResponse {
  portfolio: PortfolioData;
  gap_analyser: {
    tracks: CareerTrack[];
    available_skills: string[];
  };
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}
