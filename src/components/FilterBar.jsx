import React from "react";

export default function FilterBar({ filter, setFilter, search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
      <div className="flex gap-2 w-full md:w-auto">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="p-2 border rounded">
          <option value="newest">Newest</option>
          <option value="deadline">Deadline Soon</option>
          <option value="company">Company A→Z</option>
        </select>
      </div>

      <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search role or company" className="p-2 border rounded flex-1"/>
    </div>
  );
}
