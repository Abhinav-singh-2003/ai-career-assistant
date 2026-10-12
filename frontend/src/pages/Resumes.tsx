import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/Sidebar";
import { analyzeResume, fetchMyResumes, uploadResume } from "../services/resumeService";
import type { Resume, ResumeAnalysis } from "../types/resume";

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? error.message;
    }
    return error instanceof Error
        ? error.message
        : "Something went wrong.";
}
export default function Resumes() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [analysisTitle, setAnalysisTitle] = useState("");

    async function loadResumes() {
        setLoading(true);
        setError("");
        try {
            const data = await fetchMyResumes();
            setResumes(data.resumes);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        void loadResumes();
    }, []);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0] ?? null;

        setError("");
        setAnalysis(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }
        if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
            setError("Please select a PDF file.");
            setFile(null);
            event.target.value = "";
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("The file must be 5 MB or smaller.");
            setFile(null);
            event.target.value = "";
            return;
        }

        setFile(selectedFile);
    }

    async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!file) {
            setError("Please choose a PDF resume first.");
            return;
        }
        setUploading(true);
        setError("");
        setAnalysis(null);
        try {
            await uploadResume(file, title);
            setFile(null);
            setTitle("");

            // Refresh the list after a successful upload.
            await loadResumes();
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setUploading(false);
        }
    }

    async function handleAnalyze(resume: Resume) {
        setAnalyzingId(resume._id);
        setError("");
        setAnalysis(null);
        setAnalysisTitle("");
        try {
            const result = await analyzeResume(resume._id);
            setAnalysis(result.analysis);
            setAnalysisTitle(resume.title);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setAnalyzingId(null);
        }
    }
    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideBar />

            <main className="min-w-0 flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            My Resumes
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Upload your resume and get personalized AI feedback.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Upload a resume
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            PDF format only, up to 5 MB.
                        </p>

                        <form onSubmit={handleUpload} className="mt-5 space-y-4">
                            <div>
                                <label
                                    htmlFor="resume-title"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Resume title (optional)
                                </label>

                                <input
                                    id="resume-title"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="e.g. Software Engineer Resume"
                                    maxLength={100}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="resume-file"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    PDF file
                                </label>

                                <input
                                    id="resume-file"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    className="block w-full rounded-lg border border-slate-300 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700"
                                />

                                {file && (
                                    <p className="mt-2 text-sm text-slate-500">
                                        Selected: {file.name}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload resume"}
                            </button>
                        </form>
                    </section>

                    <section className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Your uploaded resumes
                            </h2>

                            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
                                {resumes.length} total
                            </span>
                        </div>

                        {loading ? (
                            <p className="text-slate-500">Loading your resumes...</p>
                        ) : resumes.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                                <p className="font-medium text-slate-700">
                                    No resumes uploaded yet
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Upload your first PDF above to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume._id}
                                        className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="break-words font-semibold text-slate-900">
                                                {resume.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Uploaded{" "}
                                                {new Date(resume.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => void handleAnalyze(resume)}
                                            disabled={analyzingId !== null}
                                            className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {analyzingId === resume._id
                                                ? "Analyzing..."
                                                : "Analyze resume"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {analysis && (
                        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-blue-700">
                                AI analysis
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {analysisTitle}
                            </h2>

                            <p className="mt-4 leading-7 text-slate-600">
                                {analysis.summary}
                            </p>

                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                <AnalysisList
                                    title="Skills identified"
                                    items={analysis.skills}
                                />

                                <AnalysisList
                                    title="Strengths"
                                    items={analysis.strengths}
                                />

                                <AnalysisList
                                    title="Areas to improve"
                                    items={analysis.weaknesses}
                                />

                                <AnalysisList
                                    title="Suggestions"
                                    items={analysis.suggestions}
                                />
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

interface AnalysisListProps {
    title: string;
    items: string[];
}

function AnalysisList({ title, items }: AnalysisListProps) {
    return (
        <div>
            <h3 className="mb-3 font-semibold text-slate-900">{title}</h3>

            {items.length === 0 ? (
                <p className="text-sm text-slate-500">No items returned.</p>
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




