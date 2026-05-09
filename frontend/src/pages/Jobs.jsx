import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Jobs.css";

const API = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

const CATEGORIES = ["All", "Engineering", "Data", "Design", "Management", "Marketing", "HR"];
const LOCATIONS  = ["All", "Bangalore", "Hyderabad", "Pune", "Gurugram", "Chennai", "Remote"];
const JOB_TYPES  = ["All", "Full-time", "Part-time", "Contract"];

const TYPE_STYLES = {
  "Full-time": { bg: "#dcfce7", color: "#16a34a" },
  "Part-time": { bg: "#fef3c7", color: "#d97706" },
  "Contract":  { bg: "#dbeafe", color: "#2563eb" },
};

const LOGO_COLORS = [
  "#FF6B35", "#7C3AED", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#84CC16", "#F97316",
];

export default function Jobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [keyword,  setKeyword]  = useState(searchParams.get("keyword")  || "");
  const [location, setLocation] = useState(searchParams.get("location") || "All");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [jobType,  setJobType]  = useState("All");
  const [sortBy,   setSortBy]   = useState("newest");
  const [saved,    setSaved]    = useState([]);
  const [allJobs,  setAllJobs]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [applying, setApplying] = useState(null);
  const [applyMsg, setApplyMsg] = useState({ text: "", type: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/jobs`);
      const data = await res.json();
      setAllJobs(data.jobs || []);
    } catch {
      setError("Could not load jobs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(e, jobId) {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "seeker") {
      setApplyMsg({ text: "Only job seekers can apply.", type: "error" });
      setTimeout(() => setApplyMsg({ text: "", type: "" }), 3500);
      return;
    }

    setApplying(jobId);
    setApplyMsg({ text: "", type: "" });
    try {
      const res = await fetch(`${API}/applications`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApplyMsg({ text: data.message || "Failed to apply.", type: "error" });
      } else {
        setApplyMsg({ text: "Applied successfully! 🎉", type: "success" });
      }
    } catch {
      setApplyMsg({ text: "Could not connect to server.", type: "error" });
    } finally {
      setApplying(null);
      setTimeout(() => setApplyMsg({ text: "", type: "" }), 3500);
    }
  }

  // ← Use _id for sorting (compare ISO date strings instead)
  const filtered = allJobs
    .filter((j) => {
      const kw = keyword.toLowerCase();
      const matchKeyword  = !kw || j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw);
      const matchLocation = location === "All" || j.location === location;
      const matchCategory = category === "All" || j.category === category;
      const matchType     = jobType  === "All" || j.type     === jobType;
      return matchKeyword && matchLocation && matchCategory && matchType;
    })
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  function toggleSave(e, id) {
    e.stopPropagation();
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function clearFilters() {
    setKeyword(""); setLocation("All"); setCategory("All"); setJobType("All");
  }

  const hasFilters = keyword || location !== "All" || category !== "All" || jobType !== "All";

  if (loading) return (
    <div className="jobs-state-screen">
      <div className="jobs-spinner" />
      <p>Finding the best jobs for you...</p>
    </div>
  );

  if (error) return (
    <div className="jobs-state-screen">
      <span style={{ fontSize: 40 }}>😕</span>
      <p style={{ color: "#EF4444" }}>{error}</p>
      <button className="orange-pill-btn" onClick={fetchJobs}>Retry</button>
    </div>
  );

  return (
    <div className="jobs-page">

      {/* Toast */}
      {applyMsg.text && (
        <div className={`apply-toast ${applyMsg.type}`}>
          {applyMsg.text}
        </div>
      )}

      {/* Top Search Bar */}
      <div className="jobs-search-bar">
        <button className="mobile-filter-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ⚙ Filters {hasFilters && <span className="filter-dot" />}
        </button>
        <div className="jobs-search-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Job title, keyword, or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && <button className="clear-input" onClick={() => setKeyword("")}>✕</button>}
        </div>
        <div className="search-bar-divider" />
        <div className="jobs-search-field loc">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="jobs-layout">

        {/* Sidebar */}
        <aside className={`jobs-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <span>Filters</span>
            {hasFilters && <button className="clear-btn" onClick={clearFilters}>Clear all</button>}
          </div>

          <div className="filter-group">
            <p className="filter-label">Category</p>
            {CATEGORIES.map((c) => (
              <button key={c} className={`filter-option ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                {c}
                <span className="filter-count">
                  {c === "All" ? allJobs.length : allJobs.filter((j) => j.category === c).length}
                </span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <p className="filter-label">Job Type</p>
            {JOB_TYPES.map((t) => (
              <button key={t} className={`filter-option ${jobType === t ? "active" : ""}`} onClick={() => setJobType(t)}>
                {t}
                <span className="filter-count">
                  {t === "All" ? allJobs.length : allJobs.filter((j) => j.type === t).length}
                </span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <p className="filter-label">Location</p>
            {LOCATIONS.map((l) => (
              <button key={l} className={`filter-option ${location === l ? "active" : ""}`} onClick={() => setLocation(l)}>
                {l}
                <span className="filter-count">
                  {l === "All" ? allJobs.length : allJobs.filter((j) => j.location === l).length}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="jobs-main">
          <div className="jobs-main-header">
            <span className="results-count">
              <strong>{filtered.length}</strong> job{filtered.length !== 1 ? "s" : ""} found
              {hasFilters && <span className="filter-active-tag">· filtered</span>}
            </span>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              <span style={{ fontSize: 52 }}>🔍</span>
              <p>No jobs match your search.</p>
              <button className="orange-pill-btn" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className="jobs-list">
              {filtered.map((job, idx) => {
                const logoColor = LOGO_COLORS[idx % LOGO_COLORS.length];
                const typeStyle = TYPE_STYLES[job.type] || { bg: "#f1f5f9", color: "#64748b" };
                const isSaved   = saved.includes(job._id);    // ← _id
                return (
                  <div key={job._id} className="job-row" onClick={() => navigate(`/jobs/${job._id}`)}>  {/* ← _id */}
                    <div
                      className="job-row-logo"
                      style={{ background: logoColor + "18", color: logoColor, borderColor: logoColor + "33" }}
                    >
                      {job.logo || job.company?.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="job-row-info">
                      <div className="job-row-top">
                        <h3 className="job-row-title">{job.title}</h3>
                        <span className="job-row-type" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                          {job.type}
                        </span>
                      </div>
                      <p className="job-row-company">{job.company}</p>
                      <p className="job-row-desc">{job.description}</p>
                      <div className="job-row-meta">
                        <span className="meta-chip">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {job.location}
                        </span>
                        <span className="meta-chip">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          {job.salary || "Not disclosed"}
                        </span>
                        <span className="meta-chip">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        {job.category && <span className="job-row-cat">{job.category}</span>}
                      </div>
                    </div>

                    <div className="job-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`save-btn ${isSaved ? "saved" : ""}`}
                        onClick={(e) => toggleSave(e, job._id)}   // ← _id
                        title={isSaved ? "Unsave" : "Save job"}
                      >
                        {isSaved ? "★" : "☆"}
                      </button>
                      <button
                        className="apply-now-btn"
                        disabled={applying === job._id}            // ← _id
                        onClick={(e) => handleApply(e, job._id)}   // ← _id
                      >
                        {applying === job._id ? "Applying..." : "Apply Now"}  {/* ← _id */}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}