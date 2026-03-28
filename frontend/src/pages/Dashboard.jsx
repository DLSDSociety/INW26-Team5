import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ─── Mock data ───────────────────────────────────────────────
const SEEKER_DATA = {
  applications: [
    { id: 1, title: "Software Engineer",  company: "Google",    status: "Interview", date: "Mar 10", logo: "GO" },
    { id: 2, title: "Data Scientist",     company: "Microsoft", status: "Applied",   date: "Mar 12", logo: "MS" },
    { id: 3, title: "Frontend Developer", company: "Flipkart",  status: "Rejected",  date: "Mar 8",  logo: "FK" },
    { id: 4, title: "ML Engineer",        company: "CRED",      status: "Offered",   date: "Mar 14", logo: "CR" },
  ],
  saved: [
    { id: 5, title: "DevOps Engineer",  company: "Infosys", location: "Pune",      salary: "₹14L–₹20L", logo: "IN" },
    { id: 6, title: "Product Manager",  company: "Swiggy",  location: "Bangalore", salary: "₹20L–₹30L", logo: "SW" },
  ],
  profileStrength: 72,
};

const EMPLOYER_DATA = {
  jobs: [
    { id: 1, title: "Backend Engineer",   applicants: 24, status: "Active",  posted: "Mar 5",  views: 340 },
    { id: 2, title: "UI/UX Designer",     applicants: 17, status: "Active",  posted: "Mar 8",  views: 210 },
    { id: 3, title: "Data Analyst",       applicants: 9,  status: "Paused",  posted: "Feb 28", views: 180 },
    { id: 4, title: "Android Developer",  applicants: 31, status: "Active",  posted: "Mar 12", views: 420 },
  ],
  recentApplicants: [
    { id: 1, name: "Rahul Kumar",  role: "Backend Engineer",  status: "New",        avatar: "RK" },
    { id: 2, name: "Priya Singh",  role: "UI/UX Designer",    status: "Reviewed",   avatar: "PS" },
    { id: 3, name: "Arjun Mehta", role: "Android Developer",  status: "Shortlisted", avatar: "AM" },
    { id: 4, name: "Neha Joshi",  role: "Backend Engineer",   status: "New",        avatar: "NJ" },
  ],
};

const ADMIN_DATA = {
  stats: [
    { label: "Total Users",    value: "12,480", change: "+8%",  icon: "👥" },
    { label: "Active Jobs",    value: "3,240",  change: "+12%", icon: "💼" },
    { label: "Applications",   value: "28,910", change: "+5%",  icon: "📋" },
    { label: "Hires This Month", value: "842",  change: "+19%", icon: "🎯" },
  ],
  recentUsers: [
    { id: 1, name: "Rahul Kumar",    email: "rahul@email.com",  role: "Seeker",   joined: "Mar 14", avatar: "RK" },
    { id: 2, name: "TechCorp HR",    email: "hr@techcorp.com",  role: "Employer", joined: "Mar 13", avatar: "TC" },
    { id: 3, name: "Priya Singh",    email: "priya@email.com",  role: "Seeker",   joined: "Mar 12", avatar: "PS" },
    { id: 4, name: "Infosys Hiring", email: "hire@infosys.com", role: "Employer", joined: "Mar 11", avatar: "IH" },
  ],
  flaggedJobs: [
    { id: 1, title: "Earn ₹50k/day from Home", company: "Unknown",   reason: "Spam",       date: "Mar 14" },
    { id: 2, title: "Crypto Trader Needed",     company: "CryptoXY",  reason: "Suspicious", date: "Mar 13" },
  ],
};

// ─── Status config ────────────────────────────────────────────
const STATUS_CONFIG = {
  Applied:     { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  Interview:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  Offered:     { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  Rejected:    { color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  Active:      { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  Paused:      { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  New:         { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  Reviewed:    { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  Shortlisted: { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  Seeker:      { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  Employer:    { color: "#a855f7", bg: "rgba(168,85,247,0.1)"  },
  Suspicious:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  Spam:        { color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" };
  return (
    <span className="status-badge" style={{ color: cfg.color, background: cfg.bg }}>
      {status}
    </span>
  );
}

function Avatar({ initials, size = 38 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.3 }}>
      {initials}
    </div>
  );
}

// ─── Role dashboards ──────────────────────────────────────────
function SeekerDashboard({ user }) {
  const navigate = useNavigate();
  const { applications, saved, profileStrength } = SEEKER_DATA;

  return (
    <>
      {/* Stats row */}
      <div className="stats-row">
        {[
          { label: "Applied",    value: applications.length },
          { label: "Interviews", value: applications.filter(a => a.status === "Interview").length },
          { label: "Offers",     value: applications.filter(a => a.status === "Offered").length },
          { label: "Saved Jobs", value: saved.length },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Applications */}
        <div className="dash-panel wide">
          <div className="panel-header">
            <h2>My Applications</h2>
            <button className="panel-link" onClick={() => navigate("/jobs")}>Browse more →</button>
          </div>
          <div className="app-list">
            {applications.map((app) => (
              <div key={app.id} className="app-row">
                <Avatar initials={app.logo} />
                <div className="app-info">
                  <strong>{app.title}</strong>
                  <span>{app.company}</span>
                </div>
                <span className="app-date">{app.date}</span>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="dash-col">
          {/* Profile strength */}
          <div className="dash-panel">
            <div className="panel-header"><h2>Profile Strength</h2></div>
            <div className="profile-strength">
              <div className="strength-circle">
                <svg viewBox="0 0 36 36" width="80" height="80">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#3b82f6" strokeWidth="3"
                    strokeDasharray={`${profileStrength} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span>{profileStrength}%</span>
              </div>
              <div className="strength-tips">
                {[
                  { done: true,  text: "Add profile photo" },
                  { done: true,  text: "Add work experience" },
                  { done: false, text: "Upload resume" },
                  { done: false, text: "Add skills" },
                ].map((t) => (
                  <div key={t.text} className={`tip-row ${t.done ? "done" : ""}`}>
                    <span className="tip-icon">{t.done ? "✓" : "○"}</span>
                    {t.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Saved jobs */}
          <div className="dash-panel">
            <div className="panel-header">
              <h2>Saved Jobs</h2>
              <button className="panel-link" onClick={() => navigate("/jobs")}>View all →</button>
            </div>
            {saved.map((job) => (
              <div key={job.id} className="saved-row">
                <Avatar initials={job.logo} size={34} />
                <div>
                  <strong>{job.title}</strong>
                  <span>{job.company} · {job.location}</span>
                </div>
                <span className="saved-salary">{job.salary}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function EmployerDashboard({ user }) {
  const { jobs, recentApplicants } = EMPLOYER_DATA;

  return (
    <>
      <div className="stats-row">
        {[
          { label: "Active Jobs",      value: jobs.filter(j => j.status === "Active").length },
          { label: "Total Applicants", value: jobs.reduce((s, j) => s + j.applicants, 0) },
          { label: "Total Views",      value: jobs.reduce((s, j) => s + j.views, 0) },
          { label: "Shortlisted",      value: recentApplicants.filter(a => a.status === "Shortlisted").length },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Posted jobs */}
        <div className="dash-panel wide">
          <div className="panel-header">
            <h2>Posted Jobs</h2>
            <button className="panel-btn">+ Post New Job</button>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applicants</th>
                <th>Views</th>
                <th>Posted</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="td-title">{job.title}</td>
                  <td>{job.applicants}</td>
                  <td>{job.views}</td>
                  <td className="td-muted">{job.posted}</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td>
                    <div className="td-actions">
                      <button className="icon-btn" title="Edit">✎</button>
                      <button className="icon-btn danger" title="Delete">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent applicants */}
        <div className="dash-panel">
          <div className="panel-header"><h2>Recent Applicants</h2></div>
          {recentApplicants.map((a) => (
            <div key={a.id} className="app-row">
              <Avatar initials={a.avatar} />
              <div className="app-info">
                <strong>{a.name}</strong>
                <span>{a.role}</span>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminDashboard({ user }) {
  const { stats, recentUsers, flaggedJobs } = ADMIN_DATA;

  return (
    <>
      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-top">
              <strong>{s.value}</strong>
              <span className="stat-change positive">{s.change}</span>
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Recent users */}
        <div className="dash-panel wide">
          <div className="panel-header">
            <h2>Recent Users</h2>
            <button className="panel-link">Manage all →</button>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="td-user">
                      <Avatar initials={u.avatar} size={30} />
                      {u.name}
                    </div>
                  </td>
                  <td className="td-muted">{u.email}</td>
                  <td><StatusBadge status={u.role} /></td>
                  <td className="td-muted">{u.joined}</td>
                  <td>
                    <div className="td-actions">
                      <button className="icon-btn danger" title="Ban">⊘</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flagged jobs */}
        <div className="dash-panel">
          <div className="panel-header">
            <h2>Flagged Jobs</h2>
            <span className="flag-count">{flaggedJobs.length}</span>
          </div>
          {flaggedJobs.map((job) => (
            <div key={job.id} className="flagged-row">
              <div className="flagged-info">
                <strong>{job.title}</strong>
                <span>{job.company} · {job.date}</span>
              </div>
              <StatusBadge status={job.reason} />
              <button className="icon-btn danger" title="Remove">✕</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (!user) return null;

  const ROLE_LABELS = { seeker: "Job Seeker", employer: "Employer", admin: "Admin" };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-user">
          <Avatar initials={user.name ? user.name.slice(0,2).toUpperCase() : "U"} size={44} />
          <div>
            <strong>{user.name || user.email}</strong>
            <span className="user-role-badge">{ROLE_LABELS[user.role] || user.role}</span>
          </div>
        </div>

        <nav className="dash-nav">
          {[
            { icon: "⊞", label: "Overview",     active: true  },
            { icon: "📋", label: "Applications", active: false },
            { icon: "💼", label: "Jobs",         active: false },
            { icon: "👤", label: "Profile",      active: false },
            { icon: "🔔", label: "Notifications",active: false },
            { icon: "⚙",  label: "Settings",     active: false },
          ].map((item) => (
            <button key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.name || user.email} 👋</p>
          </div>
          {user.role === "employer" && (
            <button className="post-job-btn">+ Post a Job</button>
          )}
        </div>

        {user.role === "seeker"   && <SeekerDashboard   user={user} />}
        {user.role === "employer" && <EmployerDashboard user={user} />}
        {user.role === "admin"    && <AdminDashboard    user={user} />}
      </main>
    </div>
  );
}