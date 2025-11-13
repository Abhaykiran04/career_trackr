import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  company: yup.string().required("Company is required"),
  role: yup.string().required("Role is required"),
  deadline: yup.date().nullable(),
  status: yup.string().required()
});

export default function JobForm({ onSubmit, initial = {}, onCancel }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company: "",
      role: "",
      deadline: "",
      status: "Applied",
      notes: "",
      logo: "",
      ...initial
    }
  });

  useEffect(() => { reset({ ...initial }); }, [initial, reset]);

  async function submit(data) {
    try {
      await onSubmit({ ...data, id: initial.id }); // keep id if editing
      toast.success("Saved");
      reset();
    } catch (err) {
      toast.error("Could not save");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="bg-white dark:bg-slate-800 p-4 rounded-md shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <input {...register("company")} placeholder="Company" className="p-2 border rounded w-full bg-transparent" />
          <p className="text-xs text-red-500">{errors.company?.message}</p>
        </div>
        <div>
          <input {...register("role")} placeholder="Role" className="p-2 border rounded w-full bg-transparent" />
          <p className="text-xs text-red-500">{errors.role?.message}</p>
        </div>
        <div>
          <input {...register("deadline")} type="date" className="p-2 border rounded w-full bg-transparent" />
        </div>
        <div>
          <select {...register("status")} className="p-2 border rounded w-full bg-transparent">
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <input {...register("logo")} placeholder="Logo URL (optional)" className="p-2 border rounded w-full bg-transparent" />
        </div>
        <div className="md:col-span-2">
          <textarea {...register("notes")} placeholder="Notes" className="p-2 border rounded w-full bg-transparent" rows="3" />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button type="submit" disabled={isSubmitting} className="relative px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
          {isSubmitting && (
            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          <span>{isSubmitting ? "Saving..." : "Save"}</span>
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>}
      </div>
    </form>
  );
}
