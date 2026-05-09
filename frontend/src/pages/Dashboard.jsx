import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
            <span style={{ fontSize: "1.5rem" }}>📄</span>
            <div>
              <strong style={{ fontSize: "14px", display: "block" }}>{resume.originalName}</strong>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                {formatSize(resume.fileSize)} · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button className="icon-btn danger" title="Delete resume" onClick={handleDelete}>✕</button>
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
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂</div>
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
        {uploading ? "Uploading..." : resume ? "🔄 Replace Resume" : "📤 Upload Resume"}
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
function SeekerDashboard({ user, data }) {
  const navigate = useNavigate();
  const applications = data?.applications || [];

  const [recommendations, setRecommendations] = useState([]);
  const [recLoading,      setRecLoading]      = useState(false);
  const [recError,        setRecError]        = useState("");
  const [recFetched,      setRecFetched]      = useState(false);

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
      {/* ── Stats row ── */}
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

      {/* ── AI Recommendations ── */}
      <div className="dash-panel" style={{ marginBottom: "1.5rem" }}>
        <div className="panel-header" style={{ marginBottom: "1rem" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
             AI Job Recommendations
          </h2>
          <button
            className="panel-btn"
            onClick={fetchRecommendations}
            disabled={recLoading}
            style={{ minWidth: "160px" }}
          >
            {recLoading ? "Analyzing..." : recFetched ? "🔄 Refresh" : " Match My Resume"}
          </button>
        </div>

        {!recFetched && !recLoading && (
          <div style={{
            textAlign: "center", padding: "2rem",
            background: "var(--cream)", borderRadius: "12px",
            border: "2px dashed var(--border)",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎯</div>
            <p style={{ fontWeight: 600, marginBottom: "0.25rem", color: "var(--dark)" }}>
              Find your perfect job match
            </p>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "1rem" }}>
              Upload your resume and click "Match My Resume" to get AI-powered job recommendations
            </p>
            <button
              className="panel-btn"
              onClick={fetchRecommendations}
              style={{ background: "var(--orange)", color: "#fff", border: "none" }}
            >
               Match My Resume
            </button>
          </div>
        )}

        {recLoading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⏳</div>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>
              AI is analyzing your resume and matching jobs...
            </p>
          </div>
        )}

        {recError && (
          <div style={{
            padding: "1rem", borderRadius: "10px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#ef4444", fontSize: "14px", textAlign: "center",
          }}>
            {recError}
          </div>
        )}

        {recFetched && !recLoading && recommendations.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recommendations.map((rec) => (
              <div key={rec.jobId} style={{
                display: "flex", alignItems: "flex-start",
                gap: "1rem", padding: "1rem 1.25rem",
                background: "var(--cream)", borderRadius: "12px",
                border: "1px solid var(--border)",
              }}>
                <div style={{
                  minWidth: "56px", height: "56px", borderRadius: "50%",
                  border: `3px solid ${scoreColor(rec.score)}`,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: "#fff",
                }}>
                  <strong style={{ fontSize: "15px", color: scoreColor(rec.score), lineHeight: 1 }}>
                    {rec.score}
                  </strong>
                  <span style={{ fontSize: "9px", color: "var(--muted)" }}>/ 100</span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                    <strong style={{ fontSize: "15px", color: "var(--dark)" }}>{rec.title}</strong>
                    <span style={{
                      fontSize: "11px", fontWeight: 600, padding: "2px 8px",
                      borderRadius: "20px", color: "#fff",
                      background: scoreColor(rec.score),
                    }}>
                      {scoreLabel(rec.score)}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 0.4rem" }}>
                    {rec.company} · {rec.location} · {rec.type}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--dark)", margin: 0, lineHeight: 1.5 }}>
                    {rec.reason}
                  </p>
                </div>

                <button
                  className="panel-btn"
                  onClick={() => navigate("/jobs")}
                  style={{ whiteSpace: "nowrap", alignSelf: "center" }}
                >
                  View Job →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom grid ── */}
      <div className="dash-grid">
        <div className="dash-panel wide">
          <div className="panel-header">
            <h2>My Applications</h2>
            <button className="panel-link" onClick={() => navigate("/jobs")}>Browse more →</button>
          </div>
          <div className="app-list">
            {applications.length === 0 ? (
              <p style={{ color: "var(--muted)", padding: "1rem 0" }}>
                You haven't applied to any jobs yet.{" "}
                <span style={{ color: "var(--orange)", cursor: "pointer" }} onClick={() => navigate("/jobs")}>
                  Browse jobs →
                </span>
              </p>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="app-row">
                  <Avatar initials={app.seekerName?.slice(0, 2).toUpperCase() || "JB"} />
                  <div className="app-info">
                    <strong>{app.jobId?.title || "Job Title Unavailable"}</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {app.jobId?.company} · {app.jobId?.location}
                    </span>
                    <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dash-col">
          <div className="dash-panel">
            <div className="panel-header"><h2>Resume</h2></div>
            <ResumeUpload />
          </div>
          <div className="dash-panel">
            <div className="panel-header"><h2>Quick Actions</h2></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button className="panel-btn" onClick={() => navigate("/jobs")}>🔍 Browse Jobs</button>
              <button className="panel-btn" onClick={fetchRecommendations} disabled={recLoading}>
                {recLoading ? "Analyzing..." : " AI Match"}
              </button>
            </div>
          </div>
        </div>
      </div>
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
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--muted)" }}>✕</button>
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
            👁 Review
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
                        <button className="icon-btn" title="Edit">✎</button>
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
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "20px", cursor: "pointer" }}>✕</button>
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
function AdminDashboard({ user, data, onRefresh }) {
  const stats        = data?.stats        || {};
  const users        = data?.users        || [];
  const jobs         = data?.jobs         || [];
  const applications = data?.applications || [];

  async function handleDeleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
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

  return (
    <>
      <div className="stats-row">
        {[
          { label: "Total Users",        value: stats.totalUsers        || 0, icon: "👥" },
          { label: "Total Jobs",         value: stats.totalJobs         || 0, icon: "💼" },
          { label: "Total Applications", value: stats.totalApplications || 0, icon: "📋" },
          { label: "Accepted Hires",     value: stats.hires             || 0, icon: "🎯" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-top">
              <strong>{s.value}</strong>
              <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Users table */}
        <div className="dash-panel wide">
          <div className="panel-header">
            <h2>All Users</h2>
            <span className="flag-count">{users.length}</span>
          </div>
          {users.length === 0 ? (
            <p style={{ color: "var(--muted)", padding: "1rem 0" }}>No users yet.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th></th></tr>
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
                      <div className="td-actions">
                        <button
                          className="icon-btn danger" title="Delete user"
                          onClick={() => handleDeleteUser(u._id)}
                        >⊘</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Jobs table */}
        <div className="dash-panel">
          <div className="panel-header">
            <h2>All Jobs</h2>
            <span className="flag-count">{jobs.length}</span>
          </div>
          {jobs.length === 0 ? (
            <p style={{ color: "var(--muted)", padding: "1rem 0" }}>No jobs yet.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="flagged-row">
                <div className="flagged-info">
                  <strong>{job.title}</strong>
                  <span>{job.company} · {job.location}</span>
                </div>
                <StatusBadge status={job.type} />
                <button
                  className="icon-btn danger" title="Delete job"
                  onClick={() => handleDeleteJob(job._id)}
                >✕</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applications table */}
      <div className="dash-panel" style={{ marginTop: "1.5rem" }}>
        <div className="panel-header">
          <h2>All Applications</h2>
          <span className="flag-count">{applications.length}</span>
        </div>
        {applications.length === 0 ? (
          <p style={{ color: "var(--muted)", padding: "1rem 0" }}>No applications yet.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr><th>Applicant</th><th>Email</th><th>Job</th><th>Applied On</th><th>Status</th></tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div className="td-user">
                      <Avatar initials={app.seekerName?.slice(0, 2).toUpperCase() || "U"} size={30} />
                      {app.seekerName}
                    </div>
                  </td>
                  <td className="td-muted">{app.seekerEmail}</td>
                  <td className="td-muted">{app.jobTitle || app.jobId}</td>
                  <td className="td-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [user,    setUser]    = useState(null);
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmployerModal, setShowEmployerModal] = useState(false);

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
      <aside className="dash-sidebar">
        <div className="dash-user">
          <Avatar initials={user.name ? user.name.slice(0, 2).toUpperCase() : "U"} size={44} />
          <div>
            <strong>{user.name || user.email}</strong>
            <span className="user-role-badge">{ROLE_LABELS[user.role] || user.role}</span>
          </div>
        </div>

        <nav className="dash-nav">
          {[
            { icon: "⊞", label: "Overview",      active: true  },
            { icon: "📋", label: "Applications",  active: false },
            { icon: "💼", label: "Jobs",          active: false },
            { icon: "👤", label: "Profile",       active: false },
            { icon: "🔔", label: "Notifications", active: false },
            { icon: "⚙",  label: "Settings",      active: false },
          ].map((item) => (
            <button key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
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
            <h1>Dashboard</h1>
            <p>Welcome back, {user.name || user.email} 👋</p>
          </div>
          {user.role === "employer" && (
            <button className="panel-btn" onClick={() => setShowEmployerModal(true)}>
              + Post New Job
            </button>
          )}
        </div>

        {user.role === "seeker"   && <SeekerDashboard user={user} data={data} />}
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
            onRefresh={() => fetchDashboardData("admin")}
          />
        )}
      </main>
    </div>
  );
}