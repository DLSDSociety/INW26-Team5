// 

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Jobs.css";

const ALL_JOBS = [
  { id: 1, title: "Software Engineer", company: "Google", location: "Bangalore", type: "Full-time", salary: "₹18L – ₹28L", category: "Engineering", logo: "GO", posted: "2 days ago", description: "Build scalable backend systems using Go and distributed architecture." },
  { id: 2, title: "Data Scientist", company: "Microsoft", location: "Hyderabad", type: "Full-time", salary: "₹15L – ₹22L", category: "Data", logo: "MS", posted: "1 day ago", description: "Develop ML models and data pipelines using Python and Azure." },
  { id: 3, title: "Frontend Developer", company: "Flipkart", location: "Bangalore", type: "Full-time", salary: "₹12L – ₹18L", category: "Engineering", logo: "FK", posted: "3 days ago", description: "Build performant React applications for millions of users." },
  { id: 4, title: "UI/UX Designer", company: "Zomato", location: "Gurugram", type: "Full-time", salary: "₹10L – ₹16L", category: "Design", logo: "ZO", posted: "5 days ago", description: "Design intuitive user experiences for our food delivery platform." },
  { id: 5, title: "DevOps Engineer", company: "Infosys", location: "Pune", type: "Contract", salary: "₹14L – ₹20L", category: "Engineering", logo: "IN", posted: "1 week ago", description: "Manage CI/CD pipelines and cloud infrastructure on AWS." },
  { id: 6, title: "Product Manager", company: "Swiggy", location: "Bangalore", type: "Full-time", salary: "₹20L – ₹30L", category: "Management", logo: "SW", posted: "2 days ago", description: "Drive product strategy and roadmap for our logistics platform." },
  { id: 7, title: "Backend Engineer", company: "Razorpay", location: "Bangalore", type: "Full-time", salary: "₹16L – ₹24L", category: "Engineering", logo: "RZ", posted: "4 days ago", description: "Build payment infrastructure handling millions of transactions." },
  { id: 8, title: "Data Analyst", company: "Paytm", location: "Remote", type: "Part-time", salary: "₹8L – ₹12L", category: "Data", logo: "PT", posted: "3 days ago", description: "Analyze user behaviour and business metrics using SQL and Tableau." },
  { id: 9, title: "ML Engineer", company: "CRED", location: "Bangalore", type: "Full-time", salary: "₹18L – ₹26L", category: "Data", logo: "CR", posted: "6 days ago", description: "Build recommendation and fraud detection systems at scale." },
  { id: 10, title: "Marketing Manager", company: "Meesho", location: "Bangalore", type: "Full-time", salary: "₹12L – ₹18L", category: "Marketing", logo: "ME", posted: "1 week ago", description: "Lead digital marketing campaigns and growth initiatives." },
  { id: 11, title: "Android Developer", company: "PhonePe", location: "Pune", type: "Full-time", salary: "₹14L – ₹22L", category: "Engineering", logo: "PP", posted: "2 days ago", description: "Build the PhonePe Android app used by 400M+ users." },
  { id: 12, title: "HR Manager", company: "TCS", location: "Chennai", type: "Full-time", salary: "₹8L – ₹14L", category: "HR", logo: "TC", posted: "5 days ago", description: "Manage talent acquisition and employee engagement programs." },
];

const CATEGORIES = ["All", "Engineering", "Data", "Design", "Management", "Marketing", "HR"];
const LOCATIONS  = ["All", "Bangalore", "Hyderabad", "Pune", "Gurugram", "Chennai", "Remote"];
const JOB_TYPES  = ["All", "Full-time", "Part-time", "Contract"];

const TYPE_COLORS = {
  "Full-time": "#22c55e",
  "Part-time": "#f59e0b",
  "Contract":  "#3b82f6",
};

export default function Jobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [keyword,  setKeyword]  = useState(searchParams.get("keyword")  || "");
  const [location, setLocation] = useState(searchParams.get("location") || "All");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [jobType,  setJobType]  = useState("All");
  const [sortBy,   setSortBy]   = useState("newest");
  const [saved,    setSaved]    = useState([]);

  const filtered = ALL_JOBS
    .filter((j) => {
      const kw = keyword.toLowerCase();
      const matchKeyword  = !kw || j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw);
      const matchLocation = location === "All" || j.location === location;
      const matchCategory = category === "All" || j.category === category;
      const matchType     = jobType  === "All" || j.type     === jobType;
      return matchKeyword && matchLocation && matchCategory && matchType;
    })
    .sort((a, b) => sortBy === "newest" ? b.id - a.id : a.id - b.id);

  function toggleSave(id) {
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function clearFilters() {
    setKeyword(""); setLocation("All"); setCategory("All"); setJobType("All");
  }

  const hasFilters = keyword || location !== "All" || category !== "All" || jobType !== "All";

  return (
    <div className="jobs-page">

      {/* Top search bar */}
      <div className="jobs-search-bar">
        <div className="jobs-search-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Job title, keyword, or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button className="clear-input" onClick={() => setKeyword("")}>✕</button>
          )}
        </div>
        <div className="jobs-search-field loc">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="jobs-layout">

        {/* Sidebar filters */}
        <aside className="jobs-sidebar">
          <div className="sidebar-header">
            <span>Filters</span>
            {hasFilters && <button className="clear-btn" onClick={clearFilters}>Clear all</button>}
          </div>

          <div className="filter-group">
            <p className="filter-label">Category</p>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filter-option ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
                <span className="filter-count">
                  {c === "All" ? ALL_JOBS.length : ALL_JOBS.filter((j) => j.category === c).length}
                </span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <p className="filter-label">Job Type</p>
            {JOB_TYPES.map((t) => (
              <button
                key={t}
                className={`filter-option ${jobType === t ? "active" : ""}`}
                onClick={() => setJobType(t)}
              >
                {t}
                <span className="filter-count">
                  {t === "All" ? ALL_JOBS.length : ALL_JOBS.filter((j) => j.type === t).length}
                </span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <p className="filter-label">Location</p>
            {LOCATIONS.map((l) => (
              <button
                key={l}
                className={`filter-option ${location === l ? "active" : ""}`}
                onClick={() => setLocation(l)}
              >
                {l}
                <span className="filter-count">
                  {l === "All" ? ALL_JOBS.length : ALL_JOBS.filter((j) => j.location === l).length}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Job listings */}
        <main className="jobs-main">
          <div className="jobs-main-header">
            <span className="results-count">
              <strong>{filtered.length}</strong> job{filtered.length !== 1 ? "s" : ""} found
              {hasFilters && <span className="filter-tag"> — filtered</span>}
            </span>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <p>No jobs match your search.</p>
              <button className="clear-btn-lg" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className="jobs-list">
              {filtered.map((job) => (
                <div key={job.id} className="job-row" onClick={() => navigate(`/jobs/${job.id}`)}>
                  <div className="job-row-logo">{job.logo}</div>
                  <div className="job-row-info">
                    <div className="job-row-top">
                      <h3 className="job-row-title">{job.title}</h3>
                      <span
                        className="job-row-type"
                        style={{ color: TYPE_COLORS[job.type], borderColor: TYPE_COLORS[job.type] }}
                      >
                        {job.type}
                      </span>
                    </div>
                    <p className="job-row-company">{job.company}</p>
                    <p className="job-row-desc">{job.description}</p>
                    <div className="job-row-meta">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary}</span>
                      <span>🕒 {job.posted}</span>
                      <span className="job-row-cat">{job.category}</span>
                    </div>
                  </div>
                  <div className="job-row-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`save-btn ${saved.includes(job.id) ? "saved" : ""}`}
                      onClick={() => toggleSave(job.id)}
                      title={saved.includes(job.id) ? "Unsave" : "Save job"}
                    >
                      {saved.includes(job.id) ? "★" : "☆"}
                    </button>
                    <button className="apply-now-btn" onClick={() => navigate(`/jobs/${job.id}`)}>
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}