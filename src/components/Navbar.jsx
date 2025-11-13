import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import toast from "react-hot-toast";
import { loadDemoJobs } from "../utils/api";

export default function Navbar() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  async function handleDemo() {
    if (demoLoading) return;
    if (!confirm("Load demo data? This will replace current list.")) return;

    try {
      setDemoLoading(true);
      await loadDemoJobs();
      toast.success("Demo data loaded 🎉");
      // reload to ensure Dashboard reads server (keeps code simple)
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load demo data — using local fallback");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">C</div>
          <div>
            <h1 className="text-lg font-semibold text-white">CareerTrackr</h1>
            <p className="text-xs text-white/80">Manage your internship & job applications</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDemo}
            disabled={demoLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-md hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {demoLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-sm">Loading...</span>
              </>
            ) : (
              <span className="text-sm">Demo</span>
            )}
          </button>

          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-md hover:bg-white/20 text-white"
            aria-label="Toggle theme"
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
