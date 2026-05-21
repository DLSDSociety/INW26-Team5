import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText, FiFolder, FiUpload, FiTrash2, FiRefreshCw,
  FiTarget, FiClock, FiSearch, FiBriefcase, FiBell,
  FiUser, FiSettings, FiGrid, FiUsers, FiList,
  FiBarChart2, FiCheckCircle, FiAlertTriangle, FiInfo,
  FiCalendar, FiEye
} from "react-icons/fi";
import "./Dashboard.css";

// ─── API config ───────────────────────────────────────────────
const API = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

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
  seeker:      { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  employer:    { color: "#a855f7", bg: "rgba(168,85,247,0.1)"  },
  admin:       { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  pending:     { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  reviewed:    { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  accepted:    { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  rejected:    { color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
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

// ─── Resume Upload Component ──────────────────────────────────
function ResumeUpload() {
  const [resume,    setResume]    = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message,   setMessage]   = useState("");
  const [dragOver,  setDragOver]  = useState(false);

  useEffect(() => { fetchResume(); }, []);

  async function fetchResume() {
    try {
      const res = await fetch(`${API}/resume/me`, { headers: authHeaders() });
      if (res.ok) setResume(await res.json());
    } catch (err) {
      console.error("Failed to fetch resume:", err);
    }
  }

  async function handleUpload(file) {
    if (!file) return;
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) { setMessage("Only PDF, DOC, DOCX files allowed."); return; }
    if (file.size > 5 * 1024 * 1024) { setMessage("File size must be under 5MB."); return; }

    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/resume/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) { setMessage("Resume uploaded successfully!"); fetchResume(); }
      else setMessage(data.message || "Upload failed.");
    } catch { setMessage("Could not connect to server."); }
    finally { setUploading(false); }
  }

  async function handleDelete() {
    if (!window.confirm("Delete your resume?")) return;
    try {
      const res = await fetch(`${API}/resume/me`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) { setResume(null); setMessage("Resume deleted."); }
    } catch { setMessage("Could not delete resume."); }
  }

  const formatSize = (bytes) => (bytes / 1024).toFixed(1) + " KB";

  return (
    <div>
      {resume ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.75rem 1rem", borderRadius: "8px",
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
          marginBottom: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FiFileText size={22} style={{ color: "#3b82f6", flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: "14px", display: "block" }}>{resume.originalName}</strong>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                {formatSize(resume.fileSize)} · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button className="icon-btn danger" title="Delete resume" onClick={handleDelete}>
            <FiTrash2 size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById('resume-input').click()}
          style={{
            border: `2px dashed ${dragOver ? "#FF6B35" : "var(--border)"}`,
            borderRadius: "10px", padding: "2rem", textAlign: "center",
            marginBottom: "1rem",
            background: dragOver ? "var(--orange-pale)" : "transparent",
            transition: "all 0.2s", cursor: "pointer",
          }}
        >
          <div style={{ marginBottom: "0.75rem" }}><FiFolder size={32} style={{ color: "var(--muted)" }} /></div>
          <p style={{ fontSize: "14px", marginBottom: "0.25rem" }}>
            {uploading ? "Uploading..." : "Drag & drop your resume here"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>PDF, DOC, DOCX · Max 5MB</p>
        </div>
      )}

      <input
        id="resume-input" type="file" accept=".pdf,.doc,.docx"
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      <button
        className="panel-btn" disabled={uploading}
        onClick={() => document.getElementById('resume-input').click()}
        style={{ width: "100%" }}
      >
        {uploading ? "Uploading..." : resume ? (
          <><FiRefreshCw size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Replace Resume</>
        ) : (
          <><FiUpload size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Upload Resume</>
        )}
      </button>

      {message && (
        <p style={{
          marginTop: "0.75rem", fontSize: "13px", textAlign: "center",
          color: message.includes("success") || message.includes("deleted") ? "#22c55e" : "#ef4444",
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

// ─── Seeker Dashboard ─────────────────────────────────────────
function SeekerDashboard({ user, data, activeTab, onTabChange, navigate }) {
  const applications = data?.applications || [];

  const [recommendations, setRecommendations] = useState([]);
  const [recLoading,      setRecLoading]      = useState(false);
  const [recError,        setRecError]        = useState("");
  const [recFetched,      setRecFetched]      = useState(false);

  // Resume Analysis
  const [analysis,        setAnalysis]        = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError,   setAnalysisError]   = useState("");

  async function fetchAnalysis() {
    setAnalysisLoading(true);
    setAnalysisError("");
    try {
      const res  = await fetch(`${API}/resume/analyze`, { headers: authHeaders() });
      const json = await res.json();
      if (res.ok) {
        setAnalysis(json.analysis);
      } else {
        setAnalysisError(json.message || "Analysis failed.");
      }
    } catch {
      setAnalysisError("Could not connect to server.");
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function fetchRecommendations() {
    setRecLoading(true);
    setRecError("");
    try {
      const res  = await fetch(`${API}/recommend`, { headers: authHeaders() });
      const json = await res.json();
      if (res.ok) {
        setRecommendations(json.recommendations || []);
        setRecFetched(true);
      } else {
        setRecError(json.message || "Failed to fetch recommendations.");
      }
    } catch {
      setRecError("Could not connect to server.");
    } finally {
      setRecLoading(false);
    }
  }

  function scoreColor(score) {
    if (score >= 80) return "#22c55e";
    if (score >= 55) return "#f59e0b";
    return "#ef4444";
  }

  function scoreLabel(score) {
    if (score >= 80) return "Great Match";
    if (score >= 55) return "Partial Match";
    return "Low Match";
  }

  return (
    <>
      {/* ── Overview ── */}
      {activeTab === "Overview" && (
        <>
          <div className="stats-row">
            {[
              { label: "Applied",  value: applications.length },
              { label: "Reviewed", value: applications.filter(a => a.status === "reviewed").length },
              { label: "Accepted", value: applications.filter(a => a.status === "accepted").length },
              { label: "Rejected", value: applications.filter(a => a.status === "rejected").length },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="dash-panel" style={{ marginBottom: "1.5rem" }}>
            <div className="panel-header" style={{ marginBottom: "1rem" }}>
              <h2><FiTarget size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} /> AI Job Recommendations</h2>
              <button className="panel-btn" onClick={fetchRecommendations} disabled={recLoading} style={{ minWidth: "140px" }}>
                {recLoading ? "Analyzing..." : recFetched ? (
                  <><FiRefreshCw size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Refresh</>
                ) : "Match My Resume"}
              </button>
            </div>
            {!recFetched && !recLoading && (
              <div style={{ textAlign:"center", padding:"2rem", background:"var(--cream)", borderRadius:"12px", border:"2px dashed var(--border)" }}>
                <div style={{ marginBottom: "0.75rem" }}><FiTarget size={40} style={{ color: "var(--muted)" }} /></div>
                <p style={{ fontWeight:600, marginBottom:"0.25rem", color:"var(--dark)" }}>Find your perfect job match</p>
                <p style={{ fontSize:"13px", color:"var(--muted)", marginBottom:"1rem" }}>Upload your resume and click "Match My Resume" to get AI-powered recommendations</p>
                <button className="panel-btn" onClick={fetchRecommendations}>Match My Resume</button>
              </div>
            )}
            {recLoading && <div style={{ textAlign:"center", padding:"2rem" }}><FiClock size={32} style={{ color: "var(--muted)" }} /><p style={{ color:"var(--muted)", fontSize:"14px", marginTop:"0.5rem" }}>AI is analyzing your resume...</p></div>}
            {recError && <div style={{ padding:"1rem", borderRadius:"10px", background:"rgba(239,68,68,0.08)", color:"#ef4444", fontSize:"14px", textAlign:"center" }}>{recError}</div>}
            {recFetched && !recLoading && recommendations.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                {recommendations.map((rec) => (
                  <div key={rec.jobId} style={{ display:"flex", alignItems:"flex-start", gap:"1rem", padding:"1rem 1.25rem", background:"var(--cream)", borderRadius:"12px", border:"1px solid var(--border)", flexWrap:"wrap" }}>
                    <div style={{ minWidth:"56px", height:"56px", borderRadius:"50%", border:`3px solid ${scoreColor(rec.score)}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#fff" }}>
                      <strong style={{ fontSize:"15px", color:scoreColor(rec.score), lineHeight:1 }}>{rec.score}</strong>
                      <span style={{ fontSize:"9px", color:"var(--muted)" }}>/ 100</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flexWrap:"wrap", marginBottom:"0.25rem" }}>
                        <strong style={{ fontSize:"15px", color:"var(--dark)" }}>{rec.title}</strong>
                        <span style={{ fontSize:"11px", fontWeight:600, padding:"2px 8px", borderRadius:"20px", color:"#fff", background:scoreColor(rec.score) }}>{scoreLabel(rec.score)}</span>
                      </div>
                      <p style={{ fontSize:"13px", color:"var(--muted)", margin:"0 0 0.4rem" }}>{rec.company} · {rec.location} · {rec.type}</p>
                      <p style={{ fontSize:"13px", color:"var(--dark)", margin:0, lineHeight:1.5 }}>{rec.reason}</p>
                    </div>
                    <button className="panel-btn" onClick={() => navigate("/jobs")} style={{ whiteSpace:"nowrap", alignSelf:"center" }}>View Job →</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats bottom */}
          <div className="dash-grid">
            <div className="dash-panel wide">
              <div className="panel-header"><h2>Recent Applications</h2><button className="panel-link" onClick={() => onTabChange("Applications")}>View all →</button></div>
              <div className="app-list">
                {applications.length === 0
                  ? <p style={{ color:"var(--muted)", padding:"1rem 0" }}>No applications yet. <span style={{ color:"var(--orange)", cursor:"pointer" }} onClick={() => navigate("/jobs")}>Browse jobs →</span></p>
                  : applications.slice(0,5).map((app) => (
                    <div key={app._id} className="app-row">
                      <Avatar initials={app.seekerName?.slice(0,2).toUpperCase() || "JB"} />
                      <div className="app-info">
                        <strong>{app.jobId?.title || "Job Title Unavailable"}</strong>
                        <span>{app.jobId?.company} · {app.jobId?.location}</span>
                        <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="dash-col">
              <div className="dash-panel">
                <div className="panel-header"><h2>Quick Actions</h2></div>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  <button className="panel-btn" onClick={() => navigate("/jobs")}>
                    <FiSearch size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Browse Jobs
                  </button>
                  <button className="panel-btn" onClick={() => onTabChange("Resume")} style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)" }}>
                    <FiFileText size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> My Resume
                  </button>
                  <button className="panel-btn" onClick={fetchRecommendations} disabled={recLoading} style={{ background:"#0ea5e9" }}>
                    <FiTarget size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> AI Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Applications Tab ── */}
      {activeTab === "Applications" && (
        <div className="dash-panel">
          <div className="panel-header">
            <h2>My Applications</h2>
            <button className="panel-link" onClick={() => navigate("/jobs")}>Browse more →</button>
          </div>
          <div className="app-list">
            {applications.length === 0
              ? <p style={{ color:"var(--muted)", padding:"1.5rem 0", textAlign:"center" }}>You haven't applied to any jobs yet. <span style={{ color:"var(--orange)", cursor:"pointer" }} onClick={() => navigate("/jobs")}>Browse jobs →</span></p>
              : applications.map((app) => (
                <div key={app._id} className="app-row">
                  <Avatar initials={app.seekerName?.slice(0,2).toUpperCase() || "JB"} />
                  <div className="app-info">
                    <strong>{app.jobId?.title || "Job Title Unavailable"}</strong>
                    <span style={{ fontSize:"12px", color:"var(--muted)" }}>{app.jobId?.company} · {app.jobId?.location}</span>
                    <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── Jobs Tab ── */}
      {activeTab === "Jobs" && (
        <div className="dash-panel" style={{ textAlign:"center", padding:"3rem 2rem" }}>
          <div style={{ marginBottom: "1rem" }}><FiBriefcase size={40} style={{ color: "var(--muted)" }} /></div>
          <h2 style={{ marginBottom:"0.5rem", color:"var(--dark)" }}>Find Your Next Job</h2>
          <p style={{ color:"var(--muted)", marginBottom:"1.5rem", fontSize:"14px" }}>Browse thousands of curated tech jobs across India</p>
          <button className="panel-btn" onClick={() => navigate("/jobs")} style={{ fontSize:"14px", padding:"10px 28px" }}>Browse All Jobs →</button>
        </div>
      )}

      {/* ── Resume Tab ── */}
      {activeTab === "Resume" && (
        <div className="dash-col">
          <div className="dash-panel">
            <div className="panel-header"><h2><FiFileText size={15} style={{ marginRight: 7, verticalAlign: 'middle' }} /> My Resume</h2></div>
            <ResumeUpload />
            <button className="panel-btn" onClick={fetchAnalysis} disabled={analysisLoading}
              style={{ width:"100%", marginTop:"0.75rem", background:"linear-gradient(135deg,#7c3aed,#5b21b6)", color:"#fff", border:"none" }}>
              {analysisLoading ? (
                <><FiSearch size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Analyzing...</>
              ) : (
                <><FiBarChart2 size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Analyze Resume with AI</>
              )}
            </button>
            {analysisError && <p style={{ color:"#ef4444", fontSize:"13px", textAlign:"center", marginTop:"0.5rem" }}>{analysisError}</p>}
          </div>

          {analysis && (
            <div className="dash-panel" style={{ border:"1.5px solid rgba(124,58,237,0.3)", background:"rgba(124,58,237,0.04)" }}>
              <div className="panel-header" style={{ marginBottom:"1rem" }}>
                <h2 style={{ color:"#7c3aed" }}><FiBarChart2 size={15} style={{ marginRight: 7, verticalAlign: 'middle' }} /> Resume Analysis</h2>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem", flexWrap:"wrap" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", border:`4px solid ${analysis.score>=75?"#22c55e":analysis.score>=50?"#f59e0b":"#ef4444"}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#fff", flexShrink:0 }}>
                  <strong style={{ fontSize:20, color:analysis.score>=75?"#22c55e":analysis.score>=50?"#f59e0b":"#ef4444", lineHeight:1 }}>{analysis.score}</strong>
                  <span style={{ fontSize:10, color:"#94a3b8" }}>/ 100</span>
                </div>
                <div><div style={{ fontSize:18, fontWeight:700, color:"#0f172a" }}>Grade: {analysis.grade}</div><p style={{ margin:0, fontSize:13, color:"#475569", lineHeight:1.5 }}>{analysis.summary}</p></div>
              </div>
              <div style={{ marginBottom:"0.75rem" }}>
                <p style={{ fontWeight:600, color:"#16a34a", fontSize:13, marginBottom:"0.4rem" }}><FiCheckCircle size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Strengths</p>
                {analysis.strengths?.map((s,i) => <div key={i} style={{ display:"flex", gap:"0.4rem", marginBottom:"0.25rem" }}><span style={{ color:"#22c55e" }}>•</span><span style={{ fontSize:13, color:"#334155" }}>{s}</span></div>)}
              </div>
              <div style={{ marginBottom:"0.75rem" }}>
                <p style={{ fontWeight:600, color:"#dc2626", fontSize:13, marginBottom:"0.4rem" }}><FiAlertTriangle size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Areas to Improve</p>
                {analysis.weaknesses?.map((w,i) => <div key={i} style={{ display:"flex", gap:"0.4rem", marginBottom:"0.25rem" }}><span style={{ color:"#ef4444" }}>•</span><span style={{ fontSize:13, color:"#334155" }}>{w}</span></div>)}
              </div>
              {analysis.ats_tips?.length > 0 && (
                <div style={{ background:"rgba(59,130,246,0.07)", borderRadius:8, padding:"0.75rem", border:"1px solid rgba(59,130,246,0.15)" }}>
                  <p style={{ fontWeight:600, color:"#2563eb", fontSize:13, marginBottom:"0.4rem" }}><FiInfo size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} /> ATS Tips</p>
                  {analysis.ats_tips.map((t,i) => <div key={i} style={{ display:"flex", gap:"0.4rem", marginBottom:"0.25rem" }}><span style={{ color:"#3b82f6" }}>→</span><span style={{ fontSize:13, color:"#334155" }}>{t}</span></div>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Profile Tab ── */}
      {activeTab === "Profile" && (
        <div className="dash-panel" style={{ maxWidth:520 }}>
          <div className="panel-header"><h2><FiUser size={15} style={{ marginRight: 7, verticalAlign: 'middle' }} /> My Profile</h2></div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
              <Avatar initials={user.name?.slice(0,2).toUpperCase() || "U"} size={56} />
              <div>
                <div style={{ fontWeight:700, fontSize:16, color:"var(--dark)" }}>{user.name}</div>
                <div style={{ fontSize:13, color:"var(--muted)" }}>{user.email}</div>
                <span className="user-role-badge">Job Seeker</span>
              </div>
            </div>
            <div style={{ background:"var(--cream)", borderRadius:10, padding:"1rem", border:"1px solid var(--border)" }}>
              <p style={{ fontSize:13, color:"var(--muted)" }}>Profile editing coming soon. Your data is securely stored.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Notifications Tab ── */}
      {activeTab === "Notifications" && (() => {
        // Build notification list from applications
        const notifs = [];

        // Status-change notifications from applications
        applications.forEach((app) => {
          const title = app.jobId?.title || "a job";
          const company = app.jobId?.company || "";
          const date = new Date(app.updatedAt || app.appliedAt);

          const statusMap = {
            accepted:    { icon: <FiCheckCircle size={18} color="#16a34a" />, color: "#16a34a", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  text: `Congratulations! Your application for ${title}${company ? ` at ${company}` : ""} has been accepted.` },
            rejected:    { icon: <FiTrash2 size={18} color="#dc2626" />,       color: "#dc2626", bg: "rgba(220,38,38,0.07)",  border: "rgba(220,38,38,0.2)",  text: `Your application for ${title}${company ? ` at ${company}` : ""} was not selected this time.` },
            shortlisted: { icon: <FiTarget size={18} color="#d97706" />,        color: "#d97706", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: `You've been shortlisted for ${title}${company ? ` at ${company}` : ""}!` },
            reviewed:    { icon: <FiEye size={18} color="#3b82f6" />,           color: "#3b82f6", bg: "rgba(59,130,246,0.07)", border: "rgba(59,130,246,0.2)", text: `Your application for ${title} has been reviewed.` },
            Interview:   { icon: <FiCalendar size={18} color="#7c3aed" />,      color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)", text: `You've been invited to interview for ${title}${company ? ` at ${company}` : ""}!` },
            pending:     { icon: <FiList size={18} color="#64748b" />,          color: "#64748b", bg: "rgba(100,116,139,0.06)", border: "rgba(100,116,139,0.2)", text: `Application submitted for ${title}${company ? ` at ${company}` : ""}.` },
          };

          const cfg = statusMap[app.status] || statusMap["pending"];
          notifs.push({ ...cfg, date, id: app._id, status: app.status });
        });

        // Sort newest first
        notifs.sort((a, b) => new Date(b.date) - new Date(a.date));

        function timeAgo(date) {
          const diff = Math.floor((Date.now() - new Date(date)) / 1000);
          if (diff < 60)   return "just now";
          if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
          if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
          return `${Math.floor(diff/86400)}d ago`;
        }

        return (
          <div className="dash-panel">
            <div className="panel-header">
              <h2><FiBell size={15} style={{ marginRight: 7, verticalAlign: 'middle' }} /> Notifications</h2>
              {notifs.length > 0 && (
                <span style={{ fontSize:12, fontWeight:600, padding:"2px 10px", borderRadius:999, background:"rgba(255,107,53,0.12)", color:"var(--orange)" }}>
                  {notifs.length} update{notifs.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {notifs.length === 0 ? (
              <div style={{ textAlign:"center", padding:"3rem 1rem", color:"var(--muted)" }}>
                <div style={{ marginBottom: "1rem" }}><FiBell size={40} style={{ color: "var(--muted)" }} /></div>
                <p style={{ fontSize:15, fontWeight:600, color:"var(--dark)" }}>You're all caught up!</p>
                <p style={{ fontSize:13, marginTop:"0.5rem" }}>Apply to jobs — status updates will appear here.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                {notifs.map((n) => (
                  <div key={n.id} style={{
                    display:"flex", alignItems:"flex-start", gap:"0.875rem",
                    padding:"0.875rem 1rem", borderRadius:12,
                    background: n.bg, border:`1px solid ${n.border}`,
                    transition:"box-shadow 0.2s",
                  }}>
                    {/* Icon bubble */}
                    <div style={{
                      width:40, height:40, borderRadius:"50%",
                      background:"#fff", border:`1.5px solid ${n.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, flexShrink:0,
                    }}>
                      {n.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:0, fontSize:13.5, color:"var(--dark)", lineHeight:1.5, fontWeight:500 }}>
                        {n.text}
                      </p>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginTop:"0.35rem" }}>
                        <span style={{
                          fontSize:11, fontWeight:700, padding:"1px 8px",
                          borderRadius:999, color: n.color,
                          background:"rgba(255,255,255,0.7)",
                          border:`1px solid ${n.border}`,
                          textTransform:"capitalize",
                        }}>
                          {n.status}
                        </span>
                        <span style={{ fontSize:11, color:"var(--muted)" }}>{timeAgo(n.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}


      {/* ── Settings Tab ── */}
      {activeTab === "Settings" && (
        <div className="dash-panel" style={{ maxWidth:520 }}>
          <div className="panel-header"><h2><FiSettings size={15} style={{ marginRight: 7, verticalAlign: 'middle' }} /> Settings</h2></div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <div style={{ background:"var(--cream)", borderRadius:10, padding:"1rem 1.25rem", border:"1px solid var(--border)" }}>
              <strong style={{ display:"block", fontSize:14, color:"var(--dark)", marginBottom:"0.25rem" }}>Account</strong>
              <p style={{ fontSize:13, color:"var(--muted)" }}>Email: {user.email}</p>
            </div>
            <div style={{ background:"var(--cream)", borderRadius:10, padding:"1rem 1.25rem", border:"1px solid var(--border)" }}>
              <strong style={{ display:"block", fontSize:14, color:"var(--dark)", marginBottom:"0.5rem" }}>Danger Zone</strong>
              <button style={{ background:"#fef2f2", border:"1px solid rgba(220,38,38,0.3)", color:"#dc2626", borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Applicant Modal ──────────────────────────────────────────
function ApplicantModal({ applicant, onClose, onStatusUpdate }) {
  const [updating, setUpdating] = useState(false);
  const [message,  setMessage]  = useState("");

  async function handleUpdate(status) {
    setUpdating(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/applications/${applicant._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Status updated!");
        onStatusUpdate(applicant._id, status);
        setTimeout(onClose, 1000);
      } else setMessage(data.message || "Failed to update.");
    } catch { setMessage("Could not connect to server."); }
    finally { setUpdating(false); }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          borderRadius: "16px", padding: "2rem",
          width: "100%", maxWidth: "460px",
          boxShadow: "var(--shadow-hover)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "18px", color: "var(--dark)", fontFamily: "Sora, sans-serif" }}>
            Applicant Details
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--muted)", lineHeight: 1 }}>
            <FiTrash2 size={16} /></button>
        </div>

        {/* Applicant info */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <Avatar initials={applicant.seekerName?.slice(0, 2).toUpperCase() || "U"} size={48} />
          <div>
            <strong style={{ fontSize: "16px", display: "block" }}>{applicant.seekerName}</strong>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>{applicant.seekerEmail}</span>
          </div>
        </div>

        {/* Details */}
        <div style={{
          background: "var(--cream)", borderRadius: "10px", padding: "1rem",
          marginBottom: "1.5rem", fontSize: "14px",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--muted)" }}>Applied on</span>
            <span>{new Date(applicant.appliedAt).toLocaleDateString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--muted)" }}>Current Status</span>
            <StatusBadge status={applicant.status} />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
          <button
            disabled={updating}
            onClick={() => handleUpdate("accepted")}
            style={{
              flex: 1, padding: "10px", borderRadius: "9px", border: "none",
              background: "#22c55e", color: "#fff", fontWeight: 600,
              fontSize: "14px", cursor: "pointer",
            }}
          >
            ✓ Accept
          </button>
          <button
            disabled={updating}
            onClick={() => handleUpdate("reviewed")}
            style={{
              flex: 1, padding: "10px", borderRadius: "9px",
              border: "1.5px solid var(--border)",
              background: "transparent", color: "var(--dark)", fontWeight: 600,
              fontSize: "14px", cursor: "pointer",
            }}
          >
            <FiEye size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Review
          </button>
          <button
            disabled={updating}
            onClick={() => handleUpdate("rejected")}
            style={{
              flex: 1, padding: "10px", borderRadius: "9px", border: "none",
              background: "#ef4444", color: "#fff", fontWeight: 600,
              fontSize: "14px", cursor: "pointer",
            }}
          >
            ✕ Reject
          </button>
        </div>

        {message && (
          <p style={{
            textAlign: "center", fontSize: "13px", margin: 0,
            color: message.includes("updated") ? "#22c55e" : "#ef4444",
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Employer Dashboard ───────────────────────────────────────
function EmployerDashboard({ user, data, externalShowModal, onModalClose }) {
  const jobs             = data?.jobs             || [];
  const recentApplicants = data?.recentApplicants || [];

  const [showModal,        setShowModal]        = useState(false);
  const [form,             setForm]             = useState({ title: "", company: "", location: "", salary: "", type: "Full-time", description: "" });
  const [posting,          setPosting]          = useState(false);
  const [postMsg,          setPostMsg]          = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants,        setApplicants]        = useState(recentApplicants);

  // Keep local applicants list in sync if parent data changes
  useEffect(() => {
    setApplicants(recentApplicants);
  }, [recentApplicants]);

  // Allow parent (topbar button) to open the Post Job modal
  useEffect(() => {
    if (externalShowModal) {
      setShowModal(true);
      onModalClose?.();
    }
  }, [externalShowModal, onModalClose]);

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handlePostJob(e) {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.type || !form.description) {
      setPostMsg("Please fill in all required fields."); return;
    }
    setPosting(true); setPostMsg("");
    try {
      const res = await fetch(`${API}/jobs`, {
        method: "POST", headers: authHeaders(), body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setPostMsg("Job posted successfully!");
        setForm({ title: "", company: "", location: "", salary: "", type: "Full-time", description: "" });
        setTimeout(() => { setShowModal(false); setPostMsg(""); window.location.reload(); }, 1200);
      } else setPostMsg(data.message || "Failed to post job.");
    } catch { setPostMsg("Could not connect to server."); }
    finally { setPosting(false); }
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm("Delete this job?")) return;
    try {
      const res = await fetch(`${API}/jobs/${jobId}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) window.location.reload();
    } catch (err) { console.error("Failed to delete job:", err); }
  }

  return (
    <>
      <div className="stats-row">
        {[
          { label: "Total Jobs",  value: jobs.length },
          { label: "Applicants",  value: applicants.length },
          { label: "Shortlisted", value: applicants.filter(a => a.status === "shortlisted").length },
          { label: "Accepted",    value: applicants.filter(a => a.status === "accepted").length },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Posted Jobs */}
        <div className="dash-panel wide">
          <div className="panel-header">
            <h2>Posted Jobs</h2>
            <button className="panel-btn" onClick={() => setShowModal(true)}>+ Post New Job</button>
          </div>
          {jobs.length === 0 ? (
            <p style={{ color: "var(--muted)", padding: "1rem 0" }}>You haven't posted any jobs yet.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr><th>Job Title</th><th>Company</th><th>Location</th><th>Type</th><th></th></tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="td-title">{job.title}</td>
                    <td>{job.company}</td>
                    <td className="td-muted">{job.location}</td>
                    <td><StatusBadge status={job.type} /></td>
                    <td>
                      <div className="td-actions">
                        <button className="icon-btn" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button
                          className="icon-btn danger" title="Delete"
                          onClick={() => handleDeleteJob(job._id)}
                        >✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Applicants */}
        <div className="dash-panel">
          <div className="panel-header"><h2>Recent Applicants</h2></div>
          {applicants.length === 0 ? (
            <p style={{ color: "var(--muted)", padding: "1rem 0" }}>No applicants yet.</p>
          ) : (
            applicants.map((a) => (
              <div
                key={a._id}
                className="app-row"
                onClick={() => setSelectedApplicant(a)}
                style={{ cursor: "pointer" }}
              >
                <Avatar initials={a.seekerName?.slice(0, 2).toUpperCase() || "U"} />
                <div className="app-info">
                  <strong>{a.seekerName}</strong>
                  <span>{a.seekerEmail}</span>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStatusUpdate={(id, status) => {
            setApplicants(prev =>
              prev.map(a => a._id === id ? { ...a, status } : a)
            );
            setSelectedApplicant(prev => ({ ...prev, status }));
          }}
        />
      )}

      {/* Post Job Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--border)",
              borderRadius: "16px", padding: "2rem",
              width: "100%", maxWidth: "520px",
              boxShadow: "var(--shadow-hover)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "var(--dark)", fontFamily: "Sora, sans-serif" }}>Post a New Job</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "20px", cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center" }}>
                <FiTrash2 size={16} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Job Title *",  name: "title",    placeholder: "e.g. Frontend Developer" },
                { label: "Company *",    name: "company",  placeholder: "e.g. TechCorp" },
                { label: "Location *",   name: "location", placeholder: "e.g. Bangalore / Remote" },
                { label: "Salary",       name: "salary",   placeholder: "e.g. ₹8L – ₹12L" },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>{label}</label>
                  <input
                    type="text" name={name} placeholder={placeholder}
                    value={form[name]} onChange={handleFormChange}
                    style={{
                      width: "100%", padding: "10px 14px",
                      background: "var(--cream)", border: "1.5px solid var(--border)",
                      borderRadius: "8px", color: "var(--dark)",
                      fontSize: "14px", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>Job Type *</label>
                <select
                  name="type" value={form.type} onChange={handleFormChange}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "var(--cream)", border: "1.5px solid var(--border)",
                    borderRadius: "8px", color: "var(--dark)",
                    fontSize: "14px", outline: "none",
                  }}
                >
                  {["Full-time", "Part-time", "Contract", "Remote"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe the role, requirements, and responsibilities..."
                  value={form.description} onChange={handleFormChange} rows={4}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "var(--cream)", border: "1.5px solid var(--border)",
                    borderRadius: "8px", color: "var(--dark)",
                    fontSize: "14px", outline: "none",
                    resize: "vertical", boxSizing: "border-box",
                  }}
                />
              </div>

              {postMsg && (
                <p style={{ fontSize: "13px", textAlign: "center", margin: 0,
                  color: postMsg.includes("success") ? "#22c55e" : "#ef4444",
                }}>{postMsg}</p>
              )}

              <button
                onClick={handlePostJob} disabled={posting}
                style={{
                  padding: "12px", background: "var(--orange)", border: "none",
                  borderRadius: "9px", color: "#fff", fontSize: "14px",
                  fontWeight: 600, cursor: "pointer", marginTop: "0.5rem",
                }}
              >
                {posting ? "Posting..." : "Post Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────
function AdminDashboard({ user, data, activeTab, onRefresh }) {
  const stats        = data?.stats        || {};
  const users        = data?.users        || [];
  const jobs         = data?.jobs         || [];
  const applications = data?.applications || [];

  async function handleDeleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/admin/users/${userId}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) onRefresh();
    } catch (err) { console.error("Failed to delete user:", err); }
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`${API}/admin/jobs/${jobId}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) onRefresh();
    } catch (err) { console.error("Failed to delete job:", err); }
  }

  if (activeTab === "Overview") return (
    <>
      <div className="stats-row">
        {[
          { label: "Total Users",        value: stats.totalUsers        || 0, icon: <FiUsers size={18} /> },
          { label: "Total Jobs",         value: stats.totalJobs         || 0, icon: <FiBriefcase size={18} /> },
          { label: "Total Applications", value: stats.totalApplications || 0, icon: <FiList size={18} /> },
          { label: "Accepted Hires",     value: stats.hires             || 0, icon: <FiTarget size={18} /> },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-top">
              <strong>{s.value}</strong>
              <span style={{ display: "flex", alignItems: "center", color: "var(--muted)" }}>{s.icon}</span>
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="dash-panel wide" style={{ marginTop: "2rem" }}>
        <div className="panel-header">
          <h2>Admin Controls</h2>
        </div>
        <p style={{ color: "var(--muted)" }}>Welcome to the master admin panel. Use the sidebar to navigate to specific resources to moderate the platform.</p>
      </div>
    </>
  );

  if (activeTab === "Users") return (
    <div className="dash-grid">
      <div className="dash-panel wide">
        <div className="panel-header">
          <h2>Platform Users</h2>
          <span className="flag-count">{users.length}</span>
        </div>
        {users.length === 0 ? (
          <p style={{ color: "var(--muted)", padding: "1rem 0" }}>No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="td-user">
                        <Avatar initials={u.name?.slice(0, 2).toUpperCase() || "U"} size={30} />
                        {u.name}
                      </div>
                    </td>
                    <td className="td-muted">{u.email}</td>
                    <td><StatusBadge status={u.role} /></td>
                    <td>
                      {u.role !== "admin" && (
                        <div className="td-actions">
                          <button
                            className="icon-btn danger" title="Delete User (Spam Control)"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  if (activeTab === "Jobs") return (
    <div className="dash-grid">
      <div className="dash-panel wide">
        <div className="panel-header">
          <h2>All Jobs</h2>
          <span className="flag-count">{jobs.length}</span>
        </div>
        {jobs.length === 0 ? (
          <p style={{ color: "var(--muted)", padding: "1rem 0" }}>No jobs yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr><th>Job Title</th><th>Company</th><th>Location</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j._id}>
                    <td><strong>{j.title}</strong></td>
                    <td className="td-muted">{j.company}</td>
                    <td className="td-muted">{j.location}</td>
                    <td>
                      <div className="td-actions">
                        <button
                          className="icon-btn danger" title="Delete job"
                          onClick={() => handleDeleteJob(j._id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  if (activeTab === "Applications") return (
    <div className="dash-grid">
      <div className="dash-panel wide">
        <div className="panel-header">
          <h2>All Applications</h2>
          <span className="flag-count">{applications.length}</span>
        </div>
        {applications.length === 0 ? (
          <p style={{ color: "var(--muted)", padding: "1rem 0" }}>No applications yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr><th>Seeker Name</th><th>Contact</th><th>Status</th><th>Applied Date</th></tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div className="td-user">
                        <Avatar initials={a.seekerName?.slice(0, 2).toUpperCase() || "S"} size={30} />
                        {a.seekerName}
                      </div>
                    </td>
                    <td className="td-muted">{a.seekerEmail}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="td-muted">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dash-panel placeholder">
      <h3>{activeTab} Settings</h3>
      <p style={{ color: "var(--muted)", marginTop: "1rem" }}>This admin feature is coming soon.</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [user,    setUser]    = useState(null);
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);
    fetchDashboardData(parsedUser.role);
  }, [navigate]);

  async function fetchDashboardData(role) {
    setLoading(true);
    try {
      if (role === "seeker") {
        const res  = await fetch(`${API}/applications/me`, { headers: authHeaders() });
        const json = await res.json();
        setData({ applications: json.applications || [] });
      } else if (role === "employer") {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        const res  = await fetch(`${API}/jobs`, { headers: authHeaders() });
        const json = await res.json();
        const myJobs = (json.jobs || []).filter(
          j => j.employerId?.toString() === storedUser.id?.toString()
        );

        const applicantPromises = myJobs.map(job =>
          fetch(`${API}/applications/job/${job._id}`, { headers: authHeaders() })
            .then(r => r.json())
            .then(d => d.applications || [])
        );

        const applicantArrays = await Promise.all(applicantPromises);
        const recentApplicants = applicantArrays.flat();

        setData({ jobs: myJobs, recentApplicants });
      } else if (role === "admin") {
        const [statsRes, usersRes, jobsRes, appsRes] = await Promise.all([
          fetch(`${API}/admin/stats`,        { headers: authHeaders() }),
          fetch(`${API}/admin/users`,        { headers: authHeaders() }),
          fetch(`${API}/admin/jobs`,         { headers: authHeaders() }),
          fetch(`${API}/admin/applications`, { headers: authHeaders() }),
        ]);
        const [stats, users, jobs, apps] = await Promise.all([
          statsRes.json(), usersRes.json(), jobsRes.json(), appsRes.json(),
        ]);
        setData({
          stats,
          users:        users.users        || [],
          jobs:         jobs.jobs          || [],
          applications: apps.applications  || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setData({});
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (!user || loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <span>Loading...</span>
    </div>
  );

  const ROLE_LABELS = { seeker: "Job Seeker", employer: "Employer", admin: "Admin" };

  return (
    <div className="dashboard">
      {/* Mobile top bar (hamburger) */}
      <div className="dash-mobile-topbar">
        <button className="dash-hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Open menu">
          <span /><span /><span />
        </button>
        <span className="dash-mobile-title">Dashboard</span>
        <Avatar initials={user.name ? user.name.slice(0, 2).toUpperCase() : "U"} size={34} />
      </div>

      {/* Overlay backdrop */}
      {sidebarOpen && (
        <div className="dash-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dash-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dash-user">
          <Avatar initials={user.name ? user.name.slice(0, 2).toUpperCase() : "U"} size={44} />
          <div>
            <strong>{user.name || user.email}</strong>
            <span className="user-role-badge">{ROLE_LABELS[user.role] || user.role}</span>
          </div>
        </div>

        <nav className="dash-nav">
          {(() => {
            const notifCount = user.role === "seeker"
              ? (data?.applications || []).length
              : 0;
            return [
              { icon: <FiGrid size={15} />,         label: "Overview",      roles: ["seeker","employer","admin"] },
              { icon: <FiUsers size={15} />,        label: "Users",         roles: ["admin"] },
              { icon: <FiList size={15} />,         label: "Applications",  roles: ["seeker","admin"] },
              { icon: <FiBriefcase size={15} />,    label: "Jobs",          roles: ["seeker","employer","admin"] },
              { icon: <FiFileText size={15} />,     label: "Resume",        roles: ["seeker"] },
              { icon: <FiUser size={15} />,         label: "Profile",       roles: ["seeker","employer","admin"] },
              { icon: <FiBell size={15} />,         label: "Notifications", roles: ["seeker","employer","admin"], badge: notifCount },
              { icon: <FiSettings size={15} />,     label: "Settings",      roles: ["seeker","employer","admin"] },
            ]
              .filter(item => item.roles.includes(user.role))
              .map((item) => (
              <button
                key={item.label}
                className={`nav-item ${activeTab === item.label ? "active" : ""}`}
                onClick={() => { setActiveTab(item.label); setSidebarOpen(false); }}
                style={{ position:"relative" }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge > 0 && activeTab !== "Notifications" && (
                  <span style={{
                    position:"absolute", top:6, right:8,
                    minWidth:18, height:18, borderRadius:999,
                    background:"#ef4444", color:"#fff",
                    fontSize:10, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"0 4px",
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ));
          })()}

        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log out
        </button>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1>{activeTab}</h1>
            <p>Welcome back, {user.name || user.email}</p>
          </div>
          {user.role === "employer" && (
            <button className="panel-btn" onClick={() => setShowEmployerModal(true)}>
              + Post New Job
            </button>
          )}
        </div>

        {user.role === "seeker" && (
          <SeekerDashboard
            user={user}
            data={data}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            navigate={navigate}
          />
        )}
        {user.role === "employer" && (
          <EmployerDashboard
            user={user}
            data={data}
            externalShowModal={showEmployerModal}
            onModalClose={() => setShowEmployerModal(false)}
          />
        )}
        {user.role === "admin" && (
          <AdminDashboard
            user={user} data={data}
            activeTab={activeTab}
            onRefresh={() => fetchDashboardData("admin")}
          />
        )}
      </main>
    </div>
  );
}
