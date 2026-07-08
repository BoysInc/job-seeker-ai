export type JobSalary = {
  min: number;
  max: number;
  currency: string;
  period: string;
};

export type JobSearchResult = {
  job_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: JobSalary | null;
  fit_score?: number;
  why_good_fit?: string[];
  possible_gaps?: string[];
};

export type JobSearchRequest = {
  title: string;
  location: string;
  limit: number;
};

export type JobSearchResponse = {
  jobs: JobSearchResult[];
};

export type JobSearchStatus = "idle" | "searching" | "success" | "error";

export const DEFAULT_JOB_LOCATION = "UAE";
export const DEFAULT_JOB_SEARCH_LIMIT = 5;
