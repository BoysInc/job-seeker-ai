import { JobDetailFeature } from "@/features/resume-upload/job-detail";

type JobPageProps = {
  params: Promise<{ job_id: string }>;
};

export default async function JobPage({ params }: JobPageProps) {
  const { job_id } = await params;

  return <JobDetailFeature jobId={decodeURIComponent(job_id)} />;
}
