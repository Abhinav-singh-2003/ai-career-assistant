import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Dashboard(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/login", { replace: true });
    };

     return (
    <div className="min-h-screen bg-gray-100">

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-xl font-bold">
            AI Career Assistant
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Logout
          </button>

        </div>

      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <h2 className="text-3xl font-bold">
          Welcome, {user?.name}
        </h2>

        <p className="mt-2 text-gray-500">
          Your career dashboard
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold">
              Resume Analyzer
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Analyze your resume with AI.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold">
              Job Matcher
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Compare your resume with jobs.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold">
              Interview Practice
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Practice interviews with AI.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}
