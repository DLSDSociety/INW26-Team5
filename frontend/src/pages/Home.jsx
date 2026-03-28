// import "./Home.css";

// function Home() {
//   return (
//     <>
//       <div className="hero">
//         <h1>Find Your Dream Job</h1>

//         <p className="subtitle">
//           Discover thousands of job opportunities from top companies.
//         </p>

//         <div className="search-bar">
//           <input type="text" placeholder="Job title or keyword" />
//           <input type="text" placeholder="Location" />

//           <select>
//             <option>Category</option>
//             <option>Software</option>
//             <option>Data Science</option>
//             <option>Marketing</option>
//           </select>

//           <button>Search</button>
//         </div>
//       </div>

//       <div className="jobs-section">
//         <h2>Featured Jobs</h2>

//         <div className="jobs-grid">
//           <div className="job-card">
//             <h3>Frontend Developer</h3>
//             <p>Google • Bangalore</p>
//             <span className="badge">Full Time</span>
//           </div>

//           <div className="job-card">
//             <h3>Data Scientist</h3>
//             <p>Amazon • Hyderabad</p>
//             <span className="badge">Remote</span>
//           </div>

//           <div className="job-card">
//             <h3>Backend Engineer</h3>
//             <p>Microsoft • Remote</p>
//             <span className="badge">Urgent</span>
//           </div>
//         </div>
//       </div>

//       <div className="companies-section">
//         <h2>Top Companies</h2>
//         <div className="companies-grid">
//           <div className="company-card">Google</div>
//           <div className="company-card">Amazon</div>
//           <div className="company-card">Microsoft</div>
//           <div className="company-card">Infosys</div>
//           <div className="company-card">Adobe</div>
//           <div className="company-card">TCS</div>
//         </div>
//       </div>

//       <div className="categories-section">
//         <h2>Job Categories</h2>
//         <div className="categories-grid">
//           <div className="category-card">Software Development</div>
//           <div className="category-card">Data Science</div>
//           <div className="category-card">UI/UX Design</div>
//           <div className="category-card">Marketing</div>
//           <div className="category-card">Cyber Security</div>
//           <div className="category-card">Cloud Computing</div>
//         </div>
//       </div>

//       <div className="how-section">
//         <h2>How It Works</h2>
//         <div className="how-grid">
//           <div className="how-card">
//             <span>1</span>
//             <h3>Create Profile</h3>
//             <p>Sign up and build your profile to get started.</p>
//           </div>

//           <div className="how-card">
//             <span>2</span>
//             <h3>Search Jobs</h3>
//             <p>Browse opportunities by keyword, category, and location.</p>
//           </div>

//           <div className="how-card">
//             <span>3</span>
//             <h3>Apply Easily</h3>
//             <p>Submit applications and track them from your dashboard.</p>
//           </div>
//         </div>
//       </div>

//       <footer className="footer">
//         <div className="footer-container">
//           <div className="footer-brand">
//             <h2>JobPortal</h2>
//             <p>
//               Your gateway to thousands of job opportunities from top companies.
//             </p>
//           </div>

//           <div className="footer-links">
//             <h3>Quick Links</h3>
//             <a href="/">Home</a>
//             <a href="/jobs">Jobs</a>
//             <a href="/login">Login</a>
//             <a href="/register">Register</a>
//           </div>

//           <div className="footer-contact">
//             <h3>Contact</h3>
//             <p>Email: support@jobportal.com</p>
//             <p>Phone: +91 98765 43210</p>
//             <p>Location: Guwahati, India</p>
//           </div>
//         </div>

//         <div className="footer-bottom">
//           <p>© 2026 JobPortal. All rights reserved.</p>
//         </div>
//       </footer>
//     </>
//   );
// }

// export default Home;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const FEATURED_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$80k – $100k",
    category: "Engineering",
    logo: "TC",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Designify",
    location: "New York, NY",
    type: "Full-time",
    salary: "$70k – $90k",
    category: "Design",
    logo: "DX",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudBase",
    location: "San Francisco, CA",
    type: "Contract",
    salary: "$110k – $130k",
    category: "Engineering",
    logo: "CB",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "LaunchPad",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$90k – $120k",
    category: "Management",
    logo: "LP",
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "DataWave",
    location: "Remote",
    type: "Part-time",
    salary: "$60k – $80k",
    category: "Data",
    logo: "DW",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "InfraNet",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$100k – $130k",
    category: "Engineering",
    logo: "IN",
  },
];

const STATS = [
  { value: "10,000+", label: "Jobs Posted" },
  { value: "5,000+", label: "Companies" },
  { value: "50,000+", label: "Job Seekers" },
  { value: "8,000+", label: "Hires Made" },
];

const TYPE_COLORS = {
  "Full-time": "#22c55e",
  "Part-time": "#f59e0b",
  Contract: "#3b82f6",
};

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    navigate(`/jobs?${params.toString()}`);
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 #1 Job Portal in India</span>
          <h1>Find Your <span className="hero-highlight">Dream Job</span> Today</h1>
          <p>Discover thousands of job opportunities from top companies across India and beyond.</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
              <option value="Data">Data</option>
              <option value="Marketing">Marketing</option>
            </select>
            <button type="submit" className="search-btn">Search Jobs</button>
          </form>

          <div className="hero-tags">
            <span>Popular:</span>
            {["React Developer", "UI Designer", "Data Scientist", "DevOps"].map((tag) => (
              <button key={tag} className="tag" onClick={() => { setKeyword(tag); }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Featured Jobs */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Jobs</h2>
          <button className="view-all-btn" onClick={() => navigate("/jobs")}>
            View All Jobs →
          </button>
        </div>

        <div className="jobs-grid">
          {FEATURED_JOBS.map((job) => (
            <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
              <div className="job-card-top">
                <div className="company-logo">{job.logo}</div>
                <span
                  className="job-type-badge"
                  style={{ color: TYPE_COLORS[job.type] || "#94a3b8", borderColor: TYPE_COLORS[job.type] || "#94a3b8" }}
                >
                  {job.type}
                </span>
              </div>
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.company}</p>
              <div className="job-meta">
                <span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {job.location}
                </span>
                <span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  {job.salary}
                </span>
              </div>
              <div className="job-card-footer">
                <span className="job-category">{job.category}</span>
                <button className="apply-btn">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Are you an Employer?</h2>
        <p>Post your job openings and reach thousands of qualified candidates.</p>
        <button className="cta-btn" onClick={() => navigate("/register")}>
          Post a Job — It's Free
        </button>
      </section>
    </div>
  );
}