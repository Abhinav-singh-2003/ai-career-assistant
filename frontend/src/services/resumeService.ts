import api from "./api";
import type { Resume, ResumeAnalysis } from "../types/resume";

export async function fetchMyResumes() {
   const response = await api.get<{ count: Number; resumes: Resume[]; }>("/resumes/my");
   return response.data;
}

export async function uploadResume(file: File, title?: string) {
   const formData = new FormData();
   formData.append("resume", file);

   if (title?.trim()) {
      formData.append("title", title.trim());
   }
   const response = await api.post<{ message: string; resume: Resume }>("/resumes", formData);
   return response.data;

}

export async function analyzeResume(resumeId: string) {
   const response = await api.post<{
      message: string;
      analysis: ResumeAnalysis;
   }>(`/resumes/${resumeId}/analyze`);

   return response.data;
}
