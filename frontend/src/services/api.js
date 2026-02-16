const API_BASE = "http://localhost:8000";

export const getJobs = async () => {
  const res = await fetch(`${API_BASE}/jobs`);
  return res.json();
};
