import { AiBadge } from "@/components/ai-badge";
import { ProcessingSteps } from "@/components/processing-steps";
import { Card, CardContent } from "@/components/ui/card";
import type { RecommendationStatus } from "@/features/resume-upload/models/resume-upload.model";

type ResumeProcessingViewProps = {
  processingPhase: RecommendationStatus | null;
  candidateCount: number | null;
};

type ProcessingPhase = RecommendationStatus | "uploading";

const PHASE_ORDER: ProcessingPhase[] = [
  "uploading",
  "extracting",
  "searching",
  "scoring",
  "complete",
];

const STEPS: { key: ProcessingPhase; label: string }[] = [
  { key: "uploading", label: "Uploading and reading your resume" },
  { key: "extracting", label: "Understanding your skills and experience" },
  { key: "searching", label: "Searching live job openings" },
  { key: "scoring", label: "Scoring fit and identifying possible gaps" },
];

export const ResumeProcessingView = ({
  processingPhase,
  candidateCount,
}: ResumeProcessingViewProps) => {
  const phase: ProcessingPhase = processingPhase ?? "uploading";
  const activeIndex = Math.max(PHASE_ORDER.indexOf(phase), 0);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="grid gap-6 py-2 sm:px-6">
          <div className="grid gap-2 text-center">
            <div className="mx-auto">
              <AiBadge>AI matching</AiBadge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Finding your best-fit roles
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              We are reading your resume, matching it against open roles, and
              preparing fit scores. This usually takes under a minute.
            </p>
          </div>

          <ProcessingSteps
            activeIndex={activeIndex}
            steps={STEPS.map((step) => ({
              key: step.key,
              label:
                step.key === "searching" && candidateCount !== null
                  ? `Found ${candidateCount} matching openings`
                  : step.label,
            }))}
          />
        </CardContent>
      </Card>
    </main>
  );
};
