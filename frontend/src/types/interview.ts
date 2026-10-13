export interface InterviewQuestion {
    question: string;
    category: string;
    difficulty: "easy" | "medium" | "hard";
}

export interface InterviewAnswer {
    questionIndex: number;
    answer: string;
    score?: number;
    strengths?: string[];
    improvements?: string[];
    idealAnswer?: string;
}

export interface Interview {
    _id: string;
    role: string;
    questions: InterviewQuestion[];
    answers: InterviewAnswer[];
    createdAt?: string;
}

export interface InterviewEvaluation {
    score: number;
    strengths: string[];
    improvements: string[];
    idealAnswer: string;
}