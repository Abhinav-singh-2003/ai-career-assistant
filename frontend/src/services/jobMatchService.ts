import api from "./api";
import type { JobMatch } from "../types/jobMatch";

interface CreateJobMatchInput {
  resumeId: string;
  jobTitle: string;
  jobDescription: string;
}

interface CreateJobMatchResponse {
  message: string;
  match: JobMatch;
}

export async function createJobMatch(
  input: CreateJobMatchInput
): Promise<JobMatch> {
  const response = await api.post<CreateJobMatchResponse>(
    "/job-matches",
    input
  );

 
  return response.data.match;
}