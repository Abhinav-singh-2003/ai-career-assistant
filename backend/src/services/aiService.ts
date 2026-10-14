    import OpenAI from "openai";//23,28,33,38
    
    //used for open but it is paid so used openrouter..
    // const openai= new OpenAI({
    //     apiKey: process.env.OPENAI_API_KEY
    // });

    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        timeout: 90_000,
        maxRetries: 2
    });
    const model = process.env.OPENROUTER_MODEL?.trim() || "openrouter/free";

    const parseJsonResponse = <T>(content: string | Array<{ text?: string }> | null | undefined, errorMessage: string): T => {
        const rawContent = typeof content === "string"
            ? content
            : Array.isArray(content)
                ? content.map((part) => typeof part === "string" ? part : (part?.text ?? "")).join("")
                : "";

        if (!rawContent || !rawContent.trim()) {
            throw new Error(errorMessage);
        }

        const trimmed = rawContent.trim();
        const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
        const candidate = fencedMatch?.[1]?.trim() ?? trimmed;
        const startIndex = candidate.indexOf("{");

        try {
            return JSON.parse(candidate) as T;
        } catch (directParseError) {
            if (startIndex >= 0) {
                let depth = 0;
                let inString = false;
                let escaped = false;

                for (let index = startIndex; index < candidate.length; index += 1) {
                    const character = candidate[index];

                    if (inString) {
                        if (escaped) {
                            escaped = false;
                        } else if (character === "\\") {
                            escaped = true;
                        } else if (character === "\"") {
                            inString = false;
                        }
                        continue;
                    }

                    if (character === "\"") {
                        inString = true;
                    } else if (character === "{") {
                        depth += 1;
                    } else if (character === "}") {
                        depth -= 1;
                        if (depth === 0) {
                            try {
                                return JSON.parse(candidate.slice(startIndex, index + 1)) as T;
                            } catch (extractedParseError) {
                                throw new Error(errorMessage, { cause: extractedParseError });
                            }
                        }
                    }
                }
            }

            throw new Error(errorMessage, { cause: directParseError });
        }
    };

    const isRecord = (value: unknown): value is Record<string, unknown> =>
        typeof value === "object" && value !== null && !Array.isArray(value);

    const requestJsonCompletion = async <T>(
        systemPrompt: string,
        prompt: string,
        errorMessage: string,
        validate: (value: unknown) => T
    ): Promise<T> => {
        let lastError: unknown;
        let lastFinishReason: string | null = null;

        for (let attempt = 0; attempt < 2; attempt += 1) {
            const response = await openai.chat.completions.create({
                model,
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: `${systemPrompt} Return one valid JSON object only. Do not include markdown.`
                    },
                    {
                        role: "user",
                        content: attempt === 0
                            ? prompt
                            : `${prompt}\n\nYour previous response was invalid. Return a complete JSON object matching the required structure exactly.`
                    }
                ],
                temperature: 0.2
            });

            const choice = response.choices[0];
            lastFinishReason = choice?.finish_reason ?? null;

            try {
                return validate(parseJsonResponse<unknown>(
                    choice?.message?.content,
                    `${errorMessage}: AI returned an empty or invalid JSON response`
                ));
            } catch (error) {
                lastError = error;
            }
        }

        const finishReason = lastFinishReason ? ` (finish reason: ${lastFinishReason})` : "";
        throw new Error(`${errorMessage} after retry${finishReason}`, {
            cause: lastError
        });
    };


//resume analysis interface and function to analyze resume's skills, strengths, weaknesses and suggestions using AI
    export interface ResumeAnalysis {
        summary: string;
        skills: string[];
        strengths: string[];
        weaknesses: string[];
        suggestions: string[]
    }

    const isStringArray = (value: unknown): value is string[] =>
        Array.isArray(value) && value.every((item): item is string => typeof item === "string");

    const validateResumeAnalysis = (value: unknown): ResumeAnalysis => {
        const analysis = isRecord(value) ? value : null;
        if (
            !analysis
            || typeof analysis.summary !== "string"
            || !isStringArray(analysis.skills)
            || !isStringArray(analysis.strengths)
            || !isStringArray(analysis.weaknesses)
            || !isStringArray(analysis.suggestions)
        ) {
            throw new Error("AI returned JSON with an unexpected resume analysis structure");
        }
        return {
            summary: analysis.summary,
            skills: analysis.skills,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions
        };
    };

    export const analyzeResume = async(resumeText:string): Promise<ResumeAnalysis>=>{
    
        const prompt = `You are an expert technical resume reviewer.

            Analyze the following resume.

            Return ONLY valid JSON using exactly this structure:

            {
            "summary": "short summary of the candidate",
            "skills": ["skill1", "skill2"],
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "suggestions": ["suggestion1", "suggestion2"]
            }

            Resume: ${resumeText}`;

        return requestJsonCompletion(
            "You are an expert technical resume reviewer.",
            prompt,
            "Resume analysis failed",
            validateResumeAnalysis
        );

    };


    //job match result interface and function to match resume with job description

    export interface JobMatchResult {
            matchPercentage: number;
            matchingSkills: string[];
            missingSkills: string[];
            suggestions: string[];
    }

    const validateJobMatchResult = (value: unknown): JobMatchResult => {
        const result = isRecord(value) ? value : null;
        if (
            !result
            || typeof result.matchPercentage !== "number"
            || !Number.isFinite(result.matchPercentage)
            || result.matchPercentage < 0
            || result.matchPercentage > 100
            || !isStringArray(result.matchingSkills)
            || !isStringArray(result.missingSkills)
            || !isStringArray(result.suggestions)
        ) {
            throw new Error("AI returned JSON with an unexpected job match structure");
        }
        return {
            matchPercentage: result.matchPercentage,
            matchingSkills: result.matchingSkills,
            missingSkills: result.missingSkills,
            suggestions: result.suggestions
        };
    };

    export const MatchResumeWithJob = async(resumeText: string, jobDescription: string): Promise<JobMatchResult>=>{
        const prompt=`
            You are an expert technical recruiter.

            Compare the candidate's resume with the job description.

            Return ONLY valid JSON using exactly this structure:

            {
            "matchPercentage": 0,
            "matchingSkills": [],
            "missingSkills": [],
            "suggestions": []
            }

            Rules:

            - matchPercentage must be a number from 0 to 100.
            - matchingSkills should contain skills found in both the resume and job description.
            - missingSkills should contain important skills from the job description that are not demonstrated in the resume.
            - suggestions should contain practical ways the candidate could improve their resume for this job.
            - Do not invent experience that is not present in the resume.

            RESUME:
            ${resumeText}

            JOB DESCRIPTION:
            ${jobDescription}`;

        return requestJsonCompletion(
            "You are an expert technical recruiter comparing a resume to a job description.",
            prompt,
            "Job matching failed",
            validateJobMatchResult
        );
    };


    //interview question interface and function to generate interview questions for a given role using AI
    export interface InterviewQuestion{
        question: string;
        category: string;
        difficulty: "easy" | "medium" | "hard";
    }

    const validateInterviewQuestions = (value: unknown): InterviewQuestion[] => {
        const questionList = isRecord(value) ? value.questions : null;
        if (
            !Array.isArray(questionList)
            || questionList.length !== 5
            || !questionList.every((question) =>
                isRecord(question)
                && typeof question.question === "string"
                && typeof question.category === "string"
                && (question.difficulty === "easy" || question.difficulty === "medium" || question.difficulty === "hard")
            )
        ) {
            throw new Error("AI returned JSON with an unexpected interview question structure");
        }

        return questionList.map((question) => ({
            question: question.question,
            category: question.category,
            difficulty: question.difficulty
        }));
    };

    export const generateInterviewQuestions = async(role:string): Promise<InterviewQuestion[]> => {
        const prompt = `You are an expert technical interviewer.

                Generate 5 interview questions for the following job role:

                ROLE:
                ${role}

                The questions should test a realistic combination of:
                - technical knowledge
                - problem solving
                - practical experience
                - system/design thinking when appropriate

                Return ONLY valid JSON using exactly this structure:

                {
                "questions": [
                    {
                    "question": "Question text",
                    "category": "React",
                    "difficulty": "medium"
                    }
                ]
                }

                Rules:

                - Generate exactly 5 questions.
                - difficulty must be "easy", "medium", or "hard".
                - category should describe the topic.
                - Questions should be relevant to the specified role.
                - Do not include answers.`;

        return requestJsonCompletion(
            "You are an expert technical interviewer.",
            prompt,
            "Interview question generation failed",
            validateInterviewQuestions
        );
    };


//function to evaluate interview answer for a given question using AI
export interface InterviewEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  idealAnswer: string;
}

const validateInterviewEvaluation = (value: unknown): InterviewEvaluation => {
    const evaluation = isRecord(value) ? value : null;
    if (
        !evaluation
        || typeof evaluation.score !== "number"
        || !Number.isFinite(evaluation.score)
        || evaluation.score < 0
        || evaluation.score > 10
        || !isStringArray(evaluation.strengths)
        || !isStringArray(evaluation.improvements)
        || typeof evaluation.idealAnswer !== "string"
    ) {
        throw new Error("AI returned JSON with an unexpected interview evaluation structure");
    }

    return {
        score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        idealAnswer: evaluation.idealAnswer
    };
};

export const evaluateInterviewAnswer = async(question: string, answer: string , role: string): Promise<InterviewEvaluation> => {
    const prompt = `
        You are an expert technical interviewer.
        Evaluate a candidate's answer to an interview question.

        ROLE:
        ${role}

        QUESTION:
        ${question}

        CANDIDATE ANSWER:
        ${answer}

        Return ONLY valid JSON using exactly this structure:

        {
        "score": 0,
        "strengths": [],
        "improvements": [],
        "idealAnswer": ""
        }

        Rules:

        - score must be a number from 0 to 10.
        - Evaluate technical correctness, completeness, clarity, and practical understanding.
        - strengths should identify what the candidate did well.
        - improvements should identify specific things the candidate should improve.
        - idealAnswer should be a concise example of a strong answer.
        - Do not give a perfect score unless the answer is genuinely excellent.
        `;

        return requestJsonCompletion(
            "You are an expert technical interviewer.",
            prompt,
            "Interview answer evaluation failed",
            validateInterviewEvaluation
        );
};