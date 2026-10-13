export interface JobMatch {
  _id?: string;
  resumeId?: string;
  jobTitle: string;
  jobDescription?: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}