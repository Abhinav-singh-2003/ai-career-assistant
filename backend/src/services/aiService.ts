    import OpenAI from "openai";//23,28,33
    
    //used for open but it is paid so used openrouter..
    // const openai= new OpenAI({
    //     apiKey: process.env.OPENAI_API_KEY
    // });

    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1"
    });


//resume analysis interface and function to analyze resume's skills, strengths, weaknesses and suggestions using AI
    export interface ResumeAnalysis {
        summary: string;
        skills: string[];
        strengths: string[];
        weaknesses: string[];
        suggestions: string[]
    }

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

        const response = await openai.chat.completions.create({
            // model: "gpt-4o-mini", used for openai
            model: "openrouter/free",
            messages:[
                {
                    role:"system",
                    content: "you are professional resume analyzer"
                },
                {
                    role:"user",
                    content :prompt
                }
            ],
            temperature:0.2
        });

        const content =response.choices[0]?.message?.content;
            if(!content){
                throw new Error("AI returned an empty response");
            }
        try {
            return JSON.parse(content) as ResumeAnalysis;
        }
        catch{
            throw new Error("AI returned invalid JSON");
        }

    };


    //job match result interface and function to match resume with job description

    export interface JobMatchResult {
            matchPercentage: number;
            matchingSkills: string[];
            missingSkills: string[];
            suggestions: string[];
    }

    export const MatchResumeWithJob = async(resumeText:String, jobDescription:String): Promise<JobMatchResult>=>{
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

            RESUME:${resumeText}   JOB DESCRIPTION:${jobDescription}`;


        const response = await openai.chat.completions.create({
            model: "openrouter/free",
            messages:[
                {
                    role:"system",
                    content:"you are an expert technical recruiter"
                },
                {
                    role:"user",
                    content:prompt

                }
            ],
            temperature:0.2
        });

        const content=response.choices[0]?.message?.content;
        if(!content){
            throw new Error("AI returned an empty response");
        }
        try{
            return JSON.parse(content) as JobMatchResult;
        }catch{
            throw new Error("AI returned Invalid json");
        }
    };


    //interview question interface and function to generate interview questions for a given role using AI
    export interface InterviewQuestion{
        question: string;
        category: string;
        difficulty: "easy" | "medium" | "hard";
    }
    export const generateInterviewQuestions = async(role:string): Promise<InterviewQuestion[]> => {
        const prompt=
                `You are an expert technical interviewer.

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

        const response =await openai.responses.create({
                model: "openrouter/free",
                input:[
                    {
                        role:"system",
                        content:"You are an expert technical interviewer."
                    },
                    {
                        role:"user",
                        content:prompt
                    }    
                ],
                    temperature:0.2

            });

            const content = response.output_text;
            if(!content){
                throw new Error("AI returned an empty response");
            }

            try{
                const parsed = JSON.parse(content);
                return parsed.questions as InterviewQuestion[];
            } catch {
                throw new Error(
                    "AI returned invalid Interview Question JSON"                  
                );
        }
    };
