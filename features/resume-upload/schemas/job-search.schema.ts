import { z } from "zod";

import {
  DEFAULT_JOB_LOCATION,
  DEFAULT_JOB_SEARCH_LIMIT,
} from "@/features/resume-upload/models/job-search.model";

export const jobSearchSchema = z.object({
  title: z.string().trim().min(1, "Please enter a job title to search."),
  location: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || DEFAULT_JOB_LOCATION),
  limit: z
    .number()
    .int()
    .positive()
    .max(25)
    .optional()
    .default(DEFAULT_JOB_SEARCH_LIMIT),
});
