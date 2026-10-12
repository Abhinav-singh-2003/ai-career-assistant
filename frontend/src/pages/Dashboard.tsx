import { useAuth } from "../context/AuthContext";
import SideBar from "../components/Sidebar";

export default function Dashboard(){
    const { user } = useAuth();

     return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="min-w-0 flex-1">
        <header className="border-b bg-white px-6 py-4">
          <h1 className="text-xl font-bold">AI Career Assistant</h1>
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
    </div>
  );
}
