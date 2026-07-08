import { getBearerToken, unauthorizedResponse } from "@/app/api/_lib/auth";
import type { JobSearchRequest } from "@/features/resume-upload/models/job-search.model";
import { jobSearchSchema } from "@/features/resume-upload/schemas/job-search.schema";
import { searchJobsFromBackend } from "@/features/resume-upload/services/jobs-search-backend.service";

export async function POST(request: Request) {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return unauthorizedResponse();
  }

  const validation = jobSearchSchema.safeParse(await request.json());

  if (!validation.success) {
    return Response.json(
      { message: validation.error.issues[0]?.message ?? "Invalid job search." },
      { status: 400 }
    );
  }

  const searchRequest: JobSearchRequest = validation.data;

  try {
    const jobs = await searchJobsFromBackend(searchRequest, accessToken);
    return Response.json(jobs);
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Could not search jobs right now.",
      },
      { status: 502 }
    );
  }
}
