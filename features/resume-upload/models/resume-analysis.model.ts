export type ResumeAnalysisRequest = {
  resume_id: string;
  job_description: string;
};

export type ResumeAnalysisScores = {
  skills_match: number;
  experience_match: number;
  keyword_match: number;
  seniority_match: number;
  impact_and_metrics: number;
  format_and_clarity: number;
};

export type ResumeAnalysisStrength = {
  title: string;
  evidence: string;
  why_it_matters: string;
};

export type GapSeverity = "low" | "medium" | "high";

export type ResumeAnalysisGap = {
  title: string;
  severity: GapSeverity;
  evidence: string;
  recommendation: string;
};

export type UpdatePriority = "low" | "medium" | "high";

export type ResumeAnalysisUpdate = {
  section: string;
  priority: UpdatePriority;
  current_issue: string;
  suggested_change: string;
  example_rewrite: string;
};

export type ResumeAnalysisResponse = {
  overall_score: number;
  summary: string;
  scores: ResumeAnalysisScores;
  strengths: ResumeAnalysisStrength[];
  gaps: ResumeAnalysisGap[];
  recommended_updates: ResumeAnalysisUpdate[];
  keywords_to_add: string[];
  keywords_already_present: string[];
  tailored_resume_summary: string;
  final_recommendation: string;
};

export type ResumeAnalysisStatus = "idle" | "loading" | "success" | "error";
