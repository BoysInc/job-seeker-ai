"use client";

import { useCallback, useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import type { RecommendationsPoll } from "@/features/resume-upload/models/resume-upload.model";
import {
  findJobs as findJobsRequest,
  getJobRecommendations,
} from "@/features/resume-upload/services/resume-upload.service";
import { useResumeUploadStore } from "@/features/resume-upload/store/resume-upload.store";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

type MatchingSession = {
  promise: Promise<{ resumeId: string; fileName: string | null }>;
};

/** Dedupes the find-jobs trigger across Strict Mode remounts for the same target. */
const matchingSessions = new Map<string, MatchingSession>();

type StartMatchingOptions = {
  /** Resume to match; omit to let the backend use the user's active resume. */
  resumeId?: string;
  onComplete: (
    poll: RecommendationsPoll,
    resumeId: string,
    fileName: string | null
  ) => void;
  onFail: (message: string) => void;
};

/** Pure "find jobs for a resume" hook: triggers matching and polls until done. */
export const useJobMatching = () => {
  const { accessToken } = useAuth();
  const accessTokenRef = useRef(accessToken);
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const setProcessingPhase = useResumeUploadStore((state) => state.setProcessingPhase);
  const setCandidateCount = useResumeUploadStore((state) => state.setCandidateCount);
  const setJobs = useResumeUploadStore((state) => state.setJobs);
  const setSelectedJob = useResumeUploadStore((state) => state.setSelectedJob);
  const setJobSearchError = useResumeUploadStore((state) => state.setJobSearchError);
  const setJobSearchStatus = useResumeUploadStore((state) => state.setJobSearchStatus);

  const startMatching = useCallback(
    ({ resumeId, onComplete, onFail }: StartMatchingOptions): (() => void) => {
      const token = accessTokenRef.current;
      if (!token) {
        onFail("Please sign in before finding matching jobs.");
        return () => {};
      }

      let cancelled = false;
      let pollInterval: ReturnType<typeof setInterval> | null = null;
      let matchedFileName: string | null = null;
      const sessionKey = resumeId ?? "active";

      const stopPolling = () => {
        if (pollInterval !== null) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      };

      const fail = (message: string) => {
        if (cancelled) return;
        matchingSessions.delete(sessionKey);
        stopPolling();
        setProcessingPhase(null);
        setJobSearchStatus("error");
        setJobSearchError(message);
        onFail(message);
      };

      const pollOnce = async (targetResumeId: string, startedAt: number) => {
        if (cancelled) return;
        const currentToken = accessTokenRef.current;
        if (!currentToken) return;

        try {
          const poll = await getJobRecommendations(targetResumeId, currentToken);
          if (cancelled) return;

          setProcessingPhase(poll.status);
          setCandidateCount(poll.candidateCount);

          if (poll.status === "failed") {
            fail(poll.error ?? "We could not match your resume to jobs right now.");
            return;
          }

          if (poll.status === "complete") {
            matchingSessions.delete(sessionKey);
            stopPolling();
            const jobs = poll.jobs ?? [];
            setJobs(jobs);
            setSelectedJob(null);
            setJobSearchError(null);
            setJobSearchStatus("success");
            onComplete(poll, targetResumeId, matchedFileName);
            return;
          }
        } catch {
          // Transient poll errors are retried until the timeout below.
        }

        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          fail("Job matching is taking too long. Please try again.");
        }
      };

      const startPolling = (targetResumeId: string) => {
        const startedAt = Date.now();
        void pollOnce(targetResumeId, startedAt);
        pollInterval = setInterval(() => {
          void pollOnce(targetResumeId, startedAt);
        }, POLL_INTERVAL_MS);
      };

      let session = matchingSessions.get(sessionKey);
      if (!session) {
        setJobSearchError(null);
        setJobSearchStatus("searching");
        setCandidateCount(null);
        setProcessingPhase("extracting");

        session = {
          promise: findJobsRequest(token, resumeId).then((started) => ({
            resumeId: started.resumeId,
            fileName: started.fileName,
          })),
        };
        matchingSessions.set(sessionKey, session);
      }

      void (async () => {
        try {
          const { resumeId: startedResumeId, fileName } = await session!.promise;
          if (cancelled) return;

          matchedFileName = fileName;
          startPolling(startedResumeId);
        } catch (error) {
          matchingSessions.delete(sessionKey);
          fail(
            error instanceof Error
              ? error.message
              : "We could not start job matching right now."
          );
        }
      })();

      return () => {
        cancelled = true;
        stopPolling();
      };
    },
    [
      setCandidateCount,
      setJobSearchError,
      setJobSearchStatus,
      setJobs,
      setProcessingPhase,
      setSelectedJob,
    ]
  );

  return { startMatching };
};
