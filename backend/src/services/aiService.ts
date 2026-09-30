import OpenAI from "openai";//23
 
//used for open but it is paid so used openrouter..
// const openai= new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

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