import { Link } from "react-router-dom";
import { FiFileText, FiCheckCircle } from "react-icons/fi";
import "./StaticPages.css";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using JobPortal, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform. We reserve the right to update these terms at any time, and continued use constitutes acceptance of any changes.",
  },
  {
    title: "2. User Accounts",
    content:
      "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Notify us immediately of any unauthorized use.",
  },
  {
    title: "3. Job Seeker Responsibilities",
    items: [
      "Provide truthful and accurate information in your profile and resume",
      "Do not apply to jobs you are not genuinely interested in",
      "Respect employer communications and respond in a timely manner",
      "Do not use the platform for spamming or fraudulent activities",
    ],
  },
  {
    title: "4. Employer Responsibilities",
    items: [
      "Post only genuine job openings with accurate descriptions",
      "Do not discriminate based on race, gender, religion, or disability",
      "Respond to applicants professionally and within a reasonable timeframe",
      "Ensure all posted job listings comply with applicable labor laws",
    ],
  },
  {
    title: "5. Prohibited Activities",
    content:
      "Users may not: post misleading or fraudulent content, scrape or harvest data from the platform, attempt to gain unauthorized access to other accounts or systems, use the platform for any illegal purpose, or upload malicious software or content.",
  },
  {
    title: "6. Intellectual Property",
    content:
      "All content on JobPortal — including logos, design, text, and code — is the intellectual property of JobPortal and DLSDS. Users retain ownership of the content they upload (resumes, job descriptions) but grant us a non-exclusive license to display it on the platform.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "JobPortal is provided \"as is\" without warranties of any kind. We do not guarantee job placement or the accuracy of job listings. We are not liable for any direct, indirect, or consequential damages arising from the use of this platform.",
  },
  {
    title: "8. Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm other users. Upon termination, your right to use the platform ceases immediately.",
  },
  {
    title: "9. Governing Law",
    content:
      "These terms are governed by the laws of India. Any disputes arising from the use of this platform shall be subject to the jurisdiction of courts in Assam, India.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have questions about these Terms of Service, please contact us at support@jobportal.in or through our platform's contact channels.",
  },
];

export default function Terms() {
  return (
    <div className="static-page">
      <div className="static-hero">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / Terms of Service
        </div>
        <h1>Terms of Service</h1>
        <p>
          Please read these terms carefully before using JobPortal.
        </p>
      </div>

      <div className="static-content">
        <p className="legal-update">Last updated: May 2025</p>

        {SECTIONS.map((s) => (
          <div key={s.title} className="static-section">
            <h2>
              <FiFileText size={18} />
              {s.title}
            </h2>
            {s.content && <p>{s.content}</p>}
            {s.items && (
              <ul>
                {s.items.map((item) => (
                  <li key={item}>
                    <span className="li-icon">
                      <FiCheckCircle size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="static-section">
          <div className="highlight-box">
            <p>
              By using JobPortal, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service and our{" "}
              <Link to="/privacy" style={{ color: "#f97316", fontWeight: 600 }}>
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
