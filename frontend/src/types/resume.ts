export interface Resume{
    _id: string;
    title: string;
    fileUrl?: string;
    createdAt: string;
}

export interface ResumeAnalysis{
    summary: string;
    skills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}