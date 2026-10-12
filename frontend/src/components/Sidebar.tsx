import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function SideBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `block rounded-lg px-4 py-3 text-sm ${isActive
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-slate-800"
        }`;

    return (
        <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-950 p-5 text-white">
            <h1 className="text-xl font-bold">CareerPilot AI</h1>
            <p className="mb-8 mt-1 text-xs text-slate-400">
                Your career copilot
            </p>
            <nav className="flex-1 space-y-2">
                <NavLink to="/dashboard" className={linkClass}>
                    Dashboard
                </NavLink>
                <NavLink to="/resumes" className={linkClass}>
                    My Resumes
                </NavLink>
                <NavLink to="/job-matcher" className={linkClass}>
                    Job Matcher
                </NavLink>

                <NavLink to="/interviews" className={linkClass}>
                    Interview Practice
                </NavLink>
            </nav>

            <div className="border-t border-slate-700 pt-4">
                <p className="truncate text-sm">{user?.name ?? "User"}</p>
                <p className="mb-4 truncate text-xs text-slate-400">
                    {user?.email}
                </p>

                <button
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800"
                >
                    Log out
                </button>
            </div>
        </aside> 
    );
}

