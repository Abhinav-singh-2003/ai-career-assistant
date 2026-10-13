import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { createJobMatch } from "../services/jobMatchService";
import type { Resume } from "../types/resume";
import type { JobMatch } from "../types/jobMatch";

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? error.message;
    }

    return error instanceof Error ? error.message : "Something went wrong.";
}

export default function JobMatcher() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [resumeId, setResumeId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<JobMatch | null>(null);

    useEffect(() => {
        async function loadResumes() {
            try {
                const response = await api.get<{ resumes: Resume[] }>(
                    "/resumes/my"
                );

                setResumes(response.data.resumes);
            } catch (err: unknown) {
                setError(getErrorMessage(err));
            } finally {
                setLoadingResumes(false);
            }
        }

        void loadResumes();
    }, []);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setResult(null);

        if (!resumeId) {
            setError("Please select a resume.");
            return;
        }

        if (jobTitle.trim().length < 2) {
            setError("Please enter a valid job title.");
            return;
        }

        if (jobDescription.trim().length < 50) {
            setError(
                "Please enter a more detailed job description (at least 50 characters)."
            );
            return;
        }

        setSubmitting(true);

        try {
            const match = await createJobMatch({
                resumeId,
                jobTitle: jobTitle.trim(),
                jobDescription: jobDescription.trim(),
            });

            setResult(match);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="min-w-0 flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Job Matcher
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Compare your resume with a job and discover where you can improve.
                        </p>
                    </header>

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Analyze a job description
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <div>
                                <label
                                    htmlFor="resume"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Select resume
                                </label>

                                <select
                                    id="resume"
                                    value={resumeId}
                                    onChange={(event) => setResumeId(event.target.value)}
                                    disabled={loadingResumes || resumes.length === 0}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    <option value="">
                                        {loadingResumes
                                            ? "Loading resumes..."
                                            : resumes.length === 0
                                                ? "Upload a resume first"
                                                : "Choose a resume"}
                                    </option>

                                    {resumes.map((resume) => (
                                        <option key={resume._id} value={resume._id}>
                                            {resume.title}
                                        </option>
                                    ))}
                                </select>

                                {!loadingResumes && resumes.length === 0 && (
                                    <p className="mt-2 text-sm text-slate-500">
                                        Upload a PDF on the My Resumes page before continuing.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="jobTitle"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Job title
                                </label>

                                <input
                                    id="jobTitle"
                                    value={jobTitle}
                                    onChange={(event) => setJobTitle(event.target.value)}
                                    placeholder="e.g. Junior React Developer"
                                    maxLength={100}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="jobDescription"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Job description
                                </label>

                                <textarea
                                    id="jobDescription"
                                    value={jobDescription}
                                    onChange={(event) =>
                                        setJobDescription(event.target.value)
                                    }
                                    placeholder="Paste the responsibilities, requirements, skills, and qualifications from the job posting..."
                                    rows={9}
                                    maxLength={15000}
                                    className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />

                                <p className="mt-1 text-right text-xs text-slate-500">
                                    {jobDescription.length}/15000 characters
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    loadingResumes ||
                                    resumes.length === 0
                                }
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "Analyzing job..." : "Analyze match"}
                            </button>
                        </form>
                    </section>

                    {result && (
                        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900">
                                Match report
                            </h2>

                            <div className="mt-5 flex flex-wrap items-center gap-5">
                                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-blue-500">
                                    <span className="text-2xl font-bold text-slate-900">
                                        {result.matchPercentage}%
                                    </span>
                                    <span className="text-xs text-slate-500">Match</span>
                                </div>

                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {result.jobTitle || jobTitle}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Based on the selected resume and the supplied job description.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 grid gap-6 md:grid-cols-2">
                                <ResultList
                                    title="Matching skills"
                                    items={result.matchingSkills}
                                />

                                <ResultList
                                    title="Missing skills"
                                    items={result.missingSkills}
                                />

                                <div className="md:col-span-2">
                                    <ResultList
                                        title="Suggestions for improvement"
                                        items={result.suggestions}
                                    />
                                </div>
                            </div>

                            <p className="mt-6 text-xs leading-5 text-slate-500">
                                AI-generated assessments are estimates, not guarantees of
                                hiring outcomes. Review suggestions carefully and only add
                                skills or experience that accurately reflect your background.
                            </p>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

function ResultList({
    title,
    items,
}: {
    title: string;
    items: string[];
}) {
    return (
        <div>
            <h3 className="mb-3 font-semibold text-slate-900">{title}</h3>

            {items.length === 0 ? (
                <p className="text-sm text-slate-500">
                    No items returned.
                </p>
            ) : (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={`${index}-${item}`}
                            className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}