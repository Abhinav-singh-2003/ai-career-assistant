export interface ResumeAnalysis {
    summary: string;
    skills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}
export declare const analyzeResume: (resumeText: string) => Promise<ResumeAnalysis>;
export interface JobMatchResult {
    matchPercentage: number;
    matchingSkills: string[];
    missingSkills: string[];
    suggestions: string[];
}
export declare const MatchResumeWithJob: (resumeText: String, jobDescription: String) => Promise<JobMatchResult>;
export interface InterviewQuestion {
    question: string;
    category: string;
    difficulty: "easy" | "medium" | "hard";
}
export declare const generateInterviewQuestions: (role: string) => Promise<InterviewQuestion[]>;
export interface InterviewEvaluation {
    score: number;
    strengths: string[];
    improvements: string[];
    idealAnswer: string;
}
export declare const evaluateInterviewAnswer: (question: string, answer: string, role: string) => Promise<InterviewEvaluation>;
//# sourceMappingURL=aiService.d.ts.map