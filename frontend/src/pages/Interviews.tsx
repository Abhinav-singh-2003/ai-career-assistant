import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { generateInterview, submitInterviewAnswer,} from "../services/interviewService";
import type { Interview, InterviewEvaluation,} from "../types/interview";

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? error.message;
    }

    return error instanceof Error? error.message: "Something went wrong.";
}

export default function Interviews() {
    const [role, setRole] = useState("");
    const [interview, setInterview] = useState<Interview | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [evaluations, setEvaluations] = useState< Record<number, InterviewEvaluation>>({});
    const [generating, setGenerating] = useState(false);
    const [submittingIndex, setSubmittingIndex] = useState<number | null>(null);
    const [error, setError] = useState("");

    async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setInterview(null);
        setAnswers({});
        setEvaluations({});

        if (role.trim().length < 2) {
            setError("Please enter a job role with at least 2 characters.");
            return;
        }

        setGenerating(true);

        try {
            const result = await generateInterview(role.trim());

            if (!result.questions?.length) {
                setError("No questions were returned. Please try again.");
                return;
            }

            setInterview(result);
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setGenerating(false);
        }
    }

    async function handleSubmitAnswer(questionIndex: number) {
        if (!interview) return;

        const answer = answers[questionIndex]?.trim() ?? "";

        if (answer.length < 10) {
            setError("Your answer must contain at least 10 characters.");
            return;
        }

        setError("");
        setSubmittingIndex(questionIndex);

        try {
            const evaluation = await submitInterviewAnswer(
                interview._id,
                questionIndex,
                answer
            );

            setEvaluations((previous) => ({...previous,[questionIndex]: evaluation,}));

            // Keep the interview's saved answers in sync with the UI.
            setInterview((previous) => {
                if (!previous) return previous;

                const updatedAnswers = previous.answers.filter(
                    (item) => item.questionIndex !== questionIndex
                );

                updatedAnswers.push({
                    questionIndex,
                    answer,
                    ...evaluation,
                });

                return {
                    ...previous,
                    answers: updatedAnswers,
                };
            });
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setSubmittingIndex(null);
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="min-w-0 flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Interview Practice
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Practice realistic interview questions and improve your answers
                            with AI feedback.
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
                            Start a practice interview
                        </h2>

                        <form onSubmit={handleGenerate} className="mt-5 space-y-4">
                            <div>
                                <label
                                    htmlFor="role"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Target job role
                                </label>

                                <input
                                    id="role"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    placeholder="e.g. Junior Backend Developer"
                                    maxLength={100}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={generating}
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {generating
                                    ? "Generating questions..."
                                    : "Generate interview"}
                            </button>
                        </form>
                    </section>

                    {interview && (
                        <section className="mt-8">
                            <div className="mb-5">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {interview.role} interview
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {interview.questions.length} questions generated. Answer
                                    each question and submit it to receive feedback.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {interview.questions.map((question, index) => {
                                    const evaluation = evaluations[index];
                                    const isSubmitting = submittingIndex === index;

                                    return (
                                        <article
                                            key={`${interview._id}-${index}`}
                                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    Question {index + 1}
                                                </span>

                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                                    {question.category}
                                                </span>

                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-600">
                                                    {question.difficulty}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-semibold leading-7 text-slate-900">
                                                {question.question}
                                            </h3>

                                            <label
                                                htmlFor={`answer-${index}`}
                                                className="mb-2 mt-5 block text-sm font-medium text-slate-700"
                                            >
                                                Your answer
                                            </label>

                                            <textarea
                                                id={`answer-${index}`}
                                                value={answers[index] ?? ""}
                                                onChange={(event) =>
                                                    setAnswers((previous) => ({
                                                        ...previous,
                                                        [index]: event.target.value,
                                                    }))
                                                }
                                                disabled={Boolean(evaluation) || isSubmitting}
                                                rows={5}
                                                maxLength={5000}
                                                placeholder="Explain your approach and include a relevant example..."
                                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-50"
                                            />

                                            {!evaluation && (
                                                <button
                                                    type="button"
                                                    onClick={() => void handleSubmitAnswer(index)}
                                                    disabled={isSubmitting}
                                                    className="mt-4 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                                                >
                                                    {isSubmitting
                                                        ? "Evaluating..."
                                                        : "Submit answer"}
                                                </button>
                                            )}

                                            {evaluation && (
                                                <div className="mt-6 border-t border-slate-200 pt-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-700">
                                                            {evaluation.score}/10
                                                        </div>

                                                        <div>
                                                            <h4 className="font-semibold text-slate-900">
                                                                Your feedback
                                                            </h4>
                                                            <p className="text-sm text-slate-500">
                                                                Use this feedback to refine your next answer.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                                        <FeedbackList
                                                            title="Strengths"
                                                            items={evaluation.strengths}
                                                        />

                                                        <FeedbackList
                                                            title="Areas to improve"
                                                            items={evaluation.improvements}
                                                        />
                                                    </div>

                                                    <div className="mt-5 rounded-xl bg-blue-50 p-4">
                                                        <h4 className="font-semibold text-slate-900">
                                                            Example answer
                                                        </h4>
                                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                                            {evaluation.idealAnswer}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

function FeedbackList({
    title,
    items,
}: {
    title: string;
    items: string[];
}) {
    return (
        <div>
            <h4 className="mb-3 font-semibold text-slate-900">{title}</h4>

            {items.length === 0 ? (
                <p className="text-sm text-slate-500">No feedback items returned.</p>
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