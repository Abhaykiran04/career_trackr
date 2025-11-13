import React, { useEffect, useState, useMemo } from "react";
import JobForm from "../components/JobForm";
import JobCard from "../components/JobCard";
import FilterBar from "../components/FilterBar";
import { fetchJobs, createJob, updateJob, deleteJob } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // 🚀 Load jobs from backend ONLY
  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const serverJobs = await fetchJobs();
      setJobs(serverJobs);
    } catch (err) {
      toast.error("Backend offline — cannot load jobs");
      setJobs([]);  // if server is down
    }
    setLoading(false);
  }

  // ➕ Add job
  async function handleAdd(data) {
    if (processing) return;
    setProcessing(true);

    try {
      const created = await createJob(data);
      setJobs([created, ...jobs]);
      toast.success("Application added");
      setShowForm(false);
    } catch (err) {
      toast.error("Failed to add job");
    }

    setProcessing(false);
  }

  // ✏️ Update job
  async function handleUpdate(data) {
    if (processing) return;
    setProcessing(true);

    try {
      const updated = await updateJob(data.id, data);
      const updatedList = jobs.map(j => j.id === data.id ? updated : j);
      setJobs(updatedList);
      toast.success("Updated");
      setEditing(null);
    } catch (err) {
      toast.error("Failed to update");
    }

    setProcessing(false);
  }

  // 🗑 Delete job
  async function handleDelete(id) {
    if (!confirm("Delete this application?")) return;

    try {
      await deleteJob(id);
      const updated = jobs.filter(j => j.id !== id);
      setJobs(updated);
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed to delete from server");
    }
  }

  // 🔍 Filter + Search + Sort
  const filteredJobs = useMemo(() => {
    let res = [...jobs];

    if (filter !== "All") res = res.filter(j => j.status === filter);

    if (search) {
      const q = search.toLowerCase();
      res = res.filter(j =>
        (j.company + j.role).toLowerCase().includes(q)
      );
    }

    if (sort === "deadline") {
      res.sort(
        (a, b) => new Date(a.deadline || 999999999999) - new Date(b.deadline || 999999999999)
      );
    } else if (sort === "company") {
      res.sort((a, b) => a.company.localeCompare(b.company));
    } else {
      res.sort((a, b) => b.id - a.id);
    }

    return res;
  }, [jobs, filter, search, sort]);

  // 🎬 Animations
  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.97 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    exit: { opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.15 } },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold dark:text-white">Dashboard</h2>

        <button
          onClick={() => setShowForm(s => !s)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-purple-600 hover:to-blue-600 shadow-md transition-all"
        >
          {showForm ? "Close" : "Add Job"}
        </button>
      </div>

      {/* Job Form */}
      {showForm && (
        <div className="mb-4">
          <JobForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Filters */}
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      {/* Loading Spinner */}
      {loading ? (
        <div className="w-full flex items-center justify-center py-20">
          <svg className="w-10 h-10 animate-spin text-slate-600 dark:text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredJobs.map(job => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
              >
                <JobCard
                  job={job}
                  onDelete={handleDelete}
                  onEdit={(j) => {
                    setEditing(j);
                    setShowForm(false);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl"
          >
            <JobForm
              initial={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
