import axios from "axios";

export const API_BASE = "http://localhost:5000";

// 🟢 Fetch jobs
export async function fetchJobs() {
  const res = await axios.get(`${API_BASE}/jobs`);
  return res.data;
}

// 🟢 Create job
export async function createJob(job) {
  const res = await axios.post(`${API_BASE}/jobs`, job);
  return res.data;
}

// 🟢 Update job
export async function updateJob(id, updates) {
  const res = await axios.put(`${API_BASE}/jobs/${id}`, updates);
  return res.data;
}

// 🟢 Delete job
export async function deleteJob(id) {
  await axios.delete(`${API_BASE}/jobs/${id}`);
  return true;
}

// 🟣 Demo mode
export async function loadDemoJobs() {
  const demoJobs = [
    {
      company: "Ganglia Technologies",
      role: "Frontend Intern",
      deadline: "2025-11-20",
      status: "Applied",
      notes: "Submitted resume",
      logo: ""
    },
    {
      company: "Pixel Forge",
      role: "UI/UX Intern",
      deadline: "2025-12-10",
      status: "Rejected",
      notes: "Good portfolio",
      logo: ""
    }
  ];

  // Clear existing
  const existing = await axios.get(`${API_BASE}/jobs`);
  await Promise.all(existing.data.map(job =>
    axios.delete(`${API_BASE}/jobs/${job.id}`)
  ));

  // Insert demo
  const inserted = await Promise.all(
    demoJobs.map(job => axios.post(`${API_BASE}/jobs`, job))
  );

  return inserted.map(r => r.data);
}
