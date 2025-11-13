import React from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function JobCard({ job, onDelete, onEdit }) {
  return (
   <motion.div
  layout
  whileHover={{ y: -5, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-md flex items-center justify-center bg-slate-100 dark:bg-slate-700 overflow-hidden">
          {job.logo ? <img src={job.logo} alt="logo" className="object-cover w-full h-full" /> : <span className="text-sm font-bold">{job.company?.[0] || "C"}</span>}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{job.role}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300">{job.company}</p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}</div>
          </div>

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{job.notes}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className={`px-2 py-1 rounded text-xs ${statusColor(job.status)}`}>{job.status}</span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => onEdit(job)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"><FaEdit /></button>
              <button onClick={() => onDelete(job.id)} className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900"><FaTrash /></button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function statusColor(status){
  switch(status){
    case "Applied": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30";
    case "Interview": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30";
    case "Offer": return "bg-green-100 text-green-700 dark:bg-green-900/30";
    case "Rejected": return "bg-red-100 text-red-700 dark:bg-red-900/30";
    default: return "bg-gray-100 text-gray-700";
  }
}
