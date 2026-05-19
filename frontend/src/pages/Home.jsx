import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const CATEGORIES = [
  { icon: "💻", label: "AI / ML" },
  { icon: "📊", label: "Data Analytics" },
  { icon: "⚙️", label: "Backend Dev" },
  { icon: "🎨", label: "Frontend Dev" },
  { icon: "☁️", label: "DevOps & Cloud" },
  { icon: "📱", label: "Mobile Dev" },
  { icon: "🔐", label: "Cybersecurity" },
  { icon: "📈", label: "Product" },
];

const FEATURED_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "₹12L – ₹18L",
    category: "Engineering",
    logo: "TC",
    color: "#FF6B35",
    posted: "2d ago",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Designify",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹8L – ₹14L",
    category: "Design",
    logo: "DX",
    color: "#7C3AED",
    posted: "1d ago",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudBase",
    location: "Hyderabad",
    type: "Contract",
    salary: "₹20L – ₹30L",
    category: "Engineering",
    logo: "CB",
    color: "#0EA5E9",
    posted: "3d ago",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "LaunchPad",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹18L – ₹28L",
    category: "Management",
    logo: "LP",
    color: "#10B981",
    posted: "5h ago",
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "DataWave",
    location: "Remote",
    type: "Part-time",
    salary: "₹6L – ₹10L",
    category: "Data",
    logo: "DW",
    color: "#F59E0B",
    posted: "1d ago",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "InfraNet",
    location: "Pune",
    type: "Full-time",
    salary: "₹15L – ₹25L",
    category: "Engineering",
    logo: "IN",
    color: "#EF4444",
    posted: "4h ago",
  },
];

const STATS = [
  { value: "10,000+", label: "Jobs Posted", icon: "💼" },
  { value: "5,000+", label: "Companies", icon: "🏢" },
  { value: "50,000+", label: "Job Seekers", icon: "👥" },
  { value: "8,000+", label: "Hires Made", icon: "🎉" },
];

const COMPANIES = [
  "Infosys", "TCS", "Wipro", "HCL", "Tech Mahindra", "Flipkart", "Swiggy", "Zomato", "Razorpay", "CRED",
];

const TYPE_COLORS = {
  "Full-time": { bg: "#dcfce7", color: "#16a34a" },
  "Part-time": { bg: "#fef3c7", color: "#d97706" },
  Contract: { bg: "#dbeafe", color: "#2563eb" },
};

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [activeCategory, setActiveCategory] = useState(1);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  }

  return (
    <div className="home">

      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>🎯 <strong>DLSDS Job Fair 2025</strong> – Connect with 200+ top recruiters live</span>
        <button onClick={() => navigate("/register")}>Register Free →</button>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 India's Premier Tech Job Portal</span>
          <h1>
            Handpicked Premium<br />
            <span className="hero-highlight">Tech Jobs</span> For You
          </h1>
          <p>Discover curated opportunities from India's fastest-growing tech companies.</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search Jobs, Skills, Companies..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="search-divider" />
            <select defaultValue="">
              <option value="" disabled>Experience</option>
              <option>Fresher</option>
              <option>1–3 Years</option>
              <option>3–5 Years</option>
              <option>5+ Years</option>
            </select>
            <button type="submit" className="search-btn">Search</button>
          </form>

          <div className="hero-tags">
            <span>Trending:</span>
            {["React Developer", "ML Engineer", "Data Scientist", "DevOps"].map((tag) => (
              <button key={tag} className="tag" onClick={() => setKeyword(tag)}>{tag}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Category Tabs */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <button className="view-all-btn" onClick={() => navigate("/jobs")}>See all roles →</button>
        </div>
        <div className="category-tabs">
          {CATEGORIES.map((cat, i) => {
            const CATEGORY_MAP = {
              "AI / ML": "Engineering",
              "Data Analytics": "Data",
              "Backend Dev": "Engineering",
              "Frontend Dev": "Engineering",
              "DevOps & Cloud": "Engineering",
              "Mobile Dev": "Engineering",
              "Cybersecurity": "Engineering",
              "Product": "Management"
            };
            return (
              <button
                key={cat.label}
                className={`category-tab ${activeCategory === i ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(i);
                  const mapped = CATEGORY_MAP[cat.label] || "All";
                  navigate(`/jobs?category=${mapped}`);
                }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">🔥 Hot Opportunities</span>
            <h2>Featured Jobs</h2>
          </div>
          <button className="view-all-btn" onClick={() => navigate("/jobs")}>View All Jobs →</button>
        </div>

        <div className="jobs-grid">
          {FEATURED_JOBS.map((job) => {
            const typeStyle = TYPE_COLORS[job.type] || { bg: "#f1f5f9", color: "#64748b" };
            return (
              <div key={job.id} className="job-card" onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(job.title)}`)}>
                <div className="job-card-top">
                  <div className="company-logo" style={{ background: job.color + "18", color: job.color, borderColor: job.color + "33" }}>
                    {job.logo}
                  </div>
                  <span className="job-type-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                    {job.type}
                  </span>
                </div>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
                <div className="job-meta">
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {job.location}
                  </span>
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    {job.salary}
                  </span>
                </div>
                <div className="job-card-footer">
                  <span className="job-category">{job.category}</span>
                  <div className="card-footer-right">
                    <span className="posted-time">{job.posted}</span>
                    <button className="apply-btn" onClick={(e) => { e.stopPropagation(); navigate(`/jobs?keyword=${encodeURIComponent(job.title)}`); }}>
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Companies Strip */}
      <section className="companies-section">
        <p className="companies-label">Trusted by <strong>5,000+ companies</strong> across India</p>
        <div className="companies-strip">
          <div className="companies-track">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <span key={i} className="company-pill">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="why-section">
        <div className="why-left">
          <span className="section-eyebrow">✦ Why Choose Us</span>
          <h2>Apply on the Go!<br />Your career, simplified.</h2>
          <ul className="why-list">
            <li>
              <span className="why-check">✓</span>
              <div>
                <strong>Curated Premium Jobs</strong>
                <p>Hand-screened listings you won't find anywhere else.</p>
              </div>
            </li>
            <li>
              <span className="why-check">✓</span>
              <div>
                <strong>Instant Alerts</strong>
                <p>Get notified the moment your dream role is posted.</p>
              </div>
            </li>
            <li>
              <span className="why-check">✓</span>
              <div>
                <strong>Track Applications</strong>
                <p>Know exactly where you stand with every application.</p>
              </div>
            </li>
          </ul>
          <button className="orange-btn" onClick={() => navigate("/register")}>Create Free Account →</button>
        </div>
        <div className="why-right">
          <div className="jobfeed-card">
            <div className="jobfeed-header">
              <span>📋 My Jobfeed</span>
              <span className="jobfeed-live">● Live</span>
            </div>
            {FEATURED_JOBS.slice(0, 4).map((job) => (
              <div key={job.id} className="jobfeed-item">
                <div className="jobfeed-dot" style={{ background: job.color }} />
                <div className="jobfeed-info">
                  <span className="jobfeed-title">{job.company} – {job.title}</span>
                  <span className="jobfeed-meta">{job.location} · {job.posted}</span>
                </div>
                <span className="jobfeed-salary">{job.salary}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <span className="section-eyebrow" style={{ color: "#FF6B35" }}>For Employers</span>
          <h2>Hire Top Tech Talent Fast</h2>
          <p>Post your openings and reach 50,000+ verified job seekers instantly.</p>
          <div className="cta-buttons">
            <button className="orange-btn" onClick={() => navigate("/register")}>Post a Job — It's Free</button>
            <button className="outline-btn" onClick={() => navigate("/jobs")}>Browse Candidates</button>
          </div>
        </div>
      </section>

    </div>
  );
}