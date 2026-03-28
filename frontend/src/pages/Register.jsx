import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const ROLES = [
  {
    id: "seeker",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    label: "Job Seeker",
    desc: "I'm looking for a job",
  },
  {
    id: "employer",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    label: "Employer",
    desc: "I'm hiring talent",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleRoleSelect(r) {
    setRole(r);
    setStep(2);
  }

  function handleBack() {
    setStep(1);
    setError("");
  }

  function validate() {
    if (!formData.name.trim())           return "Full name is required.";
    if (!formData.email.trim())          return "Email is required.";
    if (formData.password.length < 6)    return "Password must be at least 6 characters.";
    if (formData.password !== formData.confirm) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    // --- Simulated register (replace with real API call later) ---
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ name: formData.name, email: formData.email, role }));
      navigate("/dashboard");
    }, 1000);
  }

  const strength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)          s++;
    if (p.length >= 10)         s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e", "#22c55e"][strength];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" fill="currentColor" opacity="0.9"/>
              <path d="M16 7V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="13" r="2" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span>JobPortal</span>
        </div>
        <div className="auth-left-content">
          <h2>Join thousands finding their dream careers.</h2>
          <ul className="auth-benefits">
            {[
              "Access 10,000+ job listings",
              "Apply with one click",
              "Get notified of new matches",
              "Track all your applications",
              "Free forever for job seekers",
            ].map((b) => (
              <li key={b}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          {/* Step indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`}>1</div>
            <div className={`step-line ${step >= 2 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`}>2</div>
          </div>

          {step === 1 ? (
            <>
              <div className="auth-card-header">
                <h1>Create your account</h1>
                <p>First, tell us who you are</p>
              </div>
              <div className="role-cards">
                {ROLES.map((r) => (
                  <button key={r.id} className={`role-card ${role === r.id ? "selected" : ""}`} onClick={() => handleRoleSelect(r.id)}>
                    <div className="role-icon">{r.icon}</div>
                    <strong>{r.label}</strong>
                    <span>{r.desc}</span>
                    <div className="role-arrow">→</div>
                  </button>
                ))}
              </div>
              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </>
          ) : (
            <>
              <div className="auth-card-header">
                <button className="back-btn" onClick={handleBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                </button>
                <h1>{role === "employer" ? "Employer" : "Job Seeker"} Account</h1>
                <p>Fill in your details to get started</p>
              </div>

              {error && (
                <div className="auth-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{role === "employer" ? "Company / Full name" : "Full name"}</label>
                  <div className="input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email address</label>
                  <div className="input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword((p) => !p)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bars">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="strength-bar" style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)" }} />
                        ))}
                      </div>
                      <span style={{ color: strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm password</label>
                  <div className="input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input type="password" name="confirm" placeholder="Re-enter password" value={formData.confirm} onChange={handleChange} />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : "Create Account"}
                </button>
              </form>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}