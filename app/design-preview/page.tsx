"use client";

import { JobSearchView } from "@/features/resume-upload/views/job-search.view";
import type { JobSearchResult } from "@/features/resume-upload/models/job-search.model";

/**
 * Dev-only showcase: renders the job results screen with mock data covering
 * all match-score bands. Not linked from the app; safe to delete or gate
 * before production.
 */
const MOCK_JOBS: JobSearchResult[] = [
  {
    job_id: "demo-1",
    title: "Senior Product Analyst",
    company: "Meridian Health",
    location: "Dubai, UAE (Hybrid)",
    description:
      "Own product analytics end to end: define metrics with product managers, build dashboards, and turn behavioural data into roadmap decisions for our patient-facing apps.",
    url: "https://example.com",
    salary: { currency: "AED", min: 22000, max: 28000, period: "month" },
    fit_score: 88,
    why_good_fit: [
      "6 years of SQL and product analytics matches the core requirement",
      "Healthcare domain experience at two previous employers",
    ],
    possible_gaps: [],
  },
  {
    job_id: "demo-2",
    title: "Data Analyst, Growth",
    company: "Souqly",
    location: "Abu Dhabi, UAE",
    description:
      "Partner with the growth team on experimentation, funnel analysis, and marketing attribution across web and mobile.",
    url: "https://example.com",
    salary: { currency: "AED", min: 14000, max: 18000, period: "month" },
    fit_score: 63,
    why_good_fit: ["Strong experimentation background from A/B testing work"],
    possible_gaps: ["No hands-on marketing attribution tooling"],
  },
  {
    job_id: "demo-3",
    title: "Machine Learning Engineer",
    company: "Falcon Robotics",
    location: "Remote (GCC)",
    description:
      "Build and deploy perception models for warehouse robotics; production Python, PyTorch, and MLOps pipelines.",
    url: "https://example.com",
    salary: null,
    fit_score: 41,
    why_good_fit: ["Python fundamentals are solid"],
    possible_gaps: ["No production ML deployment experience"],
  },
];

export default function DesignPreviewPage() {
  return (
    <JobSearchView
      uploadedResume={{
        resumeId: "demo-resume",
        fileName: "amina-hassan-resume-2026.pdf",
        fileSize: 182_000,
        summary:
          "Product analyst with 6 years of experience across healthcare and marketplace startups. Strong SQL, dashboarding, and experiment design; led metric definitions for two product launches and mentored junior analysts.",
        uploadedAt: new Date().toISOString(),
        jobs: [],
        message: "",
      }}
      jobs={MOCK_JOBS}
      onFindJobs={() => {}}
    />
  );
}
