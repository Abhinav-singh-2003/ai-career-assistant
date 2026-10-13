import api from "./api";
import type { Interview, InterviewEvaluation } from "../types/interview";

export async function generateInterview( role: string): Promise<Interview> {
    const response = await api.post<{
        message: string;
        interview: Interview;
    }>("/interviews/generate", { role });

    return response.data.interview;
}

export async function submitInterviewAnswer(interviewId: string, questionIndex: number, answer: string ): Promise<InterviewEvaluation> {
    const response = await api.post<{
        message: string;
        evaluation: InterviewEvaluation;
    }>(`/interviews/${interviewId}/answer`, { questionIndex, answer,});

    return response.data.evaluation;
}

export async function fetchMyInterviews() {
    const response = await api.get<{
        count: number;
        interviews: Interview[];
    }>("/interviews/my");

    return response.data;
}